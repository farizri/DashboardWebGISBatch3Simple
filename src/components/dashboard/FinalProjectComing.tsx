"use client";

import { useEffect, useState } from "react";
import { Trophy, ExternalLink, Hourglass, CheckCircle2, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./FinalProjectComing.module.css";

interface FinalProject { participant: string; url: string; submitted_at: string; }

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
  const [participants, setParticipants] = useState<string[]>([]);
  const [projects, setProjects]         = useState<FinalProject[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: fp }] = await Promise.all([
        supabase.from("config_participants").select("name").order("sort_order"),
        supabase.from("final_projects").select("participant,url,submitted_at"),
      ]);
      setParticipants((p || []).map((x: { name: string }) => x.name));
      setProjects((fp as FinalProject[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const projectMap: Record<string, FinalProject> = {};
  projects.forEach(fp => { projectMap[fp.participant] = fp; });

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

      {/* Coming Soon */}
      <div className={styles.comingSoonCard}>
        <Hourglass size={24} color="#94a3b8" />
        <div>
          <strong>Form Pengumpulan Final Project</strong>
          <p>Form pengumpulan akan dibuka mendekati akhir program. Pantau terus halaman ini!</p>
        </div>
        <span className={styles.comingSoonBadge}>COMING SOON</span>
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
                <th>Link WebGIS</th>
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
                        ? <a href={fp.url} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                            <ExternalLink size={11} /> Lihat WebGIS
                          </a>
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
