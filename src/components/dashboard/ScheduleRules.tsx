"use client";

import { Video, ScrollText, CalendarDays } from "lucide-react";
import styles from "./ScheduleRules.module.css";

const ZOOM_LINK = "https://zoom.us/j/88219283192?pwd=mapidacademy";

const C = { intro: "#7c52d4", spatial: "#0e7490", web: "#f97316", webmap: "#5272b8", python: "#16a34a" };

const SESSIONS = [
  // Introduction (Sesi 1–2)
  { number: "Sesi 1",   date: "5 Jun",  day: "Jumat",  title: "Onboarding Program",                 desc: "Platform komunikasi, tata cara pengumpulan tugas, dan ketentuan sertifikat kelulusan.",                                       category: "Introduction",      instructor: "MC",               color: C.intro   },
  { number: "Sesi 2",   date: "8 Jun",  day: "Senin",  title: "Get to Know WebGIS",                 desc: "Apa itu WebGIS? Learning Journey, Industry Real Case, Potensi Karir Praktisi WebGIS.",                                       category: "Introduction",      instructor: "All Mentor",       color: C.intro   },
  // Spatial Module (Sesi 3–4)
  { number: "Sesi 3",   date: "12 Jun", day: "Jumat",  title: "GIS Fundamental",                    desc: "Konsep GIS dan data spasial serta format yang masuk ke WebGIS: GeoJSON, Shapefile, Raster.",                                 category: "Spatial Module",    instructor: "Dzikri Nashrul",           color: C.spatial },
  { number: "Sesi 4",   date: "15 Jun", day: "Senin",  title: "Location Value with GEO MAPID",      desc: "GEO MAPID sebagai database dan pengelola data spasial: digitasi, impor data, API MAPID.",                                     category: "Spatial Module",    instructor: "Dzikri Nashrul",           color: C.spatial },
  // Web Module (Sesi 5–8)
  { number: "Sesi 5",   date: "19 Jun", day: "Jumat",  title: "Intro VS Code, Git, HTML & CSS",     desc: "Workflow development: VS Code, Git & GitHub, struktur dasar website dengan HTML dan CSS.",                                    category: "Web Module",        instructor: "Rifqi Naufal",            color: C.web     },
  { number: "Sesi 6",   date: "22 Jun", day: "Senin",  title: "HTML & CSS Part 2 — Tailwind",       desc: "Layouting dashboard dengan Flexbox/Grid dan Tailwind CSS. Pengenalan Stitch AI untuk inspirasi UI.",                          category: "Web Module",        instructor: "Rifqi Naufal",            color: C.web     },
  { number: "Sesi 7",   date: "26 Jun", day: "Jumat",  title: "JavaScript Part 1",                  desc: "Dasar JavaScript: variable, logic, function, dan event sebagai pondasi interaksi website.",                                   category: "Web Module",        instructor: "Rifqi Naufal",            color: C.web     },
  { number: "Sesi 8",   date: "29 Jun", day: "Senin",  title: "JavaScript Part 2",                  desc: "DOM manipulation dan integrasi interaksi ke elemen website sebagai dasar interaktivitas WebGIS.",                             category: "Web Module",        instructor: "Rifqi Naufal",            color: C.web     },
  // WebMap & Feature Module (Sesi 9–15)
  { number: "Sesi 9",   date: "3 Jul",  day: "Jumat",  title: "Introduction JavaScript Modern",     desc: "Struktur code modern, async-await, dan workflow integrasi web map sebagai transisi ke MapLibre.",                             category: "WebMap & Feature",  instructor: "Rifqi Naufal",            color: C.webmap  },
  { number: "Sesi 10",  date: "6 Jul",  day: "Senin",  title: "Setup Your First WebGIS Project",   desc: "NodeJS, Vite, dan MapLibre GL JS. Setup repository GitHub dan implementasi web map pertama.",                                  category: "WebMap & Feature",  instructor: "Ahmad Zaenun Faiz",color: C.webmap  },
  { number: "Sesi 11",  date: "10 Jul", day: "Jumat",  title: "Dive Into MapLibre GL JS",           desc: "Visualisasi data spasial, vector vs raster mapping, implementasi GeoJSON pada web map interaktif.",                           category: "WebMap & Feature",  instructor: "Ahmad Zaenun Faiz",color: C.webmap  },
  { number: "Sesi 12",  date: "13 Jul", day: "Senin",  title: "Control Your WebMap",                desc: "Fitur interaktif: popup, controls, handlers, browser gesture, dan event interaction pada peta.",                               category: "WebMap & Feature",  instructor: "Ahmad Zaenun Faiz",color: C.webmap  },
  { number: "Sesi 13",  date: "17 Jul", day: "Jumat",  title: "Use Spatial Engine Processor",       desc: "Feature processing, workflow spatial processing, dan integrasi UI untuk spatial engine pada WebGIS.",                          category: "WebMap & Feature",  instructor: "Ahmad Zaenun Faiz",color: C.webmap  },
  { number: "Sesi 14",  date: "20 Jul", day: "Senin",  title: "Leverage Development with AI",       desc: "Cursor AI pada workflow development: multiple pages, code review, debugging, dan boilerplate management.",                      category: "WebMap & Feature",  instructor: "Ahmad Zaenun Faiz",color: C.webmap  },
  { number: "Sesi 15",  date: "24 Jul", day: "Senin",  title: "Make Your WebGIS Accessible",        desc: "Deployment modern ke public internet via GitHub Actions, monitoring pipeline, dan AI-assisted config.",                         category: "WebMap & Feature",  instructor: "Ahmad Zaenun Faiz",color: C.webmap  },
  // Python (Bonus 1–2)
  { number: "Bonus 1",  date: "25 Jul", day: "Sabtu",  title: "Python for Spatial Data",            desc: "Pengenalan Python untuk pengolahan dan preprocessing data spasial WebGIS dengan GEO MAPID.",                                   category: "Python",            instructor: "Raden Pranantya",  color: C.python, note: "Khusus Python Session · Sabtu & Minggu · 08.30–11.30 WIB" },
  { number: "Bonus 2",  date: "26 Jul", day: "Minggu", title: "Spatial Analysis & Automation",      desc: "Spatial analysis sederhana dengan library Python dan data GEO MAPID, termasuk automation preprocessing.",                      category: "Python",            instructor: "Raden Pranantya",  color: C.python, note: "Khusus Python Session · Sabtu & Minggu · 08.30–11.30 WIB" },
];

const RULES = [
  { title: "Penyelesaian Post Test",           desc: "Post test wajib diisi setiap selesai mengikuti masing-masing sesi pertemuan." },
  { title: "Konektivitas Tugas Terintegrasi",  desc: "Tugas mingguan (Sesi 1–15) saling berkesinambungan membentuk final project WebGIS mandiri." },
  { title: "Evaluasi Logika Mandiri",          desc: "Penilaian berfokus pada pemahaman sintaks. AI diperbolehkan sebagai asisten logika, bukan full generate." },
  { title: "Fokus Penilaian Portofolio",       desc: "Dievaluasi atas: Storytelling, UI/UX Peta, fungsionalitas WebGIS, dan hasil deploy cloud." },
];

// Group all sessions into snake rows of 4
const ROWS: (typeof SESSIONS)[] = [];
for (let i = 0; i < SESSIONS.length; i += 4) {
  ROWS.push(SESSIONS.slice(i, i + 4));
}

export default function ScheduleRules() {
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
          <a href={ZOOM_LINK} target="_blank" rel="noopener noreferrer" className={styles.zoomBtn}>
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

        <div className={styles.roadmap}>
          {ROWS.map((row, ri) => {
            const isRtl = ri % 2 === 1;
            const displayed = isRtl ? [...row].reverse() : row;
            return (
              <div key={ri} className={styles.roadmapBlock}>
                <div className={`${styles.roadmapRow} ${isRtl ? styles.rowRtl : ""}`}>
                  {displayed.map((s, ci) => (
                    <div key={ci} className={styles.sessionCard}>
                      {"note" in s && s.note && (
                        <div className={styles.cardNote}>{s.note as string}</div>
                      )}
                      <div className={styles.cardTop}>
                        <div className={styles.cardBadge} >
                          <span className={styles.badgeNum}>{s.number}</span>
                          <span className={styles.badgeDate}>{s.date.split(" ")[0]}</span>
                          <span className={styles.badgeMonth}>{s.date.split(" ")[1]}</span>
                        </div>
                        <div className={styles.cardTitle}>{s.title}</div>
                      </div>
                      <div className={styles.cardDesc}>{s.desc}</div>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardCat} style={{ color: s.color, background: `${s.color}18` }}>{s.category}</span>
                        <span className={styles.cardInstructor}>{s.instructor}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connector to next row */}
                {ri < ROWS.length - 1 && (
                  <div className={`${styles.connector} ${isRtl ? styles.connectorLeft : styles.connectorRight}`} />
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
