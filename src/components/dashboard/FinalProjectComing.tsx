"use client";

import { useEffect, useState } from "react";
import { Trophy, ExternalLink, CheckCircle2, Globe, GitFork, Newspaper, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./FinalProjectComing.module.css";

interface FinalProject {
  participant: string;
  url: string;
  github_url?: string;
  publication_url?: string;
  submitted_at: string;
}

const KETENTUAN_OUTPUT = [
  "Landing page / dashboard sederhana yang rapi dan informatif",
  "WebMap interaktif berbasis MapLibre GL JS",
  "Integrasi data spasial pribadi atau project nyata",
  "Minimal 1 spatial feature: popup, heatmap, radius, atau isochrone",
  "Public deployment dengan link project yang bisa diakses",
  "Portfolio-ready WebGIS project yang siap dipresentasikan",
];

const FOKUS_PENILAIAN = [
  { label: "Industry Relevance",            desc: "Relevansi dengan kebutuhan industri dan use case nyata di lapangan." },
  { label: "Problem Solving & Storytelling", desc: "Kemampuan mengangkat permasalahan spasial dan menyajikannya secara naratif." },
  { label: "UI/UX & Visual Clarity",        desc: "Tampilan dashboard yang bersih, intuitif, dan nyaman digunakan." },
  { label: "Struktur & Reasoning Code",     desc: "Kualitas kode, keterbacaan, dan kemampuan menjelaskan logika implementasi." },
  { label: "Interaktivitas WebGIS",         desc: "Kelengkapan fitur spasial dan tingkat interaksi user pada peta." },
  { label: "Progress & Consistency",        desc: "Konsistensi pengerjaan tugas dari sesi awal hingga deployment akhir." },
];

export default function FinalProjectComing() {
  const [participantList, setParticipantList] = useState<{ name: string; email: string }[]>([]);
  const [projects, setProjects]         = useState<FinalProject[]>([]);
  const [loading, setLoading]           = useState(true);

  const [selectedUser, setSelectedUser] = useState("");
  const [webgisUrl, setWebgisUrl]       = useState("");
  const [githubUrl, setGithubUrl]       = useState("");
  const [publicationUrl, setPublicationUrl] = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [saved, setSaved]               = useState(false);

  const prefillForm = (name: string, fromProjects: FinalProject[]) => {
    const existing = fromProjects.find(p => p.participant === name);
    setWebgisUrl(existing?.url || "");
    setGithubUrl(existing?.github_url || "");
    setPublicationUrl(existing?.publication_url || "");
    setSaved(false);
  };

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: fp }] = await Promise.all([
        supabase.from("config_participants").select("name,email").order("sort_order"),
        supabase.from("final_projects").select("participant,url,github_url,publication_url,submitted_at"),
      ]);
      const list = (p || []) as { name: string; email: string }[];
      const fetchedProjects = (fp as FinalProject[]) || [];
      setParticipantList(list);
      setProjects(fetchedProjects);

      const savedName = localStorage.getItem("mapid_active_username");
      const found = list.find(u => u.name === savedName);
      const activeName = found ? found.name : (list[0]?.name || "");
      if (activeName) {
        setSelectedUser(activeName);
        prefillForm(activeName, fetchedProjects);
        if (!found) {
          localStorage.setItem("mapid_active_username", activeName);
          localStorage.setItem("mapid_active_useremail", list[0]?.email || "");
        }
      }

      setLoading(false);
    }
    load();
  }, []);

  const projectMap: Record<string, FinalProject> = {};
  projects.forEach(fp => { projectMap[fp.participant] = fp; });

  const handleUserChange = (name: string) => {
    setSelectedUser(name);
    prefillForm(name, projects);
    localStorage.setItem("mapid_active_username", name);
    const found = participantList.find(u => u.name === name);
    localStorage.setItem("mapid_active_useremail", found?.email || "peserta@mapid.co.id");
    window.dispatchEvent(new Event("storage"));
  };

  const canSubmit = selectedUser && webgisUrl.trim() && githubUrl.trim() && publicationUrl.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const { error } = await supabase.from("final_projects").upsert({
      participant: selectedUser,
      url: webgisUrl.trim(),
      github_url: githubUrl.trim(),
      publication_url: publicationUrl.trim(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "participant" });
    setSubmitting(false);
    if (error) {
      alert(`Gagal mengumpulkan final project: ${error.message}`);
      return;
    }
    setProjects(prev => {
      const others = prev.filter(p => p.participant !== selectedUser);
      return [...others, {
        participant: selectedUser, url: webgisUrl.trim(),
        github_url: githubUrl.trim(), publication_url: publicationUrl.trim(),
        submitted_at: new Date().toISOString(),
      }];
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const participants = participantList.map(p => p.name);
  const PAGE_SIZE = 16;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(participants.length / PAGE_SIZE);
  const pagedParticipants = participants.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2><Trophy size={22} /> Final Project WebGIS</h2>
        <p>Rekapitulasi pengumpulan final project peserta WebGIS Bootcamp Batch 3.</p>
      </div>

      {/* Form Pengumpulan */}
      <div className={styles.submitCard}>
        <div className={styles.infoTitle}><Send size={15} /> Form Pengumpulan Final Project</div>

        <div className={styles.formField}>
          <label>Pilih Nama Anda (Peserta)</label>
          <select className={styles.formSelect} value={selectedUser} onChange={e => handleUserChange(e.target.value)}>
            {participantList.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </div>

        <div className={styles.formField}>
          <label><Globe size={12} /> Link WebGIS (Public Deployment)</label>
          <input className={styles.formInput} value={webgisUrl} onChange={e => setWebgisUrl(e.target.value)}
            placeholder="https://project-anda.netlify.app" />
        </div>

        <div className={styles.formField}>
          <label><GitFork size={12} /> Link GitHub Repository</label>
          <input className={styles.formInput} value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo" />
        </div>

        <div className={styles.formField}>
          <label><Newspaper size={12} /> Link Data Publication</label>
          <input className={styles.formInput} value={publicationUrl} onChange={e => setPublicationUrl(e.target.value)}
            placeholder="https://mapid.co.id/blog/artikel-anda" />
        </div>

        <div className={styles.formActions}>
          {saved && <span className={styles.savedMsg}><CheckCircle size={14} /> Tersimpan</span>}
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!canSubmit || submitting}>
            <Send size={14} /> {submitting ? "Mengumpulkan..." : "Kumpulkan Final Project"}
          </button>
        </div>
      </div>

      {/* Info Grid — 2 cards side by side */}
      <div className={styles.infoGrid}>

        <div className={styles.infoCard}>
          <div className={styles.infoTitle}><Globe size={15} /> Output Minimum WebGIS</div>
          <ul className={styles.checkList}>
            {KETENTUAN_OUTPUT.map((item, i) => (
              <li key={i}><CheckCircle2 size={13} className={styles.checkIcon} />{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.penilaianCard}>
          <div className={styles.infoTitle}><Trophy size={15} /> Fokus Penilaian Final Project</div>
          <div className={styles.penilaianGrid}>
            {FOKUS_PENILAIAN.map((p, i) => (
              <div key={i} className={styles.penilaianItem}>
                <span className={styles.penilaianNum}>{i + 1}</span>
                <div>
                  <strong>{p.label}</strong>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Rekapitulasi */}
      <div className={styles.rekapCard}>
        <div className={styles.rekapTitle}><Trophy size={14} /> Rekapitulasi Pengumpulan Final Project</div>
        {loading && <div className={styles.loading}>Memuat data...</div>}
        {!loading && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Peserta</th>
                <th>Link</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {pagedParticipants.map((name, i) => {
                const fp = projectMap[name];
                const globalIdx = page * PAGE_SIZE + i + 1;
                return (
                  <tr key={name}>
                    <td className={styles.tdNum}>{globalIdx}</td>
                    <td className={styles.tdName}>{name}</td>
                    <td>
                      {fp
                        ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <a href={fp.url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                              <ExternalLink size={11} /> WebGIS
                            </a>
                            {fp.github_url && (
                              <a href={fp.github_url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                <GitFork size={11} /> GitHub
                              </a>
                            )}
                            {fp.publication_url && (
                              <a href={fp.publication_url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                <Newspaper size={11} /> Publikasi
                              </a>
                            )}
                          </div>
                        : <span className={styles.dash}>Belum dikumpulkan</span>
                      }
                    </td>
                    <td className={styles.tdDate}>
                      {fp
                        ? new Date(fp.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "—"
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "16px 0 4px" }}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: page === 0 ? "#f8fafc" : "#fff", color: page === 0 ? "#cbd5e1" : "#334155", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: 13 }}>
              ← Prev
            </button>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: page === totalPages - 1 ? "#f8fafc" : "#fff", color: page === totalPages - 1 ? "#cbd5e1" : "#334155", cursor: page === totalPages - 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
