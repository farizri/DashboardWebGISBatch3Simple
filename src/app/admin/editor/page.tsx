"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings, ClipboardList, BarChart2, FolderOpen, BookOpen,
  Save, CheckCircle, Plus, Trash2, ChevronDown, ChevronRight,
  Link2, Users, List, FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./editor.module.css";

// ─── Types ───────────────────────────────────────────────────

interface ConfigMap { [key: string]: string; }

interface Participant {
  id: string;
  name: string;
  email: string;
  sort_order: number;
}

interface Task {
  id: string;
  task_order: number;
  number: string;
  title: string;
  phase: string;
}

interface MateriRow {
  id: string;
  session_no: number;
  number_label: string;
  title: string;
  category: string;
  materi_url: string;
  playlist_url: string;
  youtube_id: string;
  topics: string[];
}

type Section =
  | "umum-tertib"
  | "umum-kontak"
  | "absensi"
  | "posttest"
  | "tugas-peserta"
  | "tugas-list"
  | "materi";

const CATEGORY_COLORS: Record<string, string> = {
  Concept: "#3b82f6", Frontend: "#8b5cf6", WebMap: "#22c55e",
  Python: "#f59e0b", Event: "#ef4444",
};
const CATEGORIES = ["Concept", "Frontend", "WebMap", "Python"];

const QUIZ_LABELS = [
  "Sesi 1 & 2: Onboarding & Get to Know WebGIS",
  "Sesi 3: GIS Fundamental",
  "Sesi 4: Location Value with GEO MAPID",
  "Sesi 5: Introduction to VS Code, Git, HTML & CSS",
  "Sesi 6: HTML and CSS Part 2 — Tailwind & Layouting",
  "Sesi 7: JavaScript Part 1 — Fundamentals",
  "Sesi 8 & 9: JavaScript Part 2 & Modern JS — DOM & Async",
  "Sesi 10: Introduction to WebMap & MapLibre Part 1",
  "Sesi 11: Introduction to WebMap & MapLibre Part 2",
  "Sesi 12: Introduction to WebMap & MapLibre Part 3",
  "Sesi 13: Feature Implementation Part 1 — Heatmap",
  "Sesi 14: Feature Implementation Part 2 — Radius/Buffer",
  "Sesi 14: Feature Implementation Part 2 — Isochrone Analysis",
  "Sesi 15: WebGIS Code Refinement and Deployment",
  "Sesi 16 & 17: Python for Spatial Data & Automation (Bonus)",
];

// ─── Helpers ─────────────────────────────────────────────────

function SaveRow({
  onSave, saving, saved,
}: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className={styles.rowActions}>
      <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
        <Save size={13} /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
      {saved && <span className={styles.savedMsg}><CheckCircle size={13} /> Tersimpan</span>}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function AdminEditorPage() {
  const [section, setSection] = useState<Section>("umum-tertib");
  const [loading, setLoading] = useState(true);

  // Config key-value
  const [config, setConfig] = useState<ConfigMap>({});
  const [savingConfig, setSavingConfig] = useState(false);
  const [savedConfig, setSavedConfig] = useState(false);

  // Participants
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [savingP, setSavingP] = useState(false);
  const [savedP, setSavedP] = useState(false);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savingT, setSavingT] = useState(false);
  const [savedT, setSavedT] = useState(false);

  // Materi
  const [materiList, setMateriList] = useState<MateriRow[]>([]);
  const [openMateri, setOpenMateri] = useState<string | null>(null);
  const [savingM, setSavingM] = useState<string | null>(null);
  const [savedM, setSavedM] = useState<string | null>(null);

  // Post-test config
  const [totalPT, setTotalPT] = useState(1);
  const [ptConfigId, setPtConfigId] = useState("");
  const [savingPT, setSavingPT] = useState(false);
  const [savedPT, setSavedPT] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [cfgRes, pRes, tRes, mRes, ptRes] = await Promise.all([
      supabase.from("site_config").select("key, value"),
      supabase.from("config_participants").select("*").order("sort_order"),
      supabase.from("config_tasks").select("*").order("task_order"),
      supabase.from("config_materi").select("*").order("session_no"),
      supabase.from("post_test_config").select("id, total_sessions").limit(1).single(),
    ]);

    const cfgMap: ConfigMap = {};
    (cfgRes.data ?? []).forEach((r) => { cfgMap[r.key] = r.value; });
    setConfig(cfgMap);

    setParticipants((pRes.data ?? []) as Participant[]);
    setTasks((tRes.data ?? []) as Task[]);

    const mData = (mRes.data ?? []) as MateriRow[];
    setMateriList(mData.map((m) => ({
      ...m,
      topics: Array.isArray(m.topics) ? m.topics : [],
    })));

    if (ptRes.data) {
      setTotalPT(ptRes.data.total_sessions);
      setPtConfigId(ptRes.data.id);
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]); // eslint-disable-line react-hooks/set-state-in-effect

  // ── Config helpers ────────────────────────────────────────

  const cfg = (key: string) => config[key] ?? "";
  const setCfg = (key: string, val: string) =>
    setConfig((prev) => ({ ...prev, [key]: val }));

  const saveConfig = async (keys: string[]) => {
    setSavingConfig(true);
    await Promise.all(
      keys.map((key) =>
        supabase.from("site_config").upsert({ key, value: cfg(key), updated_at: new Date().toISOString() })
      )
    );
    setSavingConfig(false);
    setSavedConfig(true);
    setTimeout(() => setSavedConfig(false), 2500);
  };

  // ── Participant CRUD ──────────────────────────────────────

  const updateParticipant = (id: string, field: keyof Participant, val: string) =>
    setParticipants((prev) => prev.map((p) => p.id === id ? { ...p, [field]: val } : p));

  const addParticipant = () => {
    const newP: Participant = {
      id: `new-${Date.now()}`,
      name: "",
      email: "",
      sort_order: participants.length + 1,
    };
    setParticipants((prev) => [...prev, newP]);
  };

  const removeParticipant = (id: string) =>
    setParticipants((prev) => prev.filter((p) => p.id !== id));

  const saveParticipants = async () => {
    setSavingP(true);
    const valid = participants.filter((p) => p.name.trim());
    // Delete all and re-insert for simplicity
    await supabase.from("config_participants").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (valid.length > 0) {
      await supabase.from("config_participants").insert(
        valid.map((p, i) => ({ name: p.name.trim(), email: p.email, sort_order: i + 1 }))
      );
    }
    setSavingP(false);
    setSavedP(true);
    setTimeout(() => setSavedP(false), 2500);
    fetchAll();
  };

  // ── Task CRUD ─────────────────────────────────────────────

  const updateTask = (id: string, field: keyof Task, val: string) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, [field]: val } : t));

  const addTask = () => {
    const newT: Task = {
      id: `new-${Date.now()}`,
      task_order: tasks.length + 1,
      number: `Tugas ${tasks.length + 1}`,
      title: "",
      phase: "",
    };
    setTasks((prev) => [...prev, newT]);
  };

  const removeTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const saveTasks = async () => {
    setSavingT(true);
    const valid = tasks.filter((t) => t.title.trim());
    await supabase.from("config_tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (valid.length > 0) {
      await supabase.from("config_tasks").insert(
        valid.map((t, i) => ({
          task_order: i + 1,
          number: t.number,
          title: t.title,
          phase: t.phase,
        }))
      );
    }
    setSavingT(false);
    setSavedT(true);
    setTimeout(() => setSavedT(false), 2500);
    fetchAll();
  };

  // ── Materi CRUD ───────────────────────────────────────────

  const updateMateri = (id: string, field: keyof MateriRow, val: string | string[]) =>
    setMateriList((prev) => prev.map((m) => m.id === id ? { ...m, [field]: val } : m));

  const updateTopic = (id: string, idx: number, val: string) =>
    setMateriList((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const topics = [...m.topics];
        topics[idx] = val;
        return { ...m, topics };
      })
    );

  const addTopic = (id: string) =>
    setMateriList((prev) =>
      prev.map((m) => m.id === id ? { ...m, topics: [...m.topics, ""] } : m)
    );

  const removeTopic = (id: string, idx: number) =>
    setMateriList((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const topics = m.topics.filter((_, i) => i !== idx);
        return { ...m, topics };
      })
    );

  const addMateri = () => {
    const nextNo = materiList.length > 0 ? Math.max(...materiList.map((m) => m.session_no)) + 1 : 1;
    const newM: MateriRow = {
      id: `new-${Date.now()}`,
      session_no: nextNo,
      number_label: `Sesi ${nextNo}`,
      title: "",
      category: "Concept",
      materi_url: "",
      playlist_url: "",
      youtube_id: "",
      topics: [],
    };
    setMateriList((prev) => [...prev, newM]);
    setOpenMateri(newM.id);
  };

  const removeMateri = (id: string) =>
    setMateriList((prev) => prev.filter((m) => m.id !== id));

  const saveMateri = async (m: MateriRow) => {
    setSavingM(m.id);
    const payload = {
      session_no: m.session_no,
      number_label: m.number_label,
      title: m.title,
      category: m.category,
      materi_url: m.materi_url,
      playlist_url: m.playlist_url,
      youtube_id: m.youtube_id,
      topics: m.topics.filter((t) => t.trim()),
    };
    if (m.id.startsWith("new-")) {
      await supabase.from("config_materi").insert(payload);
    } else {
      await supabase.from("config_materi").update(payload).eq("id", m.id);
    }
    setSavingM(null);
    setSavedM(m.id);
    setTimeout(() => setSavedM(null), 2500);
    fetchAll();
  };

  // ── Post-Test config ──────────────────────────────────────

  const savePT = async () => {
    setSavingPT(true);
    await supabase.from("post_test_config").update({ total_sessions: totalPT, updated_at: new Date().toISOString() }).eq("id", ptConfigId);
    setSavingPT(false);
    setSavedPT(true);
    setTimeout(() => setSavedPT(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat editor...</div>;

  // ─── Render ─────────────────────────────────────────────

  const NAV: { id: Section; label: string; group: string; icon: React.ReactNode }[] = [
    { id: "umum-tertib",    label: "Tata Tertib",       group: "Pengaturan Umum", icon: <FileText size={13} /> },
    { id: "umum-kontak",    label: "Kontak & Link",     group: "Pengaturan Umum", icon: <Link2 size={13} /> },
    { id: "absensi",        label: "Absensi Setup",     group: "Absensi",         icon: <ClipboardList size={13} /> },
    { id: "posttest",       label: "Post-Test Setup",   group: "Post-Test",       icon: <BarChart2 size={13} /> },
    { id: "tugas-peserta",  label: "Daftar Peserta",    group: "Monitoring Tugas", icon: <Users size={13} /> },
    { id: "tugas-list",     label: "Daftar Tugas",      group: "Monitoring Tugas", icon: <List size={13} /> },
    { id: "materi",         label: "Materi & Video",    group: "Materi",          icon: <BookOpen size={13} /> },
  ];

  const groups = [...new Set(NAV.map((n) => n.group))];

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        {groups.map((g) => (
          <div key={g}>
            <div className={styles.sidebarTitle}>{g}</div>
            {NAV.filter((n) => n.group === g).map((n) => (
              <button
                key={n.id}
                className={`${styles.sidebarBtn} ${section === n.id ? styles.sidebarActive : ""}`}
                onClick={() => setSection(n.id)}
              >
                {n.icon} {n.label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>

        {/* ══ TATA TERTIB ══════════════════════════════════ */}
        {section === "umum-tertib" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><FileText size={18} /> Tata Tertib & Ketentuan Akademik</h2>
                <p>Edit 4 poin tata tertib yang ditampilkan di halaman Schedule & Rules.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><ClipboardList size={15} /> Poin-Poin Tata Tertib</div>
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={styles.ruleCard}>
                  <div className={styles.ruleHeader}>
                    <span className={styles.ruleNum}>{n}</span>
                    <strong style={{ fontSize: 13, color: "var(--primary)" }}>Poin {n}</strong>
                  </div>
                  <div className={styles.field}>
                    <label>Judul</label>
                    <input
                      className={styles.input}
                      value={cfg(`tata_tertib_${n}_title`)}
                      onChange={(e) => setCfg(`tata_tertib_${n}_title`, e.target.value)}
                      placeholder="Judul poin tata tertib..."
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Deskripsi</label>
                    <textarea
                      className={styles.textarea}
                      value={cfg(`tata_tertib_${n}_desc`)}
                      onChange={(e) => setCfg(`tata_tertib_${n}_desc`, e.target.value)}
                      placeholder="Isi deskripsi..."
                    />
                  </div>
                </div>
              ))}
              <SaveRow
                onSave={() => saveConfig([
                  "tata_tertib_1_title", "tata_tertib_1_desc",
                  "tata_tertib_2_title", "tata_tertib_2_desc",
                  "tata_tertib_3_title", "tata_tertib_3_desc",
                  "tata_tertib_4_title", "tata_tertib_4_desc",
                ])}
                saving={savingConfig}
                saved={savedConfig}
              />
            </div>
          </>
        )}

        {/* ══ KONTAK & LINK ══════════════════════════════════ */}
        {section === "umum-kontak" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><Link2 size={18} /> Kontak Fasilitator & Link Penting</h2>
                <p>Edit nomor fasilitator, link Discord, dan link Zoom yang ditampilkan di dashboard.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Users size={15} /> Fasilitator</div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nama Fasilitator 1</label>
                  <input className={styles.input} value={cfg("fasilitator_1_name")} onChange={(e) => setCfg("fasilitator_1_name", e.target.value)} placeholder="Farah" />
                </div>
                <div className={styles.field}>
                  <label>No. WA / Kontak Fasilitator 1</label>
                  <input className={styles.input} value={cfg("fasilitator_1_phone")} onChange={(e) => setCfg("fasilitator_1_phone", e.target.value)} placeholder="+62 8xx xxxx xxxx" />
                </div>
                <div className={styles.field}>
                  <label>Nama Fasilitator 2</label>
                  <input className={styles.input} value={cfg("fasilitator_2_name")} onChange={(e) => setCfg("fasilitator_2_name", e.target.value)} placeholder="Rofi" />
                </div>
                <div className={styles.field}>
                  <label>No. WA / Kontak Fasilitator 2</label>
                  <input className={styles.input} value={cfg("fasilitator_2_phone")} onChange={(e) => setCfg("fasilitator_2_phone", e.target.value)} placeholder="+62 8xx xxxx xxxx" />
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Link2 size={15} /> Link Platform</div>
              <div className={styles.field}>
                <label>Link Discord Server</label>
                <input className={styles.input} value={cfg("discord_link")} onChange={(e) => setCfg("discord_link", e.target.value)} placeholder="https://discord.gg/..." />
              </div>
              <div className={styles.field}>
                <label>Link Zoom Meeting</label>
                <input className={styles.input} value={cfg("zoom_link")} onChange={(e) => setCfg("zoom_link", e.target.value)} placeholder="https://zoom.us/j/..." />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Zoom Meeting ID</label>
                  <input className={styles.input} value={cfg("zoom_meeting_id")} onChange={(e) => setCfg("zoom_meeting_id", e.target.value)} placeholder="882 1928 3192" />
                </div>
                <div className={styles.field}>
                  <label>Zoom Passcode</label>
                  <input className={styles.input} value={cfg("zoom_passcode")} onChange={(e) => setCfg("zoom_passcode", e.target.value)} placeholder="mapidacademy" />
                </div>
              </div>
              <SaveRow
                onSave={() => saveConfig([
                  "fasilitator_1_name", "fasilitator_1_phone",
                  "fasilitator_2_name", "fasilitator_2_phone",
                  "discord_link", "zoom_link", "zoom_meeting_id", "zoom_passcode",
                ])}
                saving={savingConfig}
                saved={savedConfig}
              />
            </div>
          </>
        )}

        {/* ══ ABSENSI SETUP ══════════════════════════════════ */}
        {section === "absensi" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><ClipboardList size={18} /> Absensi Setup</h2>
                <p>Atur link pengisian absensi yang ditampilkan di halaman Rekapitulasi Absensi Kehadiran.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Link2 size={15} /> Link Form Absensi</div>
              <div className={styles.field}>
                <label>URL Google Form / Link Absensi</label>
                <input
                  className={styles.input}
                  value={cfg("attendance_link")}
                  onChange={(e) => setCfg("attendance_link", e.target.value)}
                  placeholder="https://forms.gle/..."
                />
              </div>
              <p style={{ fontSize: 12, color: "#64748b" }}>
                Link ini akan ditampilkan sebagai tombol <strong>&quot;Isi Absensi Sekarang&quot;</strong> di halaman Absensi dashboard peserta.
              </p>
              <SaveRow
                onSave={() => saveConfig(["attendance_link"])}
                saving={savingConfig}
                saved={savedConfig}
              />
            </div>
          </>
        )}

        {/* ══ POST-TEST SETUP ══════════════════════════════════ */}
        {section === "posttest" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><BarChart2 size={18} /> Konfigurasi Sesi Post-Test</h2>
                <p>Pilih berapa sesi post-test yang aktif untuk peserta. Peserta hanya bisa mengerjakan hingga sesi yang diaktifkan.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Settings size={15} /> Total Sesi Aktif</div>
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <input
                  type="range"
                  min={1} max={15}
                  value={totalPT}
                  onChange={(e) => setTotalPT(Number(e.target.value))}
                  style={{ flex: 1, minWidth: 200, accentColor: "var(--accent-indigo)" }}
                />
                <span style={{ fontSize: 36, fontWeight: 900, color: "var(--accent-indigo)", minWidth: 40, textAlign: "center" }}>{totalPT}</span>
              </div>
              <SaveRow onSave={savePT} saving={savingPT} saved={savedPT} />
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><List size={15} /> Sesi yang Aktif</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Array.from({ length: totalPT }, (_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", background: "#f8fafc", borderRadius: 9, border: "1px solid var(--border)" }}>
                    <span style={{ background: "var(--accent-indigo)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 100 }}>
                      PT{i + 1}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--primary)" }}>{QUIZ_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ DAFTAR PESERTA ══════════════════════════════════ */}
        {section === "tugas-peserta" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><Users size={18} /> Daftar Peserta</h2>
                <p>Edit nama dan email peserta yang tampil di semua tab dashboard (Absensi, Post-Test, Monitoring Tugas).</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><Users size={15} /> Peserta Terdaftar</div>
              <div className={styles.listCard}>
                {participants.map((p, i) => (
                  <div key={p.id} className={`${styles.listRow} ${styles.listRowParticipant}`}>
                    <span className={styles.listNum}>{i + 1}</span>
                    <input
                      className={styles.input}
                      value={p.name}
                      onChange={(e) => updateParticipant(p.id, "name", e.target.value)}
                      placeholder="Nama lengkap..."
                    />
                    <input
                      className={styles.input}
                      value={p.email}
                      onChange={(e) => updateParticipant(p.id, "email", e.target.value)}
                      placeholder="email@gmail.com"
                    />
                    <button className={styles.deleteBtn} onClick={() => removeParticipant(p.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.addRowBtn} onClick={addParticipant}>
                <Plus size={14} /> Tambah Peserta
              </button>
              <SaveRow onSave={saveParticipants} saving={savingP} saved={savedP} />
            </div>
          </>
        )}

        {/* ══ DAFTAR TUGAS ══════════════════════════════════ */}
        {section === "tugas-list" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><FolderOpen size={18} /> Daftar Tugas</h2>
                <p>Atur daftar tugas yang tampil di form pengumpulan dan rekapitulasi Monitoring Tugas.</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}><List size={15} /> List Tugas</div>
              <div className={styles.listCard}>
                {tasks.map((t, i) => (
                  <div key={t.id} className={`${styles.listRow} ${styles.listRowTask}`}>
                    <span className={styles.listNum}>{i + 1}</span>
                    <input
                      className={styles.input}
                      value={t.number}
                      onChange={(e) => updateTask(t.id, "number", e.target.value)}
                      placeholder="Tugas 1"
                    />
                    <input
                      className={styles.input}
                      value={t.title}
                      onChange={(e) => updateTask(t.id, "title", e.target.value)}
                      placeholder="Judul tugas..."
                    />
                    <input
                      className={styles.input}
                      value={t.phase}
                      onChange={(e) => updateTask(t.id, "phase", e.target.value)}
                      placeholder="Fase / Phase"
                    />
                    <button className={styles.deleteBtn} onClick={() => removeTask(t.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.addRowBtn} onClick={addTask}>
                <Plus size={14} /> Tambah Tugas
              </button>
              <SaveRow onSave={saveTasks} saving={savingT} saved={savedT} />
            </div>
          </>
        )}

        {/* ══ MATERI & VIDEO ══════════════════════════════════ */}
        {section === "materi" && (
          <>
            <div className={styles.panelHeader}>
              <div>
                <h2><BookOpen size={18} /> Materi & Video Rekaman</h2>
                <p>Edit konten setiap sesi: judul, tag kategori, poin-poin materi, link GitHub, dan link video rekaman.</p>
              </div>
            </div>

            {materiList.map((m) => (
              <div key={m.id} className={styles.materiCard}>
                {/* Card Header */}
                <div
                  className={`${styles.materiCardHead} ${openMateri === m.id ? styles.materiCardHeadOpen : ""}`}
                  onClick={() => setOpenMateri(openMateri === m.id ? null : m.id)}
                >
                  <div className={styles.materiCardHeadLeft}>
                    <span className={styles.sessionNumBadge}>{m.number_label}</span>
                    <span
                      className={styles.categoryPill}
                      style={{ background: CATEGORY_COLORS[m.category] + "22", color: CATEGORY_COLORS[m.category] }}
                    >
                      {m.category}
                    </span>
                    <span className={styles.materiCardTitle}>{m.title || <span style={{ color: "#94a3b8" }}>Belum ada judul</span>}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {savedM === m.id && <span className={styles.savedMsg}><CheckCircle size={12} /> Tersimpan</span>}
                    <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); removeMateri(m.id); }}>
                      <Trash2 size={13} />
                    </button>
                    {openMateri === m.id ? <ChevronDown size={16} color="#64748b" /> : <ChevronRight size={16} color="#94a3b8" />}
                  </div>
                </div>

                {/* Card Body */}
                {openMateri === m.id && (
                  <div className={styles.materiCardBody}>
                    <div className={styles.formGrid3}>
                      <div className={styles.field}>
                        <label>No. Sesi (integer)</label>
                        <input
                          className={styles.input}
                          type="number"
                          value={m.session_no}
                          onChange={(e) => updateMateri(m.id, "session_no", e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <label>Label Sesi</label>
                        <input
                          className={styles.input}
                          value={m.number_label}
                          onChange={(e) => updateMateri(m.id, "number_label", e.target.value)}
                          placeholder="Sesi 1"
                        />
                      </div>
                      <div className={styles.field}>
                        <label>YouTube Video ID</label>
                        <input
                          className={styles.input}
                          value={m.youtube_id}
                          onChange={(e) => updateMateri(m.id, "youtube_id", e.target.value)}
                          placeholder="dQw4w9WgXcQ"
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label>Judul Sesi</label>
                      <input
                        className={styles.input}
                        value={m.title}
                        onChange={(e) => updateMateri(m.id, "title", e.target.value)}
                        placeholder="Judul materi sesi..."
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Kategori / Tag</label>
                      <div className={styles.categoryBtns}>
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            className={`${styles.catBtn} ${m.category === cat ? styles.catBtnActive : ""}`}
                            style={m.category === cat ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] } : {}}
                            onClick={() => updateMateri(m.id, "category", cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label>Link Materi (GitHub)</label>
                        <input
                          className={styles.input}
                          value={m.materi_url}
                          onChange={(e) => updateMateri(m.id, "materi_url", e.target.value)}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className={styles.field}>
                        <label>Link Rekaman (YouTube / Playlist)</label>
                        <input
                          className={styles.input}
                          value={m.playlist_url}
                          onChange={(e) => updateMateri(m.id, "playlist_url", e.target.value)}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label>Poin-Poin Materi</label>
                      <div className={styles.topicsEditor}>
                        {m.topics.map((topic, idx) => (
                          <div key={idx} className={styles.topicRow}>
                            <input
                              className={styles.topicInput}
                              value={topic}
                              onChange={(e) => updateTopic(m.id, idx, e.target.value)}
                              placeholder={`Poin ${idx + 1}...`}
                            />
                            <button className={styles.deleteBtn} onClick={() => removeTopic(m.id, idx)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                        <button className={styles.addTopicBtn} onClick={() => addTopic(m.id)}>
                          <Plus size={12} /> Tambah Poin
                        </button>
                      </div>
                    </div>

                    <button
                      className={styles.saveBtn}
                      onClick={() => saveMateri(m)}
                      disabled={savingM === m.id}
                    >
                      <Save size={13} /> {savingM === m.id ? "Menyimpan..." : "Simpan Sesi Ini"}
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button className={styles.addRowBtn} style={{ padding: "14px" }} onClick={addMateri}>
              <Plus size={14} /> Tambah Sesi Baru
            </button>
          </>
        )}
      </main>
    </div>
  );
}
