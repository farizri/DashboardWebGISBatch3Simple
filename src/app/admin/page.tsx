"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Save, CheckCircle, Plus, Trash2, ExternalLink,
  Users, ClipboardCheck, BookOpenCheck, FolderOpen,
  LayoutDashboard, ScrollText, PlayCircle, Trophy,
  ChevronDown, ChevronUp, BarChart2, ImageIcon,
  CalendarDays, Wrench, Link2, Star, UserCheck,
  MessageCircle, GraduationCap, AlertCircle, ListChecks,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SessionRow, SoftwareRow, LinkRow } from "@/lib/supabase";
import styles from "./admin.module.css";

// ─── Types ───────────────────────────────────────────────
interface Participant { id?: string; name: string; email: string; sort_order: number; }
interface TaskItem    { id?: string; task_order: number; number: string; title: string; phase: string; }
interface QuizScore   { participant: string; session_key: number; score: number; }
interface QuizQuestion {
  id?: string; session_key: number; sort_order: number;
  question_text: string; options: string[]; correct_answer: number; image_url: string;
}
interface ExamQuestion {
  id?: string; sort_order: number;
  question_text: string; options: string[]; correct_answer: number; image_url: string;
}
interface ExamScore { participant: string; score: number; attempt_no: number; }
interface Submission  { id: string; participant: string; task_id: number; task_number: string; task_title: string; url: string; submitted_at: string; }
interface FinalProject{ participant: string; url: string; submitted_at: string; }
interface QuizFeedback{
  id: string; participant: string; session_key: number;
  material_relevance: number; material_flow_clarity: number;
  hands_on_helpfulness: number; mentor_explanation: number;
  facilitator_responsiveness: number; webgis_project_readiness: number;
  feedback_text?: string; submitted_at: string;
}

// ─── Quiz Session Labels ──────────────────────────────────
const QUIZ_SESSIONS = [
  "Sesi 1 & 2: Onboarding & Get to Know WebGIS",
  "Sesi 3: GIS Fundamental",
  "Sesi 4: Location Value with GEO MAPID",
  "Sesi 5: Introduction to VS Code, Git, HTML & CSS",
  "Sesi 6: HTML and CSS Part 2 — Tailwind & Layouting",
  "Sesi 7: JavaScript Part 1 — Fundamentals",
  "Sesi 8 & 9: JavaScript Part 2 & Modern JS",
  "Sesi 10: Introduction to WebMap & MapLibre Part 1",
  "Sesi 11: Introduction to WebMap & MapLibre Part 2",
  "Sesi 12: Introduction to WebMap & MapLibre Part 3",
  "Sesi 13: Feature Implementation Part 1 — Heatmap",
  "Sesi 14: Feature Implementation Part 2 — Radius",
  "Sesi 14: Feature Implementation Part 3 — Isochrone",
  "Sesi 15: WebGIS Refinement and Deployment",
  "Sesi 16 & 17: Python for Spatial Data (Bonus)",
];

// ─── Main Router ──────────────────────────────────────────
function AdminContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  return (
    <div className={styles.page}>
      {tab === "overview"  && <TabOverview />}
      {tab === "tatib"     && <TabTatib />}
      {tab === "schedule"  && <TabSchedule />}
      {tab === "absensi"   && <TabAbsensi />}
      {tab === "exam"      && <TabExam />}
      {tab === "posttest"  && <TabPostTest />}
      {tab === "tugas"     && <TabTugas />}
      {tab === "materi"    && <TabMateri />}
      {tab === "software"  && <TabSoftware />}
      {tab === "links"     && <TabLinks />}
      {tab === "final"     && <TabFinal />}
      {tab === "feedback"  && <TabFeedback />}
      {tab === "peserta"   && <TabPeserta />}
      {tab === "penilaian" && <TabPenilaian />}
      {tab === "kelompok"  && <TabKelompok />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Memuat Admin Panel...</div>}>
      <AdminContent />
    </Suspense>
  );
}

// ════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ════════════════════════════════════════════════════════
function TabOverview() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState({ participants: 0, attendances: 0, submissions: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { count: a }, { count: t }, { count: q }] = await Promise.all([
        supabase.from("config_participants").select("*").order("sort_order"),
        supabase.from("attendance").select("*", { count: "exact", head: true }).eq("attended", true),
        supabase.from("task_submissions").select("*", { count: "exact", head: true }),
        supabase.from("quiz_scores").select("*", { count: "exact", head: true }),
      ]);
      setParticipants((p as Participant[]) || []);
      setStats({ participants: p?.length || 0, attendances: a || 0, submissions: t || 0, quizzes: q || 0 });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className={styles.loading}>Memuat data...</div>;

  const statCards = [
    { label: "Total Peserta",       value: stats.participants, icon: <Users size={18} />,         bg: "#eff6ff", color: "#3b82f6" },
    { label: "Absensi Hadir",       value: stats.attendances,  icon: <ClipboardCheck size={18} />, bg: "#f0fdf4", color: "#22c55e" },
    { label: "Tugas Dikumpulkan",   value: stats.submissions,  icon: <FolderOpen size={18} />,     bg: "#fefce8", color: "#f59e0b" },
    { label: "Jawaban Post Test",   value: stats.quizzes,      icon: <BookOpenCheck size={18} />,  bg: "#fdf4ff", color: "#a855f7" },
  ];

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><LayoutDashboard size={20} /> Dashboard</h2>
          <p>Ringkasan data program WebGIS Bootcamp Batch 3</p>
        </div>
      </div>
      <div className={styles.statsRow}>
        {statCards.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}><Users size={15} /> Daftar Peserta</div>
        <table className={styles.summaryTable}>
          <thead><tr><th>#</th><th>Nama</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            {participants.map((p, i) => (
              <tr key={p.name}>
                <td style={{ color: "#94a3b8", fontWeight: 700, fontSize: 12 }}>{i + 1}</td>
                <td style={{ fontWeight: 700 }}>{p.name}</td>
                <td style={{ fontSize: 12, color: "#64748b" }}>{p.email || "—"}</td>
                <td><span className={`${styles.statusBadge} ${styles.statusActive}`}>Aktif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: TATA TERTIB & KONTAK
// ════════════════════════════════════════════════════════
function TabTatib() {
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_config").select("key,value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
      setCfg(map);
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: string) => setCfg(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const entries = [{ key: "zoom_link", value: cfg["zoom_link"] || "", updated_at: new Date().toISOString() }];
    await supabase.from("site_config").upsert(entries, { onConflict: "key" });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat konfigurasi...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><ScrollText size={20} /> Tata Tertib & Kontak</h2>
          <p>Edit ketentuan akademik, fasilitator, dan link platform</p>
        </div>
        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}><ScrollText size={14} /> Tata Tertib & Ketentuan Akademik</div>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: -8 }}>Ketentuan akademik bersifat tetap dan tidak dapat diubah melalui admin panel.</p>
        {[
          { title: "Penyelesaian Post Test",           desc: "Post test wajib diisi setiap selesai mengikuti masing-masing sesi pertemuan." },
          { title: "Konektivitas Tugas Terintegrasi",  desc: "Tugas mingguan (Sesi 1–15) saling berkesinambungan membentuk final project WebGIS mandiri." },
          { title: "Evaluasi Logika Mandiri",          desc: "Penilaian berfokus pada pemahaman sintaks. AI diperbolehkan sebagai asisten logika, bukan full generate." },
          { title: "Fokus Penilaian Portofolio",       desc: "Dievaluasi atas: Storytelling, UI/UX Peta, fungsionalitas WebGIS, dan hasil deploy cloud." },
        ].map((r, i) => (
          <div key={i} className={styles.ruleCard}>
            <div className={styles.ruleHeader}>
              <span className={styles.ruleNum}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 13, color: "#1e293b" }}>{r.title}</strong>
                <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>{r.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}><ExternalLink size={14} /> Link Platform</div>
        <div className={styles.field}><label>Link Zoom</label>
          <input className={styles.input} value={cfg["zoom_link"] || ""} onChange={e => set("zoom_link", e.target.value)} placeholder="https://zoom.us/j/..." />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: ABSENSI
// ════════════════════════════════════════════════════════
function TabAbsensi() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [grid, setGrid]                 = useState<Record<string, boolean>>({});
  const [attendanceLink, setAttendanceLink] = useState("");
  const [totalSessions, setTotalSessions]   = useState(17);
  const [savingGrid, setSavingGrid]         = useState(false);
  const [savingPeserta, setSavingPeserta]   = useState(false);
  const [savedPeserta, setSavedPeserta]     = useState(false);
  const [savedLink, setSavedLink]           = useState(false);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: a }, { data: cfg }] = await Promise.all([
        supabase.from("config_participants").select("*").order("sort_order"),
        supabase.from("attendance").select("participant,session_no,attended"),
        supabase.from("site_config").select("key,value").in("key", ["attendance_link","total_absensi_sessions"]),
      ]);
      setParticipants((p as Participant[]) || []);
      const map: Record<string, boolean> = {};
      (a || []).forEach((r: { participant: string; session_no: number; attended: boolean }) => {
        map[`${r.participant}__${r.session_no}`] = r.attended;
      });
      setGrid(map);
      const cfgMap: Record<string, string> = {};
      (cfg || []).forEach((r: { key: string; value: string }) => { cfgMap[r.key] = r.value; });
      setAttendanceLink(cfgMap["attendance_link"] || "");
      setTotalSessions(Number(cfgMap["total_absensi_sessions"] || 17));
      setLoading(false);
    }
    load();
  }, []);

  const toggle = useCallback(async (participant: string, session_no: number) => {
    const key = `${participant}__${session_no}`;
    const next = !grid[key];
    setGrid(prev => ({ ...prev, [key]: next }));
    await supabase.from("attendance").upsert({ participant, session_no, attended: next }, { onConflict: "participant,session_no" });
  }, [grid]);

  const handleSaveLink = async () => {
    setSavingGrid(true);
    await supabase.from("site_config").upsert([
      { key: "attendance_link", value: attendanceLink, updated_at: new Date().toISOString() },
      { key: "total_absensi_sessions", value: String(totalSessions), updated_at: new Date().toISOString() },
    ], { onConflict: "key" });
    setSavingGrid(false); setSavedLink(true); setTimeout(() => setSavedLink(false), 2500);
  };

  const addPeserta = () => setParticipants(prev => [
    ...prev, { name: "", email: "", sort_order: (prev[prev.length - 1]?.sort_order || 0) + 1 }
  ]);

  const updatePeserta = (i: number, field: "name" | "email", val: string) =>
    setParticipants(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const removePeserta = (i: number) => setParticipants(prev => prev.filter((_, idx) => idx !== i));

  const handleSavePeserta = async () => {
    setSavingPeserta(true);
    await supabase.from("config_participants").delete().neq("sort_order", -999);
    const rows = participants.filter(p => p.name.trim()).map((p, i) => ({
      name: p.name.trim(), email: p.email, sort_order: i + 1
    }));
    if (rows.length) await supabase.from("config_participants").insert(rows);
    setSavingPeserta(false); setSavedPeserta(true); setTimeout(() => setSavedPeserta(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat data absensi...</div>;

  const sessions = Array.from({ length: totalSessions }, (_, i) => i + 1);
  const names = participants.filter(p => p.name.trim()).map(p => p.name);

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><ClipboardCheck size={20} /> Absensi</h2>
          <p>Kelola daftar peserta, jumlah sesi, link absensi, dan toggle kehadiran</p>
        </div>
      </div>

      {/* Daftar Peserta */}
      <div className={styles.card}>
        <div className={styles.cardTitle}><Users size={14} /> Daftar Peserta</div>
        <div className={styles.listCard}>
          <div className={styles.listRow} style={{ gridTemplateColumns: "24px 1fr 1fr auto", background: "#f8fafc" }}>
            <span className={styles.listNum}>#</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>NAMA</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>EMAIL</span>
            <span />
          </div>
          {participants.map((p, i) => (
            <div key={i} className={`${styles.listRow} ${styles.listRowParticipant}`}>
              <span className={styles.listNum}>{i + 1}</span>
              <input className={styles.input} value={p.name} onChange={e => updatePeserta(i, "name", e.target.value)} placeholder="Nama peserta" style={{ fontSize: 12.5 }} />
              <input className={styles.input} value={p.email} onChange={e => updatePeserta(i, "email", e.target.value)} placeholder="email@..." style={{ fontSize: 12.5 }} />
              <button className={styles.deleteBtn} onClick={() => removePeserta(i)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button className={styles.addRowBtn} onClick={addPeserta}><Plus size={14} /> Tambah Peserta</button>
        <div className={styles.rowActions}>
          {savedPeserta && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSavePeserta} disabled={savingPeserta}>
            <Save size={14} /> {savingPeserta ? "Menyimpan..." : "Simpan Daftar Peserta"}
          </button>
        </div>
      </div>

      {/* Atur Sesi & Link */}
      <div className={styles.card}>
        <div className={styles.cardTitle}><ClipboardCheck size={14} /> Pengaturan Sesi & Link Absensi</div>
        <div className={styles.field}>
          <label>Jumlah Pertemuan / Sesi (1–17)</label>
          <div className={styles.sliderWrap}>
            <input type="range" min={1} max={17} value={totalSessions}
              onChange={e => setTotalSessions(Number(e.target.value))} className={styles.sliderInput} />
            <div className={styles.sliderValue}>{totalSessions}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div className={styles.field} style={{ flex: 1 }}>
            <label>URL Google Form Absensi</label>
            <input className={styles.input} value={attendanceLink} onChange={e => setAttendanceLink(e.target.value)} placeholder="https://forms.gle/..." />
          </div>
          <button className={styles.saveBtn} onClick={handleSaveLink} disabled={savingGrid} style={{ marginBottom: 1 }}>
            <Save size={14} /> {savingGrid ? "..." : "Simpan"}
          </button>
          {savedLink && <span className={styles.savedMsg}><CheckCircle size={13} /> Tersimpan</span>}
        </div>
        {attendanceLink && (
          <a className={styles.linkBtn} href={attendanceLink} target="_blank" rel="noreferrer">
            <ExternalLink size={12} /> Buka Form Absensi
          </a>
        )}
      </div>

      {/* Grid Kehadiran */}
      <div className={styles.card} style={{ padding: "20px 16px" }}>
        <div className={styles.cardTitle}><ClipboardCheck size={14} /> Grid Kehadiran — Klik Sel untuk Toggle</div>
        <div className={styles.attendanceWrap}>
          <table className={styles.attendanceGrid}>
            <thead>
              <tr>
                <th>Peserta</th>
                {sessions.map(s => <th key={s}>S{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {names.map(p => (
                <tr key={p}>
                  <td>{p}</td>
                  {sessions.map(s => {
                    const attended = grid[`${p}__${s}`];
                    return (
                      <td key={s}>
                        <button
                          className={`${styles.attendanceCell} ${attended ? styles.attendanceOn : styles.attendanceOff}`}
                          onClick={() => toggle(p, s)}
                          title={`${p} — Sesi ${s}`}
                        >{attended ? "✓" : "·"}</button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: POST TEST — Quiz Editor
// ════════════════════════════════════════════════════════
function TabPostTest() {
  const [totalSessions, setTotalSessions] = useState(1);
  const [allQuestions, setAllQuestions]   = useState<QuizQuestion[]>([]);
  const [openSession, setOpenSession]     = useState<number | null>(null);
  const [savingCfg, setSavingCfg]         = useState(false);
  const [savedCfg, setSavedCfg]           = useState(false);
  const [savingQ, setSavingQ]             = useState<number | null>(null);
  const [savedQ, setSavedQ]               = useState<number | null>(null);
  const [scores, setScores]               = useState<QuizScore[]>([]);
  const [participants, setParticipants]   = useState<string[]>([]);
  const [loading, setLoading]             = useState(true);
  const [rekap_page, setRekapPage]        = useState(0);
  const REKAP_PAGE_SIZE = 16;

  useEffect(() => {
    async function load() {
      const [{ data: cfg }, { data: q }, { data: s }, { data: p }] = await Promise.all([
        supabase.from("post_test_config").select("total_sessions").limit(1).single(),
        supabase.from("quiz_questions").select("*").order("session_key").order("sort_order"),
        supabase.from("quiz_scores").select("participant,session_key,score"),
        supabase.from("config_participants").select("name").order("sort_order"),
      ]);
      if (cfg) setTotalSessions((cfg as { total_sessions: number }).total_sessions || 1);
      const qs = (q || []).map((r: QuizQuestion & { options: unknown }) => ({
        ...r, options: Array.isArray(r.options) ? r.options : ["","","",""],
      }));
      setAllQuestions(qs as QuizQuestion[]);
      setScores((s as QuizScore[]) || []);
      setParticipants((p || []).map((x: { name: string }) => x.name));
      setLoading(false);
    }
    load();
  }, []);

  const handleSaveCfg = async () => {
    setSavingCfg(true);
    const { data: existing } = await supabase.from("post_test_config").select("id").limit(1).single();
    if (existing) {
      await supabase.from("post_test_config").update({ total_sessions: totalSessions, updated_at: new Date().toISOString() }).eq("id", (existing as { id: string }).id);
    } else {
      await supabase.from("post_test_config").insert({ total_sessions: totalSessions });
    }
    setSavingCfg(false); setSavedCfg(true); setTimeout(() => setSavedCfg(false), 2500);
  };

  const getSessionQuestions = (key: number) =>
    allQuestions.filter(q => q.session_key === key).sort((a, b) => a.sort_order - b.sort_order);

  const addQuestion = (key: number) => {
    const existing = getSessionQuestions(key);
    const newQ: QuizQuestion = {
      session_key: key, sort_order: existing.length,
      question_text: "", options: ["","","",""], correct_answer: 0, image_url: "",
    };
    setAllQuestions(prev => [...prev, newQ]);
  };

  const updateQuestion = (key: number, qi: number, field: keyof QuizQuestion, val: string | number | string[]) => {
    setAllQuestions(prev => {
      const sessionQs = getSessionQuestionsFrom(prev, key);
      const updated = sessionQs.map((q, i) => i === qi ? { ...q, [field]: val } : q);
      return [...prev.filter(q => q.session_key !== key), ...updated];
    });
  };

  const updateOption = (key: number, qi: number, oi: number, val: string) => {
    setAllQuestions(prev => {
      const sessionQs = getSessionQuestionsFrom(prev, key);
      const updated = sessionQs.map((q, i) => {
        if (i !== qi) return q;
        const opts = [...q.options];
        opts[oi] = val;
        return { ...q, options: opts };
      });
      return [...prev.filter(q => q.session_key !== key), ...updated];
    });
  };

  const removeQuestion = (key: number, qi: number) => {
    setAllQuestions(prev => {
      const sessionQs = getSessionQuestionsFrom(prev, key).filter((_, i) => i !== qi);
      return [...prev.filter(q => q.session_key !== key), ...sessionQs];
    });
  };

  const handleSaveSession = async (key: number) => {
    setSavingQ(key);
    const sessionQs = getSessionQuestions(key);
    await supabase.from("quiz_questions").delete().eq("session_key", key);
    if (sessionQs.length) {
      const rows = sessionQs.map((q, i) => ({
        session_key: key, sort_order: i,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        image_url: q.image_url || "",
      }));
      await supabase.from("quiz_questions").insert(rows);
    }
    setSavingQ(null); setSavedQ(key); setTimeout(() => setSavedQ(null), 2500);
  };

  const bestScore = (name: string, key: number) => {
    const attempts = scores.filter(s => s.participant === name && s.session_key === key);
    if (!attempts.length) return null;
    return Math.max(...attempts.map(a => a.score));
  };

  if (loading) return <div className={styles.loading}>Memuat data post test...</div>;

  const activeSessions = Array.from({ length: totalSessions }, (_, i) => i + 1);

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><BookOpenCheck size={20} /> Post Test</h2>
          <p>Atur jumlah sesi aktif dan buat/edit soal post test per sesi</p>
        </div>
      </div>

      {/* Config sesi */}
      <div className={styles.card}>
        <div className={styles.cardTitle}><BookOpenCheck size={14} /> Jumlah Sesi Post Test Aktif</div>
        <div className={styles.sliderWrap}>
          <input type="range" min={1} max={15} value={totalSessions}
            onChange={e => setTotalSessions(Number(e.target.value))} className={styles.sliderInput} />
          <div className={styles.sliderValue}>{totalSessions}</div>
        </div>
        <div className={styles.sessionTagsWrap}>
          {QUIZ_SESSIONS.map((_, i) => (
            <span key={i} className={`${styles.sessionTag} ${i < totalSessions ? styles.sessionTagActive : styles.sessionTagInactive}`}>
              Sesi {i + 1}
            </span>
          ))}
        </div>
        <div className={styles.rowActions}>
          {savedCfg && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSaveCfg} disabled={savingCfg}>
            <Save size={14} /> {savingCfg ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
        </div>
      </div>

      {/* Editor soal per sesi */}
      {activeSessions.map(key => {
        const sessionQs = getSessionQuestions(key);
        const isOpen = openSession === key;
        return (
          <div key={key} className={styles.materiCard}>
            <div
              className={`${styles.materiCardHead} ${isOpen ? styles.materiCardHeadOpen : ""}`}
              onClick={() => setOpenSession(isOpen ? null : key)}
            >
              <div className={styles.materiCardHeadLeft}>
                <span className={styles.sessionNumBadge}>Sesi {key}</span>
                <span className={styles.materiCardTitle}>{QUIZ_SESSIONS[key - 1]}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>
                  {sessionQs.length} soal
                </span>
              </div>
              {isOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
            </div>

            {isOpen && (
              <div className={styles.materiCardBody}>
                {sessionQs.map((q, qi) => (
                  <div key={qi} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNum}>Soal {qi + 1}</span>
                      <button className={styles.deleteBtn} onClick={() => removeQuestion(key, qi)} title="Hapus soal">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className={styles.field}>
                      <label>Pertanyaan</label>
                      <textarea className={styles.textarea} rows={2}
                        value={q.question_text}
                        onChange={e => updateQuestion(key, qi, "question_text", e.target.value)}
                        placeholder="Tulis pertanyaan di sini..." />
                    </div>

                    <div className={styles.field}>
                      <label><ImageIcon size={11} style={{ display:"inline", marginRight:4 }} />URL Gambar (opsional)</label>
                      <input className={styles.input} value={q.image_url}
                        onChange={e => updateQuestion(key, qi, "image_url", e.target.value)}
                        placeholder="https://..." />
                    </div>

                    <div className={styles.field}>
                      <label>Pilihan Jawaban — pilih yang benar</label>
                      <div className={styles.optionsGrid}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`${styles.optionRow} ${q.correct_answer === oi ? styles.optionRowCorrect : ""}`}>
                            <button
                              className={`${styles.correctBtn} ${q.correct_answer === oi ? styles.correctBtnActive : ""}`}
                              onClick={() => updateQuestion(key, qi, "correct_answer", oi)}
                              title="Tandai sebagai jawaban benar"
                            >
                              {q.correct_answer === oi ? "✓" : String.fromCharCode(65 + oi)}
                            </button>
                            <input
                              className={styles.optionInput}
                              value={opt}
                              onChange={e => updateOption(key, qi, oi, e.target.value)}
                              placeholder={`Pilihan ${String.fromCharCode(65 + oi)}...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button className={styles.addRowBtn} onClick={() => addQuestion(key)}>
                  <Plus size={14} /> Tambah Soal
                </button>

                <div className={styles.rowActions}>
                  {savedQ === key && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
                  <button className={styles.saveBtn} onClick={() => handleSaveSession(key)} disabled={savingQ === key}>
                    <Save size={14} /> {savingQ === key ? "Menyimpan..." : "Simpan Soal Sesi Ini"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Rekapitulasi Skor */}
      <div className={styles.card} style={{ padding: "20px 16px" }}>
        <div className={styles.cardTitle}><BarChart2 size={14} /> Rekapitulasi Skor Post Test</div>
        <div className={styles.scoresWrap}>
          <table className={styles.scoresTable}>
            <thead>
              <tr>
                <th>Peserta</th>
                {activeSessions.map(i => <th key={i}>S{i}</th>)}
                <th>Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              {participants.slice(rekap_page * REKAP_PAGE_SIZE, (rekap_page + 1) * REKAP_PAGE_SIZE).map(p => {
                const ss = activeSessions.map(i => bestScore(p, i));
                const filled = ss.filter(s => s !== null) as number[];
                const avg = filled.length ? Math.round(filled.reduce((a, b) => a + b, 0) / filled.length) : null;
                return (
                  <tr key={p}>
                    <td>{p}</td>
                    {ss.map((score, i) => (
                      <td key={i}>
                        {score === null
                          ? <span className={styles.scoreEmpty}>—</span>
                          : <span className={`${styles.scorePill} ${score >= 80 ? styles.scoreHigh : score >= 60 ? styles.scoreMid : styles.scoreLow}`}>{score}</span>
                        }
                      </td>
                    ))}
                    <td>
                      {avg === null ? <span className={styles.scoreEmpty}>—</span>
                        : <span className={`${styles.scorePill} ${avg >= 80 ? styles.scoreHigh : avg >= 60 ? styles.scoreMid : styles.scoreLow}`}>{avg}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {Math.ceil(participants.length / REKAP_PAGE_SIZE) > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "16px 0 4px" }}>
            <button onClick={() => setRekapPage(p => Math.max(0, p - 1))} disabled={rekap_page === 0}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: rekap_page === 0 ? "#f8fafc" : "#fff", color: rekap_page === 0 ? "#cbd5e1" : "#334155", cursor: rekap_page === 0 ? "not-allowed" : "pointer", fontSize: 13 }}>
              ← Prev
            </button>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{rekap_page + 1} / {Math.ceil(participants.length / REKAP_PAGE_SIZE)}</span>
            <button onClick={() => setRekapPage(p => Math.min(Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1, p + 1))} disabled={rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1 ? "#f8fafc" : "#fff", color: rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1 ? "#cbd5e1" : "#334155", cursor: rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Helper for quiz question state updates
function getSessionQuestionsFrom(all: QuizQuestion[], key: number) {
  return all.filter(q => q.session_key === key).sort((a, b) => a.sort_order - b.sort_order);
}

// ════════════════════════════════════════════════════════
// TAB: EXAM (PRE TEST)
// ════════════════════════════════════════════════════════
function TabExam() {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [scores, setScores]       = useState<ExamScore[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [rekap_page, setRekapPage] = useState(0);
  const REKAP_PAGE_SIZE = 16;

  useEffect(() => {
    async function load() {
      const [{ data: q }, { data: s }, { data: p }] = await Promise.all([
        supabase.from("exam_questions").select("*").order("sort_order"),
        supabase.from("exam_scores").select("participant,score,attempt_no"),
        supabase.from("config_participants").select("name").order("sort_order"),
      ]);
      const qs = (q || []).map((r: ExamQuestion & { options: unknown }) => ({
        ...r, options: Array.isArray(r.options) ? r.options : ["","","",""],
      }));
      setQuestions((qs as ExamQuestion[]).sort((a, b) => a.sort_order - b.sort_order));
      setScores((s as ExamScore[]) || []);
      setParticipants((p || []).map((x: { name: string }) => x.name));
      setLoading(false);
    }
    load();
  }, []);

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      sort_order: prev.length,
      question_text: "", options: ["","","",""], correct_answer: 0, image_url: "",
    }]);
  };

  const updateQuestion = (qi: number, field: keyof ExamQuestion, val: string | number | string[]) => {
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: val } : q));
  };

  const updateOption = (qi: number, oi: number, val: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q;
      const opts = [...q.options];
      opts[oi] = val;
      return { ...q, options: opts };
    }));
  };

  const removeQuestion = (qi: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== qi));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await supabase.from("exam_questions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (questions.length) {
      const rows = questions.map((q, i) => ({
        sort_order: i,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        image_url: q.image_url || "",
      }));
      await supabase.from("exam_questions").insert(rows);
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const bestScore = (name: string) => {
    const attempts = scores.filter(s => s.participant === name);
    if (!attempts.length) return null;
    return Math.max(...attempts.map(a => a.score));
  };

  const attemptCount = (name: string) => scores.filter(s => s.participant === name).length;

  if (loading) return <div className={styles.loading}>Memuat data exam...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><ListChecks size={20} /> Exam</h2>
          <p>Kelola soal exam — target 25 soal pilihan ganda, wajib dikerjakan peserta (satu kali) sebelum mengumpulkan Final Project</p>
        </div>
        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSaveAll} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Semua Soal"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <ListChecks size={14} /> Daftar Soal Exam
          <span style={{ fontSize: 11, color: questions.length === 25 ? "#22c55e" : "#f97316", marginLeft: 8, fontWeight: 700 }}>
            {questions.length}/25 soal
          </span>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <span className={styles.questionNum}>Soal {qi + 1}</span>
              <button className={styles.deleteBtn} onClick={() => removeQuestion(qi)} title="Hapus soal">
                <Trash2 size={14} />
              </button>
            </div>

            <div className={styles.field}>
              <label>Pertanyaan</label>
              <textarea className={styles.textarea} rows={2}
                value={q.question_text}
                onChange={e => updateQuestion(qi, "question_text", e.target.value)}
                placeholder="Tulis pertanyaan di sini..." />
            </div>

            <div className={styles.field}>
              <label><ImageIcon size={11} style={{ display:"inline", marginRight:4 }} />URL Gambar (opsional)</label>
              <input className={styles.input} value={q.image_url}
                onChange={e => updateQuestion(qi, "image_url", e.target.value)}
                placeholder="https://..." />
            </div>

            <div className={styles.field}>
              <label>Pilihan Jawaban — pilih yang benar</label>
              <div className={styles.optionsGrid}>
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`${styles.optionRow} ${q.correct_answer === oi ? styles.optionRowCorrect : ""}`}>
                    <button
                      className={`${styles.correctBtn} ${q.correct_answer === oi ? styles.correctBtnActive : ""}`}
                      onClick={() => updateQuestion(qi, "correct_answer", oi)}
                      title="Tandai sebagai jawaban benar"
                    >
                      {q.correct_answer === oi ? "✓" : String.fromCharCode(65 + oi)}
                    </button>
                    <input
                      className={styles.optionInput}
                      value={opt}
                      onChange={e => updateOption(qi, oi, e.target.value)}
                      placeholder={`Pilihan ${String.fromCharCode(65 + oi)}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button className={styles.addRowBtn} onClick={addQuestion}>
          <Plus size={14} /> Tambah Soal
        </button>

        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSaveAll} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Semua Soal"}
          </button>
        </div>
      </div>

      {/* Rekapitulasi Skor */}
      <div className={styles.card} style={{ padding: "20px 16px" }}>
        <div className={styles.cardTitle}><BarChart2 size={14} /> Rekapitulasi Skor Exam</div>
        <div className={styles.scoresWrap}>
          <table className={styles.scoresTable}>
            <thead>
              <tr>
                <th>Peserta</th>
                <th>Skor Terbaik</th>
                <th>Jumlah Attempt</th>
              </tr>
            </thead>
            <tbody>
              {participants.slice(rekap_page * REKAP_PAGE_SIZE, (rekap_page + 1) * REKAP_PAGE_SIZE).map(p => {
                const best = bestScore(p);
                const attempts = attemptCount(p);
                return (
                  <tr key={p}>
                    <td>{p}</td>
                    <td>
                      {best === null
                        ? <span className={styles.scoreEmpty}>—</span>
                        : <span className={`${styles.scorePill} ${best >= 80 ? styles.scoreHigh : best >= 60 ? styles.scoreMid : styles.scoreLow}`}>{best}</span>
                      }
                    </td>
                    <td>{attempts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {Math.ceil(participants.length / REKAP_PAGE_SIZE) > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "16px 0 4px" }}>
            <button onClick={() => setRekapPage(p => Math.max(0, p - 1))} disabled={rekap_page === 0}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: rekap_page === 0 ? "#f8fafc" : "#fff", color: rekap_page === 0 ? "#cbd5e1" : "#334155", cursor: rekap_page === 0 ? "not-allowed" : "pointer", fontSize: 13 }}>
              ← Prev
            </button>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{rekap_page + 1} / {Math.ceil(participants.length / REKAP_PAGE_SIZE)}</span>
            <button onClick={() => setRekapPage(p => Math.min(Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1, p + 1))} disabled={rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1 ? "#f8fafc" : "#fff", color: rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1 ? "#cbd5e1" : "#334155", cursor: rekap_page === Math.ceil(participants.length / REKAP_PAGE_SIZE) - 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: DAFTAR PESERTA
// ════════════════════════════════════════════════════════
function TabPeserta() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("config_participants").select("*").order("sort_order").then(({ data }) => {
      setParticipants((data as Participant[]) || []);
      setLoading(false);
    });
  }, []);

  const add    = () => setParticipants(prev => [...prev, { name: "", email: "", sort_order: (prev[prev.length-1]?.sort_order||0)+1 }]);
  const update = (i: number, f: "name"|"email", v: string) => setParticipants(prev => prev.map((p,idx) => idx===i ? {...p,[f]:v} : p));
  const remove = (i: number) => setParticipants(prev => prev.filter((_,idx) => idx!==i));
  const handleSave = async () => {
    setSaving(true);
    await supabase.from("config_participants").delete().neq("sort_order", -999);
    const rows = participants.filter(p => p.name.trim()).map((p, i) => ({ name: p.name.trim(), email: p.email, sort_order: i+1 }));
    if (rows.length) await supabase.from("config_participants").insert(rows);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat data peserta...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><Users size={20} /> Daftar Peserta</h2>
          <p>Kelola nama dan email seluruh peserta WebGIS Bootcamp Batch 3</p>
        </div>
        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Daftar Peserta"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}><Users size={14} /> Daftar Nama Peserta</div>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: -8 }}>Nama yang ditambahkan di sini muncul di semua dropdown form (absensi, tugas, post test).</p>
        <div className={styles.listCard}>
          <div className={styles.listRow} style={{ gridTemplateColumns: "24px 1fr 1fr auto", background: "#f8fafc" }}>
            <span className={styles.listNum}>#</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>NAMA</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>EMAIL</span>
            <span />
          </div>
          {participants.map((p, i) => (
            <div key={i} className={`${styles.listRow} ${styles.listRowParticipant}`}>
              <span className={styles.listNum}>{i+1}</span>
              <input className={styles.input} value={p.name} onChange={e => update(i,"name",e.target.value)} placeholder="Nama peserta" style={{ fontSize: 12.5 }} />
              <input className={styles.input} value={p.email} onChange={e => update(i,"email",e.target.value)} placeholder="email@..." style={{ fontSize: 12.5 }} />
              <button className={styles.deleteBtn} onClick={() => remove(i)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button className={styles.addRowBtn} onClick={add}><Plus size={14} /> Tambah Peserta</button>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: MONITORING TUGAS
// ════════════════════════════════════════════════════════
function TabTugas() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [tasks, setTasks]               = useState<TaskItem[]>([]);
  const [submissions, setSubmissions]   = useState<Submission[]>([]);
  const [savingT, setSavingT]           = useState(false);
  const [savedT, setSavedT]             = useState(false);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
        supabase.from("config_participants").select("name").order("sort_order"),
        supabase.from("config_tasks").select("*").order("task_order"),
        supabase.from("task_submissions").select("*").order("submitted_at", { ascending: false }),
      ]);
      setParticipants((p || []).map((x: { name: string }) => x.name));
      setTasks((t as TaskItem[]) || []);
      setSubmissions((s as Submission[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const addT    = () => setTasks(prev => [...prev, { task_order: (prev[prev.length-1]?.task_order||0)+1, number:"", title:"", phase:"" }]);
  const updateT = (i: number, f: keyof TaskItem, v: string|number) => setTasks(prev => prev.map((t,idx) => idx===i ? {...t,[f]:v} : t));
  const removeT = (i: number) => setTasks(prev => prev.filter((_,idx) => idx!==i));
  const handleSaveT = async () => {
    setSavingT(true);
    await supabase.from("config_tasks").delete().neq("task_order", -999);
    const rows = tasks.filter(t => t.number.trim()).map((t, i) => ({ task_order: i+1, number: t.number, title: t.title, phase: t.phase }));
    if (rows.length) await supabase.from("config_tasks").insert(rows);
    setSavingT(false); setSavedT(true); setTimeout(() => setSavedT(false), 2500);
  };

  const checklistMap: Record<string, Set<number>> = {};
  participants.forEach(p => { checklistMap[p] = new Set(); });
  submissions.forEach(s => { if (checklistMap[s.participant]) checklistMap[s.participant].add(s.task_id); });

  if (loading) return <div className={styles.loading}>Memuat data tugas...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><FolderOpen size={20} /> Monitoring Tugas</h2>
          <p>Kelola daftar tugas dan pantau rekapitulasi pengumpulan</p>
        </div>
      </div>

      {/* Daftar Tugas */}
      <div className={styles.card}>
        <div className={styles.cardTitle}><FolderOpen size={14} /> Daftar Tugas</div>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: -8 }}>Tugas yang ditambahkan di sini akan muncul di dropdown pilih tugas learner.</p>
        <div className={styles.listCard}>
          <div className={styles.listRow} style={{ gridTemplateColumns: "24px 110px 1fr 130px auto", background: "#f8fafc" }}>
            <span className={styles.listNum}>#</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>NOMOR</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>JUDUL TUGAS</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>FASE</span>
            <span />
          </div>
          {tasks.map((t, i) => (
            <div key={i} className={`${styles.listRow} ${styles.listRowTask}`}>
              <span className={styles.listNum}>{i+1}</span>
              <input className={styles.input} value={t.number} onChange={e => updateT(i,"number",e.target.value)} placeholder="Tugas 1-2" style={{ fontSize: 12 }} />
              <input className={styles.input} value={t.title} onChange={e => updateT(i,"title",e.target.value)} placeholder="Judul tugas..." style={{ fontSize: 12 }} />
              <input className={styles.input} value={t.phase} onChange={e => updateT(i,"phase",e.target.value)} placeholder="Fase" style={{ fontSize: 12 }} />
              <button className={styles.deleteBtn} onClick={() => removeT(i)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button className={styles.addRowBtn} onClick={addT}><Plus size={14} /> Tambah Tugas</button>
        <div className={styles.rowActions}>
          {savedT && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSaveT} disabled={savingT}>
            <Save size={14} /> {savingT ? "Menyimpan..." : "Simpan Daftar Tugas"}
          </button>
        </div>
      </div>

      {/* Rekapitulasi */}
      <div className={styles.card} style={{ padding: "20px 16px" }}>
        <div className={styles.cardTitle}><BarChart2 size={14} /> Rekapitulasi Pengumpulan Tugas</div>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: -8 }}>Checklist pengumpulan tugas seluruh peserta.</p>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.scoresTable} style={{ minWidth: "auto" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Nama Peserta</th>
                {tasks.map((t, i) => <th key={t.task_order}>T{i+1}</th>)}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(name => {
                const submitted = checklistMap[name];
                const total = submitted?.size || 0;
                return (
                  <tr key={name}>
                    <td style={{ fontWeight: 700, textAlign: "left" }}>{name}</td>
                    {tasks.map(t => (
                      <td key={t.task_order}>
                        {submitted?.has(t.task_order)
                          ? <span className={`${styles.scorePill} ${styles.scoreHigh}`} style={{ fontSize: 12 }}>✓</span>
                          : <span className={styles.scoreEmpty}>—</span>}
                      </td>
                    ))}
                    <td>
                      <span className={`${styles.scorePill} ${total > 0 ? styles.scoreMid : styles.scoreEmpty}`} style={{ minWidth: 44 }}>
                        {total}/{tasks.length}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: PENILAIAN TUGAS
// ════════════════════════════════════════════════════════
interface TaskScore { participant: string; task_id: number; score: number; }

function TabPenilaian() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [scores, setScores]           = useState<Record<string, number>>({});
  const [saving, setSaving]           = useState<Record<string, boolean>>({});
  const [saved, setSaved]             = useState<Record<string, boolean>>({});
  const [loading, setLoading]         = useState(true);

  const scoreKey = (participant: string, task_id: number) => `${participant}__${task_id}`;

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: sc }] = await Promise.all([
        supabase.from("task_submissions")
          .select("id,participant,task_id,task_number,task_title,url,submitted_at")
          .order("participant").order("task_id"),
        supabase.from("task_scores").select("participant,task_id,score"),
      ]);
      setSubmissions((s as Submission[]) || []);
      const map: Record<string, number> = {};
      (sc as TaskScore[] || []).forEach(r => { map[scoreKey(r.participant, r.task_id)] = r.score; });
      setScores(map);
      setLoading(false);
    }
    load();
  }, []);

  const handleScore = async (participant: string, task_id: number, score: number) => {
    const key = scoreKey(participant, task_id);
    setScores(prev => ({ ...prev, [key]: score }));
    setSaving(prev => ({ ...prev, [key]: true }));
    await supabase.from("task_scores").upsert(
      { participant, task_id, score },
      { onConflict: "participant,task_id" }
    );
    setSaving(prev => ({ ...prev, [key]: false }));
    setSaved(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setSaved(prev => ({ ...prev, [key]: false })), 2000);
  };

  const [filterTaskId, setFilterTaskId] = useState<number | "all">("all");
  const SCORE_OPTIONS = Array.from({ length: 19 }, (_, i) => 10 + i * 5); // 10,15,...,100

  // Unique task list derived from submissions for filter options
  const uniqueTasks = Array.from(
    new Map(submissions.map(s => [s.task_id, { task_id: s.task_id, task_number: s.task_number, task_title: s.task_title }])).values()
  ).sort((a, b) => a.task_id - b.task_id);

  const filteredSubmissions = filterTaskId === "all"
    ? submissions
    : submissions.filter(s => s.task_id === filterTaskId);

  if (loading) return <div className={styles.loading}>Memuat data penilaian...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><CheckCircle size={20} /> Penilaian Tugas</h2>
          <p>Beri nilai tugas peserta berdasarkan link GitHub yang dikumpulkan (rentang 10–100, step 5)</p>
        </div>
      </div>

      <div className={styles.card} style={{ padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
          <div className={styles.cardTitle} style={{ marginBottom: 0 }}><BarChart2 size={14} /> Daftar Pengumpulan &amp; Penilaian</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Filter tugas:</span>
            <select
              value={filterTaskId}
              onChange={e => setFilterTaskId(e.target.value === "all" ? "all" : Number(e.target.value))}
              style={{ padding: "6px 10px", borderRadius: 7, border: "1px solid #e2e8f0", fontSize: 12.5, color: "#334155", background: "#f8fafc", outline: "none", cursor: "pointer" }}
            >
              <option value="all">Semua Tugas ({submissions.length})</option>
              {uniqueTasks.map(t => (
                <option key={t.task_id} value={t.task_id}>
                  {t.task_number} — {t.task_title} ({submissions.filter(s => s.task_id === t.task_id).length} peserta)
                </option>
              ))}
            </select>
          </div>
        </div>
        {submissions.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Belum ada tugas yang dikumpulkan.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.scoresTable} style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", minWidth: 160 }}>Nama Peserta</th>
                  <th style={{ textAlign: "left", minWidth: 100 }}>Tugas</th>
                  <th style={{ textAlign: "left", minWidth: 100 }}>Judul</th>
                  <th style={{ minWidth: 80 }}>GitHub</th>
                  <th style={{ minWidth: 120 }}>Nilai</th>
                  <th style={{ minWidth: 60 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(sub => {
                  const key   = scoreKey(sub.participant, sub.task_id);
                  const score = scores[key];
                  const isSaving = saving[key];
                  const isSaved  = saved[key];
                  return (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 700 }}>{sub.participant}</td>
                      <td>
                        <span className={styles.sessionNumBadge}>{sub.task_number}</span>
                      </td>
                      <td style={{ fontSize: 12, color: "#475569" }}>{sub.task_title}</td>
                      <td style={{ textAlign: "center" }}>
                        <a href={sub.url} target="_blank" rel="noreferrer"
                          className={styles.linkBtn} style={{ fontSize: 11, padding: "4px 8px" }}>
                          <ExternalLink size={11} /> Lihat
                        </a>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <select
                          value={score ?? ""}
                          onChange={e => handleScore(sub.participant, sub.task_id, Number(e.target.value))}
                          style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12.5, fontWeight: 700, color: score ? (score >= 80 ? "#16a34a" : score >= 60 ? "#ca8a04" : "#dc2626") : "#94a3b8", background: "#f8fafc", outline: "none", cursor: "pointer", minWidth: 80 }}
                        >
                          <option value="">— Nilai —</option>
                          {SCORE_OPTIONS.map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {isSaving
                          ? <span style={{ fontSize: 11, color: "#94a3b8" }}>...</span>
                          : isSaved
                            ? <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700 }}>✓ Tersimpan</span>
                            : score
                              ? <span className={`${styles.scorePill} ${score >= 80 ? styles.scoreHigh : score >= 60 ? styles.scoreMid : styles.scoreLow}`}>{score}</span>
                              : <span style={{ fontSize: 11, color: "#cbd5e1" }}>—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: MATERI & REKAMAN
// ════════════════════════════════════════════════════════
function TabMateri() {
  const [materiLink, setMateriLink]     = useState("");
  const [playlistLink, setPlaylistLink] = useState("");
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    supabase.from("site_config").select("key,value").in("key", ["materi_link", "playlist_link"]).then(({ data }) => {
      (data || []).forEach((r: { key: string; value: string }) => {
        if (r.key === "materi_link")   setMateriLink(r.value);
        if (r.key === "playlist_link") setPlaylistLink(r.value);
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("site_config").upsert([
      { key: "materi_link",   value: materiLink,   updated_at: new Date().toISOString() },
      { key: "playlist_link", value: playlistLink, updated_at: new Date().toISOString() },
    ], { onConflict: "key" });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat data materi...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><PlayCircle size={20} /> Materi & Rekaman</h2>
          <p>Atur link materi dan video rekaman yang ditampilkan ke peserta</p>
        </div>
        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}><PlayCircle size={14} /> Link Materi & Video</div>
        <div className={styles.field}>
          <label>Link Materi (Materi Playback)</label>
          <input className={styles.input} value={materiLink} onChange={e => setMateriLink(e.target.value)} placeholder="https://..." />
        </div>
        <div className={styles.field}>
          <label>Link Youtube Playlist</label>
          <input className={styles.input} value={playlistLink} onChange={e => setPlaylistLink(e.target.value)} placeholder="https://youtube.com/playlist?..." />
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: FINAL PROJECT
// ════════════════════════════════════════════════════════
function TabFinal() {
  const [projects, setProjects] = useState<FinalProject[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase.from("final_projects").select("*").order("submitted_at", { ascending: false }).then(({ data }) => {
      setProjects((data as FinalProject[]) || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className={styles.loading}>Memuat final project...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><Trophy size={20} /> Final Project</h2>
          <p>Pantau pengumpulan final project peserta</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}><Trophy size={14} /> Daftar Pengumpulan</div>
        {projects.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Belum ada final project yang dikumpulkan</div>
        )}
        {projects.length > 0 && (
          <div className={styles.listCard}>
            <div className={styles.listRow} style={{ gridTemplateColumns: "1fr 1fr auto", background: "#f8fafc" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>PESERTA</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>TANGGAL</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>LINK</span>
            </div>
            {projects.map(fp => (
              <div key={fp.participant} className={styles.listRow} style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{fp.participant}</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{new Date(fp.submitted_at).toLocaleDateString("id-ID", { day:"numeric", month:"short", year:"numeric" })}</span>
                <a className={styles.linkBtn} href={fp.url} target="_blank" rel="noreferrer"><ExternalLink size={11} /> Lihat</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: FEEDBACK EVALUASI SESI
// ════════════════════════════════════════════════════════
const FEEDBACK_FIELDS: { key: keyof QuizFeedback; label: string }[] = [
  { key: "material_relevance",         label: "Relevansi Materi" },
  { key: "material_flow_clarity",      label: "Kejelasan Alur Materi" },
  { key: "hands_on_helpfulness",       label: "Aktivitas Hands-On" },
  { key: "mentor_explanation",         label: "Penjelasan Mentor" },
  { key: "facilitator_responsiveness", label: "Responsivitas Fasilitator" },
  { key: "webgis_project_readiness",   label: "Kesiapan Project WebGIS" },
];

function StarRating({ value }: { value: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= value ? "#f59e0b" : "none"} color={i <= value ? "#f59e0b" : "#d1d5db"} />
      ))}
      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginLeft: 4 }}>{value}</span>
    </span>
  );
}

function TabFeedback() {
  const [feedbacks, setFeedbacks]     = useState<QuizFeedback[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [filterSession, setFilterSession] = useState<number>(0);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: fb }, { data: p }] = await Promise.all([
        supabase.from("quiz_feedback").select("*").order("submitted_at", { ascending: false }),
        supabase.from("config_participants").select("name").order("sort_order"),
      ]);
      setFeedbacks((fb as QuizFeedback[]) || []);
      setParticipants((p || []).map((x: { name: string }) => x.name));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className={styles.loading}>Memuat data feedback...</div>;

  const sessions = Array.from(new Set(feedbacks.map(f => f.session_key))).sort((a,b) => a-b);
  const filtered = filterSession === 0 ? feedbacks : feedbacks.filter(f => f.session_key === filterSession);

  // Hitung rata-rata per sesi
  const avgBySession = sessions.map(sk => {
    const rows = feedbacks.filter(f => f.session_key === sk);
    const avg = (field: keyof QuizFeedback) =>
      rows.length ? (rows.reduce((s, r) => s + (r[field] as number), 0) / rows.length).toFixed(1) : "-";
    return { sk, count: rows.length, avgs: Object.fromEntries(FEEDBACK_FIELDS.map(f => [f.key, avg(f.key)])) };
  });

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><Star size={20} /> Feedback Evaluasi Sesi</h2>
          <p>Rekap penilaian evaluasi sesi dari seluruh peserta post test</p>
        </div>
      </div>

      {/* Rata-rata per sesi */}
      {avgBySession.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardTitle}><BarChart2 size={14} /> Rata-rata Penilaian per Sesi</div>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.scoresTable}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Sesi</th>
                  {FEEDBACK_FIELDS.map(f => <th key={f.key} style={{ whiteSpace: "nowrap", fontSize: 11 }}>{f.label}</th>)}
                  <th>Responden</th>
                </tr>
              </thead>
              <tbody>
                {avgBySession.map(row => (
                  <tr key={row.sk}>
                    <td style={{ fontWeight: 700 }}>{QUIZ_SESSIONS[row.sk - 1] || `Sesi ${row.sk}`}</td>
                    {FEEDBACK_FIELDS.map(f => (
                      <td key={f.key} style={{ textAlign: "center" }}>
                        <span className={`${styles.scorePill} ${Number(row.avgs[f.key]) >= 4 ? styles.scoreHigh : Number(row.avgs[f.key]) >= 3 ? styles.scoreMid : styles.scoreLow}`}>
                          {row.avgs[f.key]}
                        </span>
                      </td>
                    ))}
                    <td style={{ textAlign: "center" }}>
                      <span className={styles.scorePill}>{row.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter + tabel detail */}
      <div className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div className={styles.cardTitle} style={{ margin: 0 }}><ClipboardCheck size={14} /> Detail Jawaban Peserta</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Filter Sesi:</label>
            <select value={filterSession} onChange={e => setFilterSession(Number(e.target.value))}
              style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, color: "#334155", outline: "none", background: "#f8fafc" }}>
              <option value={0}>Semua Sesi</option>
              {sessions.map(sk => <option key={sk} value={sk}>Post Test {sk}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Belum ada feedback yang masuk.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.scoresTable}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Peserta</th>
                  <th>Sesi</th>
                  {FEEDBACK_FIELDS.map(f => <th key={f.key} style={{ whiteSpace: "nowrap", fontSize: 10 }}>{f.label}</th>)}
                  <th style={{ textAlign: "left", minWidth: 180 }}>Saran / Kritik</th>
                  <th>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(fb => (
                  <tr key={fb.id}>
                    <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{fb.participant}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className={styles.sessionNumBadge}>P{fb.session_key}</span>
                    </td>
                    {FEEDBACK_FIELDS.map(f => (
                      <td key={f.key} style={{ textAlign: "center" }}>
                        <StarRating value={fb[f.key] as number} />
                      </td>
                    ))}
                    <td style={{ fontSize: 12, color: "#475569", maxWidth: 240, whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                      {fb.feedback_text || <span style={{ color: "#cbd5e1" }}>—</span>}
                    </td>
                    <td style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {fb.submitted_at ? new Date(fb.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Komentar teks saja */}
      {feedbacks.some(f => f.feedback_text) && (
        <div className={styles.card}>
          <div className={styles.cardTitle}><Star size={14} /> Semua Komentar Teks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {feedbacks.filter(f => f.feedback_text).map(fb => (
              <div key={fb.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{fb.participant}</span>
                  <span className={styles.sessionNumBadge}>Post Test {fb.session_key}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.55 }}>{fb.feedback_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: SCHEDULE — Kelola Sesi Bootcamp
// ════════════════════════════════════════════════════════
function TabSchedule() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [openIdx, setOpenIdx]   = useState<number | null>(null);
  const [saving, setSaving]     = useState<number | null>(null);
  const [saved, setSaved]       = useState<number | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase.from("config_sessions").select("*").order("sort_order").then(({ data }) => {
      setSessions((data as SessionRow[]) || []);
      setLoading(false);
    });
  }, []);

  const update = (i: number, f: keyof SessionRow, v: string | number) =>
    setSessions(prev => prev.map((s, idx) => idx === i ? { ...s, [f]: v } : s));

  const handleSave = async (i: number) => {
    setSaving(i);
    await supabase.from("config_sessions").upsert(sessions[i], { onConflict: "session_no" });
    setSaving(null); setSaved(i); setTimeout(() => setSaved(null), 2500);
  };

  const addSession = () => {
    const nextNo = (sessions[sessions.length - 1]?.session_no || 0) + 1;
    setSessions(prev => [...prev, {
      session_no: nextNo, number_label: `Sesi ${nextNo}`, title: "", topic: "", tools: "", pic: "",
      outcome: "", time_label: "19.00 - 21.30", session_date: "", sort_order: nextNo,
    }]);
    setOpenIdx(sessions.length);
  };

  const removeSession = async (i: number) => {
    const s = sessions[i];
    if (!confirm(`Hapus ${s.number_label}: ${s.title}?`)) return;
    await supabase.from("config_sessions").delete().eq("session_no", s.session_no);
    setSessions(prev => prev.filter((_, idx) => idx !== i));
  };

  if (loading) return <div className={styles.loading}>Memuat data sesi...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><CalendarDays size={20} /> Jadwal & Sesi Bootcamp</h2>
          <p>Kelola detail setiap pertemuan: judul, topik, alat, PIC, outcome, tanggal, dan waktu</p>
        </div>
        <button className={styles.saveBtn} onClick={addSession} style={{ background: "#0ea5e9" }}>
          <Plus size={14} /> Tambah Sesi
        </button>
      </div>

      {sessions.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={item.session_no} className={styles.materiCard}>
            <div className={`${styles.materiCardHead} ${isOpen ? styles.materiCardHeadOpen : ""}`}
              onClick={() => setOpenIdx(isOpen ? null : i)}>
              <div className={styles.materiCardHeadLeft}>
                <span className={styles.sessionNumBadge}>{item.number_label}</span>
                <span className={styles.materiCardTitle}>{item.title || <i style={{ color: "#94a3b8" }}>Belum ada judul</i>}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.session_date}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); removeSession(i); }}><Trash2 size={14} /></button>
                {isOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </div>
            </div>
            {isOpen && (
              <div className={styles.materiCardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.field}><label>Label Sesi</label>
                    <input className={styles.input} value={item.number_label} onChange={e => update(i, "number_label", e.target.value)} /></div>
                  <div className={styles.field}><label>Tanggal (YYYY-MM-DD)</label>
                    <input className={styles.input} value={item.session_date} onChange={e => update(i, "session_date", e.target.value)} placeholder="2025-06-05" /></div>
                </div>
                <div className={styles.field}><label>Nama Modul</label>
                  <input className={styles.input} value={item.title} onChange={e => update(i, "title", e.target.value)} /></div>
                <div className={styles.field}><label>Deskripsi / Topik</label>
                  <textarea className={styles.textarea} rows={3} value={item.topic} onChange={e => update(i, "topic", e.target.value)} /></div>
                <div className={styles.field}><label>Mentor (PIC)</label>
                  <input className={styles.input} value={item.pic} onChange={e => update(i, "pic", e.target.value)} /></div>
                <div className={styles.rowActions}>
                  {saved === i && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
                  <button className={styles.saveBtn} onClick={() => handleSave(i)} disabled={saving === i}>
                    <Save size={14} /> {saving === i ? "Menyimpan..." : "Simpan Sesi Ini"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: SOFTWARE — Kelola Platform & Software
// ════════════════════════════════════════════════════════
function TabSoftware() {
  const [items, setItems]     = useState<SoftwareRow[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [saving, setSaving]   = useState<number | null>(null);
  const [saved, setSaved]     = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("config_software").select("*").order("sort_order").then(({ data }) => {
      const parsed = (data || []).map((r: Record<string, unknown>) => ({
        ...r, guide_steps: Array.isArray(r.guide_steps) ? r.guide_steps : [],
      }));
      setItems(parsed as unknown as SoftwareRow[]);
      setLoading(false);
    });
  }, []);

  const update = (i: number, f: keyof SoftwareRow, v: string | string[] | number) =>
    setItems(prev => prev.map((s, idx) => idx === i ? { ...s, [f]: v } : s));

  const addStep = (i: number) => setItems(prev => prev.map((s, idx) => idx === i ? { ...s, guide_steps: [...s.guide_steps, ""] } : s));
  const updateStep = (i: number, si: number, v: string) => setItems(prev =>
    prev.map((s, idx) => idx === i ? { ...s, guide_steps: s.guide_steps.map((step, j) => j === si ? v : step) } : s));
  const removeStep = (i: number, si: number) => setItems(prev =>
    prev.map((s, idx) => idx === i ? { ...s, guide_steps: s.guide_steps.filter((_, j) => j !== si) } : s));

  const handleSave = async (i: number) => {
    setSaving(i);
    await supabase.from("config_software").upsert(items[i] as unknown as Record<string, unknown>, { onConflict: "software_key" });
    setSaving(null); setSaved(i); setTimeout(() => setSaved(null), 2500);
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      software_key: "", name: "", version: "", description: "", guide_steps: [] as string[],
      test_command: "", download_url: "", redeem_code: "",
      sort_order: (prev[prev.length-1]?.sort_order || 0) + 1,
    }]);
    setOpenIdx(items.length);
  };

  const removeItem = async (i: number) => {
    const s = items[i];
    if (!confirm(`Hapus software "${s.name}"?`)) return;
    await supabase.from("config_software").delete().eq("software_key", s.software_key);
    setItems(prev => prev.filter((_, idx) => idx !== i));
  };

  if (loading) return <div className={styles.loading}>Memuat data software...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><Wrench size={20} /> Platform & Software</h2>
          <p>Kelola daftar software, panduan instalasi, kode akses, dan tautan download</p>
        </div>
        <button className={styles.saveBtn} onClick={addItem} style={{ background: "#0ea5e9" }}>
          <Plus size={14} /> Tambah Software
        </button>
      </div>

      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} className={styles.materiCard}>
            <div className={`${styles.materiCardHead} ${isOpen ? styles.materiCardHeadOpen : ""}`}
              onClick={() => setOpenIdx(isOpen ? null : i)}>
              <div className={styles.materiCardHeadLeft}>
                <span className={styles.sessionNumBadge}>{item.software_key || "new"}</span>
                <span className={styles.materiCardTitle}>{item.name || <i style={{ color: "#94a3b8" }}>Belum ada nama</i>}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.version}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); removeItem(i); }}><Trash2 size={14} /></button>
                {isOpen ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
              </div>
            </div>
            {isOpen && (
              <div className={styles.materiCardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.field}><label>Software Key (unik)</label>
                    <input className={styles.input} value={item.software_key} onChange={e => update(i, "software_key", e.target.value)} placeholder="qgis" /></div>
                  <div className={styles.field}><label>Nama</label>
                    <input className={styles.input} value={item.name} onChange={e => update(i, "name", e.target.value)} /></div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.field}><label>Versi</label>
                    <input className={styles.input} value={item.version} onChange={e => update(i, "version", e.target.value)} /></div>
                  <div className={styles.field}><label>Sort Order</label>
                    <input className={styles.input} type="number" value={item.sort_order} onChange={e => update(i, "sort_order", Number(e.target.value))} /></div>
                </div>
                <div className={styles.field}><label>Deskripsi</label>
                  <textarea className={styles.textarea} rows={2} value={item.description} onChange={e => update(i, "description", e.target.value)} /></div>
                <div className={styles.formGrid}>
                  <div className={styles.field}><label>URL Download</label>
                    <input className={styles.input} value={item.download_url} onChange={e => update(i, "download_url", e.target.value)} placeholder="https://..." /></div>
                  <div className={styles.field}><label>Redeem Code</label>
                    <input className={styles.input} value={item.redeem_code} onChange={e => update(i, "redeem_code", e.target.value)} /></div>
                </div>
                <div className={styles.field}><label>Test Command (Terminal)</label>
                  <input className={styles.input} value={item.test_command} onChange={e => update(i, "test_command", e.target.value)} placeholder="qgis --version" /></div>
                <div className={styles.field}>
                  <label>Langkah Instalasi / Setup</label>
                  <div className={styles.topicsEditor}>
                    {item.guide_steps.map((step: string, si: number) => (
                      <div key={si} className={styles.topicRow}>
                        <input className={styles.topicInput} value={step} onChange={e => updateStep(i, si, e.target.value)} placeholder={`Langkah ${si+1}...`} />
                        <button className={styles.deleteBtn} onClick={() => removeStep(i, si)}><Trash2 size={13} /></button>
                      </div>
                    ))}
                    <button className={styles.addTopicBtn} onClick={() => addStep(i)}><Plus size={12} /> Tambah Langkah</button>
                  </div>
                </div>
                <div className={styles.rowActions}>
                  {saved === i && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
                  <button className={styles.saveBtn} onClick={() => handleSave(i)} disabled={saving === i}>
                    <Save size={14} /> {saving === i ? "Menyimpan..." : "Simpan Software Ini"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: LINKS — Kelola Link Pendukung
// ════════════════════════════════════════════════════════
function TabLinks() {
  const [links, setLinks]       = useState<LinkRow[]>([]);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase.from("config_links").select("*").order("sort_order").then(({ data }) => {
      setLinks((data as LinkRow[]) || []);
      setLoading(false);
    });
  }, []);

  const updateLink = (i: number, f: keyof LinkRow, v: string | number) =>
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [f]: v } : l));

  const addLink = () => setLinks(prev => [...prev, { title: "", url: "", sort_order: (prev[prev.length-1]?.sort_order || 0) + 1 }]);
  const removeLink = (i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("config_links").delete().neq("sort_order", -999);
    const rows = links.filter(l => l.title.trim()).map((l, i) => ({
      title: l.title.trim(), url: l.url, sort_order: i + 1
    }));
    if (rows.length) await supabase.from("config_links").insert(rows);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat data link...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><Link2 size={20} /> Link Pendukung</h2>
          <p>Kelola tautan tambahan yang muncul di halaman Link Pendukung learner</p>
        </div>
        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}><Link2 size={14} /> Daftar Link</div>
        <p style={{ fontSize: 12, color: "#64748b", marginTop: -8 }}>Link yang ditambahkan akan muncul otomatis di halaman Link Pendukung dashboard learner.</p>
        <div className={styles.listCard}>
          <div className={styles.listRow} style={{ gridTemplateColumns: "24px 1fr 1fr auto", background: "#f8fafc" }}>
            <span className={styles.listNum}>#</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>JUDUL / DESKRIPSI</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>URL</span>
            <span />
          </div>
          {links.map((link, i) => (
            <div key={i} className={`${styles.listRow} ${styles.listRowParticipant}`}>
              <span className={styles.listNum}>{i + 1}</span>
              <input className={styles.input} value={link.title} onChange={e => updateLink(i, "title", e.target.value)} placeholder="Judul link..." style={{ fontSize: 12.5 }} />
              <input className={styles.input} value={link.url} onChange={e => updateLink(i, "url", e.target.value)} placeholder="https://..." style={{ fontSize: 12.5 }} />
              <button className={styles.deleteBtn} onClick={() => removeLink(i)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button className={styles.addRowBtn} onClick={addLink}><Plus size={14} /> Tambah Link</button>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════
// TAB: KELOMPOK MENTORING (Admin CRUD)
// ════════════════════════════════════════════════════════

interface GroupRow { group_number: number; mentor_name: string; participant_name: string; }
interface GroupConfig { group_number: number; mentor_name: string; members: string[]; }

const MENTOR_COLORS: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  "Raden Pranantya":   { bg: "#eff6ff", border: "#bfdbfe", badge: "#1d4ed8", text: "#1e40af" },
  "Rifqi Naufal":      { bg: "#fefce8", border: "#fde68a", badge: "#b45309", text: "#92400e" },
  "Ahmad Zaenun Faiz": { bg: "#fdf2f8", border: "#f9a8d4", badge: "#be185d", text: "#9d174d" },
};

const MENTOR_OPTIONS = ["Raden Pranantya", "Rifqi Naufal", "Ahmad Zaenun Faiz"];

// Seed data dari pembagian resmi Batch 3
const SEED_ROWS: GroupRow[] = [
  ...["Kalvin Reza Pratama","Rafi Fistra Ali","Binar Aulia Setyawan","Athirah Hamzah","Azya Naurah Sumakhalda","Robertho Kadji","Rinjani Putri Djunaedi","Rizki Amara Putri","Muhammad Thariq Aziz"].map(n=>({group_number:1,mentor_name:"Raden Pranantya",participant_name:n})),
  ...["Adinda Dwi Yulianto","Abdullah Yusuf Syahadah","Muhammad Aryasatya Rafliando","Ghalih N. Wicaksono","Arfan Ferdiansyah","Dimas Tri Nur Hidayat","Riyan Alaji","Mujahid Sukarno","Abdul Mujib"].map(n=>({group_number:2,mentor_name:"Raden Pranantya",participant_name:n})),
  ...["Agung Ashshiddiqi","Ahmad Asmuri Haruna","Tika Mutiara Ula","Rachmadhiya Salsabila","Camilla Rosanti Budimansyah","Akbar Hidayatuloh","Fathi Muzaqi","Agus Sudiono"].map(n=>({group_number:3,mentor_name:"Raden Pranantya",participant_name:n})),
  ...["Alvito Krishna Balapradhana","Supriyadi","Agus Santoso","Kristuanto Nugroho Saputro","Dwiky Himawan Prabowo","Muhammad Maulana Rizki","Harizky Arfianto","Muhammad Asyroful Mujib","Katarina Andrea Laurentia"].map(n=>({group_number:4,mentor_name:"Rifqi Naufal",participant_name:n})),
  ...["Naufal Awaly Raihan","Farel Ahadyatulakbar Aditama","Febrian Fadila Rizky","Fabian Surya Pramudya","Adnan Yusuf Hartawan","Yana Wicaksana","Adnan Ananda","Niken Aprilia Sandyarani","Muhammad Ayyub"].map(n=>({group_number:5,mentor_name:"Rifqi Naufal",participant_name:n})),
  ...["Ferry Febrian","Nabila Nahdatul Husna","Daffa' 'Alim Al Adzin","Muhammad Caesar Almayda Wira","Muhammad Rifki","Najmu Laila","Nadhia Ferlia Fara","Ilham Bagus Wiranto","Salsabila Rosa Batubara"].map(n=>({group_number:6,mentor_name:"Rifqi Naufal",participant_name:n})),
  ...["Indri Puspita","Haidar Ismail","Delia Lathifah","Wahyu Panji Sugiantoro","Lukman Hakim","Zakiya Rozqi Auliya","Aminudin Siregar","Putra Rizki Ramadhan","Alfian Firdaus"].map(n=>({group_number:7,mentor_name:"Ahmad Zaenun Faiz",participant_name:n})),
  ...["Izza Rachman Suwandi","Aprilius Nadzario Mulya Clara","A Yusril Ihza Mahendra","Ramadian Irvanizar","Ester Marlina Mumu","Nawal Syafiq Farihan","Titanio Yudista","Kanesia Tahira","Damar Panoto"].map(n=>({group_number:8,mentor_name:"Ahmad Zaenun Faiz",participant_name:n})),
  ...["Habibi Faridh","Ayesha Amalia Putri","Surya Dewi","Aulia Sugesti Putri","Linda Ambala Tifa Ramadhani","Nadya Fadhilah Febrianti","Ahmad Fauzi Budjang","Saffaanatin Nafiis"].map(n=>({group_number:9,mentor_name:"Ahmad Zaenun Faiz",participant_name:n})),
];

function rowsToGroups(rows: GroupRow[]): GroupConfig[] {
  const map = new Map<number, GroupConfig>();
  rows.forEach(r => {
    if (!map.has(r.group_number)) map.set(r.group_number, { group_number: r.group_number, mentor_name: r.mentor_name, members: [] });
    map.get(r.group_number)!.members.push(r.participant_name);
  });
  return Array.from(map.values()).sort((a, b) => a.group_number - b.group_number);
}

function TabKelompok() {
  const [rows, setRows]         = useState<GroupRow[]>([]);
  const [openGroup, setOpenGroup] = useState<number | null>(1);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [seeding, setSeeding]   = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    supabase.from("config_groups").select("group_number,mentor_name,participant_name").order("group_number").then(({ data }) => {
      setRows((data as GroupRow[]) || []);
      setLoading(false);
    });
  }, []);

  const groups = rowsToGroups(rows);

  const addMember = (groupNum: number, mentor: string) => {
    setRows(prev => [...prev, { group_number: groupNum, mentor_name: mentor, participant_name: "" }]);
  };

  const updateMember = (groupNum: number, idx: number, val: string) => {
    const groupRows = rows.filter(r => r.group_number === groupNum);
    const globalIdx = rows.indexOf(groupRows[idx]);
    setRows(prev => prev.map((r, i) => i === globalIdx ? { ...r, participant_name: val } : r));
  };

  const removeMember = (groupNum: number, idx: number) => {
    const groupRows = rows.filter(r => r.group_number === groupNum);
    const globalIdx = rows.indexOf(groupRows[idx]);
    setRows(prev => prev.filter((_, i) => i !== globalIdx));
  };

  const addGroup = () => {
    const nextNum = (groups[groups.length - 1]?.group_number || 0) + 1;
    setRows(prev => [...prev, { group_number: nextNum, mentor_name: MENTOR_OPTIONS[0], participant_name: "" }]);
    setOpenGroup(nextNum);
  };

  const updateGroupMentor = (groupNum: number, mentor: string) => {
    setRows(prev => prev.map(r => r.group_number === groupNum ? { ...r, mentor_name: mentor } : r));
  };

  const removeGroup = (groupNum: number) => {
    if (!confirm(`Hapus Kelompok ${groupNum} dan semua anggotanya?`)) return;
    setRows(prev => prev.filter(r => r.group_number !== groupNum));
    if (openGroup === groupNum) setOpenGroup(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const validRows = rows.filter(r => r.participant_name.trim());
    await supabase.from("config_groups").delete().neq("group_number", -999);
    if (validRows.length) await supabase.from("config_groups").insert(validRows.map(r => ({ group_number: r.group_number, mentor_name: r.mentor_name, participant_name: r.participant_name.trim() })));
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const handleSeed = async () => {
    if (!confirm("Ini akan mengganti semua data kelompok dengan data resmi Batch 3. Lanjutkan?")) return;
    setSeeding(true);
    await supabase.from("config_groups").delete().neq("group_number", -999);
    await supabase.from("config_groups").insert(SEED_ROWS);
    setRows(SEED_ROWS);
    setSeeding(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className={styles.loading}>Memuat data kelompok...</div>;

  return (
    <>
      <div className={styles.panelHeader}>
        <div>
          <h2><UserCheck size={20} /> Kelompok Mentoring</h2>
          <p>Atur pembagian kelompok mentoring — data ini tampil di dashboard peserta</p>
        </div>
        <div className={styles.rowActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button onClick={handleSeed} disabled={seeding} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 12.5, cursor: "pointer", color: "#475569" }}>
            {seeding ? "Loading..." : "⬇ Import Data Resmi Batch 3"}
          </button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            <Save size={14} /> {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>
      </div>

      {/* Groups per mentor */}
      {MENTOR_OPTIONS.map(mentor => {
        const color = MENTOR_COLORS[mentor];
        const mGroups = groups.filter(g => g.mentor_name === mentor);
        return (
          <div key={mentor} style={{ background: color.bg, border: `1.5px solid ${color.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: color.badge, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <GraduationCap size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: color.text }}>{mentor}</div>
                <div style={{ fontSize: 11.5, color: "#64748b" }}>{mGroups.length} kelompok · {mGroups.reduce((a, g) => a + g.members.length, 0)} peserta</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mGroups.map(group => {
                const isOpen = openGroup === group.group_number;
                const groupRows = rows.filter(r => r.group_number === group.group_number);
                return (
                  <div key={group.group_number} style={{ background: "#fff", borderRadius: 10, border: `1px solid ${color.border}`, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
                      <button onClick={() => setOpenGroup(isOpen ? null : group.group_number)}
                        style={{ flex: 1, background: "none", border: "none", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left", padding: 0 }}>
                        <span style={{ background: color.badge, color: "#fff", borderRadius: 6, fontSize: 11.5, fontWeight: 800, padding: "3px 10px" }}>
                          Kelompok {group.group_number}
                        </span>
                        <span style={{ fontSize: 12.5, color: "#64748b" }}>{group.members.length} peserta</span>
                        {isOpen ? <ChevronUp size={15} color="#94a3b8" /> : <ChevronDown size={15} color="#94a3b8" />}
                      </button>
                      <select value={group.mentor_name} onChange={e => updateGroupMentor(group.group_number, e.target.value)}
                        style={{ fontSize: 11.5, padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", color: color.text, background: color.bg, fontWeight: 700 }}>
                        {MENTOR_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <button onClick={() => removeGroup(group.group_number)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fca5a5", padding: "2px 4px" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isOpen && (
                      <div style={{ borderTop: `1px solid ${color.border}`, padding: "10px 14px" }}>
                        {groupRows.map((r, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ width: 20, fontSize: 11, color: "#cbd5e1", fontWeight: 700, textAlign: "right", flexShrink: 0 }}>{idx + 1}</span>
                            <input className={styles.input} value={r.participant_name}
                              onChange={e => updateMember(group.group_number, idx, e.target.value)}
                              placeholder="Nama peserta..." style={{ flex: 1, fontSize: 12.5 }} />
                            <button onClick={() => removeMember(group.group_number, idx)}
                              className={styles.deleteBtn}><Trash2 size={13} /></button>
                          </div>
                        ))}
                        <button onClick={() => addMember(group.group_number, group.mentor_name)}
                          className={styles.addRowBtn} style={{ marginTop: 6 }}>
                          <Plus size={13} /> Tambah Anggota
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={addGroup}
              style={{ marginTop: 10, background: "none", border: `1.5px dashed ${color.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: color.text, cursor: "pointer", width: "100%" }}>
              <Plus size={13} /> Tambah Kelompok Baru
            </button>
          </div>
        );
      })}
    </>
  );
}
