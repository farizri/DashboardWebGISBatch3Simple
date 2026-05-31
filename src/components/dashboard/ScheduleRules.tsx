"use client";

import { useState, useEffect } from "react";
import { Video, ScrollText, CalendarDays } from "lucide-react";
import styles from "./ScheduleRules.module.css";
import { supabase } from "../../lib/supabase";
import type { SessionRow } from "../../lib/supabase";

const C = { intro: "#7c52d4", spatial: "#0e7490", web: "#f97316", webmap: "#5272b8", python: "#16a34a" };

function getCategoryInfo(sessionNo: number): { label: string; color: string } {
  if (sessionNo <= 2)  return { label: "Introduction",     color: C.intro   };
  if (sessionNo <= 4)  return { label: "Spatial Module",   color: C.spatial };
  if (sessionNo <= 8)  return { label: "Web Module",       color: C.web     };
  if (sessionNo <= 15) return { label: "WebMap & Feature", color: C.webmap  };
  return               { label: "Python",                  color: C.python  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleDateString("id-ID", { month: "short" });
  return `${day} ${month}`;
}

const RULES = [
  { title: "Penyelesaian Post Test",           desc: "Post test wajib diisi setiap selesai mengikuti masing-masing sesi pertemuan." },
  { title: "Konektivitas Tugas Terintegrasi",  desc: "Tugas mingguan (Sesi 1–15) saling berkesinambungan membentuk final project WebGIS mandiri." },
  { title: "Evaluasi Logika Mandiri",          desc: "Penilaian berfokus pada pemahaman sintaks. AI diperbolehkan sebagai asisten logika, bukan full generate." },
  { title: "Fokus Penilaian Portofolio",       desc: "Dievaluasi atas: Storytelling, UI/UX Peta, fungsionalitas WebGIS, dan hasil deploy cloud." },
];

export default function ScheduleRules() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [zoomLink, setZoomLink] = useState("https://zoom.us/j/88219283192?pwd=mapidacademy");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: sessData }, { data: cfg }] = await Promise.all([
        supabase.from("config_sessions").select("*").order("sort_order"),
        supabase.from("site_config").select("key,value").eq("key", "zoom_link"),
      ]);
      if (sessData && sessData.length > 0) setSessions(sessData as SessionRow[]);
      if (cfg && cfg.length > 0 && cfg[0].value) setZoomLink(cfg[0].value);
      setLoading(false);
    }
    load();
  }, []);

  // Group into snake rows of 4
  const ROWS: SessionRow[][] = [];
  for (let i = 0; i < sessions.length; i += 4) {
    ROWS.push(sessions.slice(i, i + 4));
  }

  return (
    <div className={styles.container}>

      <div className={styles.pageHeader}>
        <h1><CalendarDays size={20} /> Rencana Kurikulum Detail (Roadmap Program)</h1>
        <p>Klik pada kartu pertemuan untuk melihat target capaian (outcome), tools, dan detail materi lengkap:</p>
      </div>

      {/* Zoom Join Card */}
      <div className={styles.zoomCard}>
        <div className={styles.zoomLeft}>
          <span className={styles.zoomTag}><span className={styles.pulseDot} /> LIVE CLASS</span>
          <h2>Gabung Zoom Meeting</h2>
          <p>Kelas live WebGIS Bootcamp berlangsung setiap sesi sesuai jadwal. Pastikan kamu hadir tepat waktu!</p>
          <a href={zoomLink} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
            <Video size={15} /> Masuk Zoom Meeting
          </a>
        </div>
        <div className={styles.zoomRight}>
          <div className={styles.scheduleList}>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Hari</span>
              <span className={styles.scheduleVal}>Senin &amp; Jumat</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Jam</span>
              <span className={styles.scheduleVal}>19.00 – 21.30 WIB</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleLabel}>Bonus · Python Session</span>
              <span className={styles.scheduleVal}>25–26 Jul · 08.30 – 11.30 WIB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ketentuan Akademik */}
      <div className={styles.rulesCard}>
        <div className={styles.sectionTitle}>
          <ScrollText size={16} /> Ketentuan Akademik
        </div>
        <div className={styles.rulesGrid}>
          {RULES.map((r, i) => (
            <div key={i} className={styles.ruleItem}>
              <span className={styles.ruleNum}>{i + 1}</span>
              <div>
                <strong>{r.title}</strong>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jadwal — Snake Roadmap */}
      <div className={styles.jadwalSection}>
        <div className={styles.sectionTitle}>
          <CalendarDays size={16} /> Jadwal Pertemuan
        </div>

        {loading && (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            Memuat jadwal...
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
            Jadwal belum tersedia.
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className={styles.roadmap}>
            {ROWS.map((row, ri) => {
              const isRtl = ri % 2 === 1;
              const displayed = isRtl ? [...row].reverse() : row;
              return (
                <div key={ri} className={styles.roadmapBlock}>
                  <div className={`${styles.roadmapRow} ${isRtl ? styles.rowRtl : ""}`}>
                    {displayed.map((s, ci) => {
                      const { label: catLabel, color: catColor } = getCategoryInfo(s.session_no);
                      const dateFormatted = formatDate(s.session_date);
                      const [day, month] = dateFormatted.split(" ");
                      return (
                        <div key={ci} className={styles.sessionCard}>
                          <div className={styles.cardTop}>
                            <div className={styles.cardBadge}>
                              <span className={styles.badgeNum}>{s.number_label}</span>
                              <span className={styles.badgeDate}>{day}</span>
                              <span className={styles.badgeMonth}>{month}</span>
                            </div>
                            <div className={styles.cardTitle}>{s.title}</div>
                          </div>
                          <div className={styles.cardDesc}>{s.topic}</div>
                          <div className={styles.cardFooter}>
                            <span className={styles.cardCat} style={{ color: catColor, background: `${catColor}18` }}>{catLabel}</span>
                            <span className={styles.cardInstructor}>{s.pic}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {ri < ROWS.length - 1 && (
                    <div className={`${styles.connector} ${isRtl ? styles.connectorLeft : styles.connectorRight}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
