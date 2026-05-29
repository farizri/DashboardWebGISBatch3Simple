"use client";

import { useState, useEffect } from "react";
import {
  ScrollText, MessageCircle, Clock, Video,
  Map, Zap, CheckCircle2, Timer, Wrench, User, Target,
  GraduationCap, Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SessionRow, SessionWithStatus } from "@/lib/supabase";
import styles from "./ScheduleRules.module.css";

export default function ScheduleRules() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [siteCfg, setSiteCfg] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"All" | "Completed" | "Upcoming">("All");
  const [selectedSession, setSelectedSession] = useState<SessionWithStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [sessRes, cfgRes] = await Promise.all([
        supabase.from("academy_config_sessions").select("*").order("sort_order"),
        supabase.from("academy_site_config").select("key,value"),
      ]);

      if (sessRes.data) setSessions(sessRes.data as SessionRow[]);
      if (cfgRes.data) {
        const cfg: Record<string, string> = {};
        cfgRes.data.forEach((r: { key: string; value: string }) => {
          cfg[r.key] = r.value;
        });
        setSiteCfg(cfg);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const tatib = [1, 2, 3, 4].map((i) => ({
    title: siteCfg[`tata_tertib_${i}_title`] || `Aturan ${i}`,
    desc: siteCfg[`tata_tertib_${i}_desc`] || "",
  }));

  const fasilitator1Name = siteCfg["fasilitator_1_name"] || "Farah";
  const fasilitator2Name = siteCfg["fasilitator_2_name"] || "Rofi";
  const zoomUrl = siteCfg["zoom_link"] || `https://zoom.us/j/${siteCfg["zoom_meeting_id"]?.replace(/\s/g, "") || "88219283192"}?pwd=${siteCfg["zoom_passcode"] || "mapidacademy"}`;
  const zoomId = siteCfg["zoom_meeting_id"] || "882 1928 3192";
  const zoomPw = siteCfg["zoom_passcode"] || "mapidacademy";

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const sessionsWithStatus: SessionWithStatus[] = sessions.map((s) => {
    const dateStr = s.session_date || "";
    let status: SessionWithStatus["status"] = "Upcoming";
    if (dateStr && dateStr < todayStr) status = "Completed";
    else if (dateStr === todayStr) status = "Today";
    return { ...s, status };
  });

  const todaySession = sessionsWithStatus.find((s) => s.status === "Today");
  const filteredSessions = sessionsWithStatus.filter((s) => {
    if (filter === "All") return true;
    if (filter === "Completed") return s.status === "Completed";
    if (filter === "Upcoming") return s.status === "Upcoming" || s.status === "Today";
    return true;
  });

  const chunkSessions = (sess: typeof sessionsWithStatus, size = 4) => {
    const chunks: typeof sessionsWithStatus[] = [];
    for (let i = 0; i < sess.length; i += size) {
      chunks.push(sess.slice(i, i + size));
    }
    return chunks;
  };

  const parseDateDisplay = (dateStr: string) => {
    if (!dateStr) return { day: "", month: "" };
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const monthMap: Record<string, string> = {
        "01": "Jan", "02": "Feb", "03": "Maret", "04": "April",
        "05": "Mei", "06": "Juni", "07": "Juli", "08": "Ags",
        "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des",
      };
      return { day: parts[2], month: monthMap[parts[1]] || parts[1] };
    }
    return { day: dateStr, month: "" };
  };

  const sessionRows = chunkSessions(filteredSessions, 4);

  if (loading) {
    return (
      <div className={styles.container} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.rulesLandscape}>
        <div className={styles.rulesHeader}>
          <span className={styles.tag}>PENTING</span>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><ScrollText size={18} /> Tata Tertib &amp; Ketentuan Akademik</h3>
          <p className={styles.rulesIntro}>
            Harap patuhi ketentuan berikut demi kelancaran belajar dan pemenuhan syarat kelulusan sertifikasi WebGIS:
          </p>
        </div>
        <div className={styles.rulesGrid}>
          {tatib.map((rule, idx) => (
            <div key={idx} className={styles.ruleCard}>
              <span className={styles.ruleNum}>{idx + 1}</span>
              <h4>{rule.title}</h4>
              <p>{rule.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.helpBanner}>
          <div className={styles.helpText}>
            <h4>Butuh Bantuan Akademik?</h4>
            <p>Apabila berhalangan hadir atau terkendala teknis, segera hubungi tim fasilitator MAPID Academy:</p>
          </div>
          <div className={styles.helpContacts}>
            <div className={styles.helpContactItem}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageCircle size={14} /> {fasilitator1Name} (Fasilitator)</span>
            </div>
            <div className={styles.helpContactItem}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageCircle size={14} /> {fasilitator2Name} (Fasilitator)</span>
            </div>
          </div>
        </div>
      </div>

      {todaySession && (
        <div className={styles.zoomLiveCard}>
          <div className={styles.zoomLiveHeader}>
            <div className={styles.zoomLiveBadge}>
              <span className={styles.pulseDot}></span>
              LIVE CLASS HARI INI
            </div>
            <span className={styles.zoomTimeBadge} style={{ display: "flex", alignItems: "center", gap: "5px" }}><Clock size={13} /> {todaySession.time_label} WIB</span>
          </div>
          <div className={styles.zoomLiveContent}>
            <div className={styles.zoomLiveInfo}>
              <span className={styles.zoomSessionLabel}>SESI AKTIF SEKARANG</span>
              <h3>{todaySession.number_label}: {todaySession.title}</h3>
              <p>Materi: {todaySession.topic} bersama Mentor {todaySession.pic}.</p>
            </div>
            <div className={styles.zoomLiveActions}>
              <a href={zoomUrl} target="_blank" rel="noopener noreferrer" className={styles.zoomLaunchBtn}>
                <Video size={15} /> Gabung Zoom Meeting Sekarang
              </a>
              <div className={styles.zoomMeta}>
                <span><strong>Meeting ID:</strong> {zoomId}</span>
                <span className={styles.separator}>&bull;</span>
                <span><strong>Passcode:</strong> {zoomPw}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.scheduleColumn}>
        <div className={styles.scheduleHeader}>
          <div className={styles.scheduleHeaderLeft}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Map size={20} /> Rencana Kurikulum Detail (Roadmap Program)</h2>
            <p>Klik pada kartu pertemuan untuk melihat target capaian (outcome), tools, dan detail materi lengkap:</p>
          </div>

          <div className={styles.filterBar}>
            <button className={`${styles.filterBtn} ${filter === "All" ? styles.activeFilter : ""}`} onClick={() => setFilter("All")}>
              Semua ({sessions.length})
            </button>
            <button className={`${styles.filterBtn} ${filter === "Completed" ? styles.activeFilter : ""}`} onClick={() => setFilter("Completed")}>
              Selesai
            </button>
            <button className={`${styles.filterBtn} ${filter === "Upcoming" ? styles.activeFilter : ""}`} onClick={() => setFilter("Upcoming")}>
              Mendatang
            </button>
          </div>
        </div>

        <div className={styles.timeline}>
          {sessionRows.map((row, rowIndex) => {
            const isRowReverse = rowIndex % 2 === 1;
            const isLastRow = rowIndex === sessionRows.length - 1;
            let turnClass = "";
            if (!isLastRow) {
              turnClass = isRowReverse ? styles.turnLeft : styles.turnRight;
            }
            const rowStyle = {} as Record<string, string>;
            if (isLastRow && row.length === 1) {
              rowStyle["--row-line-display"] = "none";
            }

            return (
              <div key={rowIndex} className={`${styles.timelineRow} ${isRowReverse ? styles.timelineRowReverse : styles.timelineRowNormal} ${turnClass}`} style={rowStyle}>
                {row.map((session, sessionIdx) => {
                  const { day, month } = parseDateDisplay(session.session_date);
                  return (
                    <div key={sessionIdx} className={`${styles.sessionCard} ${styles[session.status.toLowerCase()]} ${session.status === "Today" ? styles.todayCardHighlighted : ""} btn-hover`} onClick={() => setSelectedSession(session)}>
                      <div className={styles.cardMain}>
                        <div className={styles.cardTop}>
                          <div className={`${styles.dateBadge} ${styles[session.status.toLowerCase()]}`}>
                            <span className={styles.sessionLabel}>{session.number_label.split(" ").slice(0, 2).join(" ")}</span>
                            <span className={styles.dateDay}>{day}</span>
                            <span className={styles.dateMonth}>{month}</span>
                          </div>
                          <div className={styles.cardHeaderInfo}>
                            <h4 className={styles.sessionTitle}>{session.title}</h4>
                            <span className={`${styles.statusBadge} ${styles[session.status.toLowerCase()]}`}>
                              {session.status === "Today" ? <><Zap size={10} /> HARI INI</> : session.status === "Completed" ? <><CheckCircle2 size={10} /> SELESAI</> : <><Timer size={10} /> MENDATANG</>}
                            </span>
                          </div>
                        </div>
                        <p className={styles.sessionTopic}>{session.topic}</p>
                        {session.status === "Today" && (
                          <div className={styles.cardZoomWrapper} onClick={(e) => e.stopPropagation()}>
                            <a href={zoomUrl} target="_blank" rel="noopener noreferrer" className={styles.cardZoomBtn}>
                              <Video size={13} /> Masuk Kelas Zoom
                            </a>
                            <div className={styles.cardZoomCredentials}>
                              <span>ID: {zoomId}</span>
                              <span>PW: {zoomPw}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {selectedSession && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSession(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedSession(null)}>&times;</button>
            <div className={styles.modalHeader}>
              <div className={`${styles.dateBadge} ${styles[selectedSession.status.toLowerCase()]}`}>
                <span className={styles.sessionLabel}>{selectedSession.number_label}</span>
                <span className={styles.dateDay}>{parseDateDisplay(selectedSession.session_date).day}</span>
                <span className={styles.dateMonth}>{parseDateDisplay(selectedSession.session_date).month}</span>
              </div>
              <div className={styles.modalHeaderInfo}>
                <span className={`${styles.statusBadge} ${styles[selectedSession.status.toLowerCase()]}`}>
                  {selectedSession.status === "Today" ? <><Zap size={10} /> HARI INI</> : selectedSession.status === "Completed" ? <><CheckCircle2 size={10} /> SELESAI</> : <><Timer size={10} /> MENDATANG</>}
                </span>
                <h3 className={styles.modalTitle}>{selectedSession.title}</h3>
              </div>
            </div>
            <div className={styles.modalBody}>
              {selectedSession.status === "Today" && (
                <div className={styles.modalZoomSection}>
                  <div className={styles.modalZoomHeader}>
                    <span className={styles.pulseDot}></span>
                    <strong>KELAS LIVE SEDANG BERLANGSUNG</strong>
                  </div>
                  <p>Silakan klik tombol di bawah ini untuk bergabung langsung ke Zoom Meeting kelas hari ini:</p>
                  <a href={zoomUrl} target="_blank" rel="noopener noreferrer" className={styles.modalZoomBtn}>
                    <Video size={14} /> Gabung Zoom Meeting
                  </a>
                  <div className={styles.modalZoomCredentials}>
                    <span><strong>Meeting ID:</strong> {zoomId}</span>
                    <span className={styles.modalSeparator}>&bull;</span>
                    <span><strong>Passcode:</strong> {zoomPw}</span>
                  </div>
                </div>
              )}
              <div className={styles.modalSection}>
                <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}><Target size={14} /> Fokus Utama Pertemuan:</strong>
                <p>{selectedSession.topic}</p>
              </div>
              <div className={styles.modalSection}>
                <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}><GraduationCap size={14} /> Capaian Hasil Belajar (Outcome):</strong>
                <p>{selectedSession.outcome}</p>
              </div>
              <div className={styles.modalGrid}>
                <div className={styles.modalGridCell}>
                  <strong style={{ display: "flex", alignItems: "center", gap: "5px" }}><Wrench size={13} /> Alat (Tools):</strong>
                  <p>{selectedSession.tools}</p>
                </div>
                <div className={styles.modalGridCell}>
                  <strong style={{ display: "flex", alignItems: "center", gap: "5px" }}><User size={13} /> Mentor (PIC):</strong>
                  <p>{selectedSession.pic}</p>
                </div>
                <div className={styles.modalGridCell}>
                  <strong style={{ display: "flex", alignItems: "center", gap: "5px" }}><Clock size={13} /> Waktu Kelas:</strong>
                  <p>{selectedSession.time_label} WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
