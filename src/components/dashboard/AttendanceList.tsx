"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Lightbulb, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./AttendanceList.module.css";

type AttendanceMap = Record<string, Record<number, boolean>>;

interface SessionInfo {
  session_no: number;
  number_label: string;
  title: string;
  session_date: string;
}

interface Participant {
  name: string;
}

function getTodayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCurrentTimeStr(): string {
  const now = new Date();
  return now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function AttendanceList() {
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [participants, setParticipants]   = useState<string[]>([]);
  const [sessions, setSessions]           = useState<SessionInfo[]>([]);
  const [loading, setLoading]             = useState(true);

  // Form state
  const [selectedName, setSelectedName]   = useState("");
  const [selectedBatch, setSelectedBatch] = useState("Batch 3");
  const [checkInTime, setCheckInTime]     = useState(getCurrentTimeStr());
  const [submitting, setSubmitting]       = useState(false);
  const [submitResult, setSubmitResult]   = useState<"success" | "already" | "error" | null>(null);

  const today = getTodayDateStr();
  const todaySession = sessions.find(s => s.session_date === today) ?? null;

  useEffect(() => {
    async function load() {
      const [{ data: att }, { data: sess }, { data: pList }] = await Promise.all([
        supabase.from("attendance").select("participant, session_no, attended").order("session_no"),
        supabase.from("config_sessions").select("session_no, number_label, title, session_date").order("sort_order"),
        supabase.from("config_participants").select("name").order("sort_order"),
      ]);

      const map: AttendanceMap = {};
      (pList || []).forEach((p: Participant) => { map[p.name] = {}; });
      (att ?? []).forEach((row: { participant: string; session_no: number; attended: boolean }) => {
        if (map[row.participant]) map[row.participant][row.session_no] = row.attended;
      });

      setAttendanceMap(map);
      setSessions((sess as SessionInfo[]) || []);
      const names = (pList || []).map((p: Participant) => p.name);
      setParticipants(names);
      if (names.length > 0) setSelectedName(names[0]);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedName || !todaySession) return;

    const alreadyMarked = attendanceMap[selectedName]?.[todaySession.session_no];
    if (alreadyMarked) {
      setSubmitResult("already");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("attendance").upsert(
      { participant: selectedName, session_no: todaySession.session_no, attended: true },
      { onConflict: "participant,session_no" }
    );

    if (error) {
      setSubmitResult("error");
    } else {
      setAttendanceMap(prev => ({
        ...prev,
        [selectedName]: { ...(prev[selectedName] || {}), [todaySession.session_no]: true },
      }));
      setSubmitResult("success");
    }
    setSubmitting(false);
    setTimeout(() => setSubmitResult(null), 5000);
  };

  const allSessionNos = Array.from({ length: Math.max(17, sessions.length) }, (_, i) => i + 1);
  const PAGE_SIZE = 16;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(participants.length / PAGE_SIZE);
  const pagedParticipants = participants.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (loading) {
    return <div className={styles.loading}>Memuat data absensi...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ClipboardList size={22} />
          Rekapitulasi Absensi Kehadiran
        </h2>
        <p>Hasil rekapan data kehadiran seluruh peserta program WebGIS Development Bootcamp MAPID Academy.</p>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {/* Attendance Form Card */}
        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Pengisian Absensi Kelas</span>
          <h3 className={styles.cardTitle}>Isi Kehadiran Sesi Sekarang</h3>

          {!todaySession ? (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "12px",
              background: "#fef9c3", border: "1px solid #fde047", borderRadius: "8px", padding: "12px" }}>
              <AlertCircle size={16} color="#ca8a04" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 13, color: "#713f12", lineHeight: 1.5 }}>
                Absensi tidak tersedia hari ini. Form absensi hanya bisa diisi pada hari jadwal sesi berlangsung.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
              {/* Session info badge */}
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "10px 12px" }}>
                <p style={{ margin: 0, fontSize: 12, color: "#1d4ed8", fontWeight: 700 }}>
                  {todaySession.number_label} — {todaySession.title}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "#3b82f6" }}>
                  {new Date(today).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Name dropdown */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Nama Peserta</label>
                <select value={selectedName} onChange={e => setSelectedName(e.target.value)} required
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: "1px solid #d1d5db", fontSize: 13, color: "#1e293b", background: "#fff", outline: "none" }}>
                  {participants.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Batch dropdown */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Batch yang Diikuti</label>
                <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} required
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: "1px solid #d1d5db", fontSize: 13, color: "#1e293b", background: "#fff", outline: "none" }}>
                  <option value="Batch 2">Batch 2</option>
                  <option value="Batch 3">Batch 3</option>
                </select>
              </div>

              {/* Sesi kehadiran (read-only, auto-detected) */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Sesi Kehadiran</label>
                <input value={`${todaySession.number_label} — ${todaySession.title}`} readOnly
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: "1px solid #e2e8f0", fontSize: 13, color: "#64748b", background: "#f8fafc", outline: "none" }} />
              </div>

              {/* Time input */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
                  <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
                  Waktu Absensi
                </label>
                <input type="time" value={checkInTime.replace(".", ":")} onChange={e => setCheckInTime(e.target.value)} required
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: "1px solid #d1d5db", fontSize: 13, color: "#1e293b", background: "#fff", outline: "none" }} />
              </div>

              {/* Submit feedback */}
              {submitResult === "success" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px",
                  background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "10px 12px" }}>
                  <CheckCircle size={16} color="#16a34a" />
                  <span style={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    Absensi berhasil dicatat!
                  </span>
                </div>
              )}
              {submitResult === "already" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px",
                  background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "8px", padding: "10px 12px" }}>
                  <AlertCircle size={16} color="#d97706" />
                  <span style={{ fontSize: 13, color: "#92400e" }}>
                    {selectedName} sudah mengisi absensi sesi ini.
                  </span>
                </div>
              )}
              {submitResult === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px",
                  background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 12px" }}>
                  <AlertCircle size={16} color="#dc2626" />
                  <span style={{ fontSize: 13, color: "#991b1b" }}>Terjadi kesalahan. Coba lagi.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !selectedName}
                className={styles.fillAttendanceBtn}
                style={{ marginTop: 0, opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "Menyimpan..." : "Isi Absensi Sekarang"}
              </button>
            </form>
          )}
        </div>

        <div className={`${styles.summaryCard} ${styles.infoCard}`}>
          <div className={styles.infoCardHeader}>
            <Lightbulb size={18} className={styles.infoIcon} />
            <h3>Aspek Penilaian Keaktifan</h3>
          </div>
          <p className={styles.statusDesc}>
            Absensi kehadiran sangat penting karena akan menjadi aspek penilaian utama untuk keaktifan peserta selama mengikuti program WebGIS Development Bootcamp MAPID Academy. Pastikan Anda mengisi kehadiran setiap sesi.
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Checklist Rekapitulasi Kehadiran Peserta</h3>
          <p>Daftar lengkap absensi per pertemuan yang dihimpun dari pengisian presensi peserta harian.</p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.attendanceTable}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>Peserta</th>
                {allSessionNos.map(i => (
                  <th key={i}>Sesi {i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedParticipants.map(name => (
                <tr key={name}>
                  <td className={styles.stickyCol}><span>{name}</span></td>
                  {allSessionNos.map(sessionNo => {
                    const isPresent = !!(attendanceMap[name]?.[sessionNo]);
                    return (
                      <td key={sessionNo} style={{ textAlign: "center" }}>
                        {isPresent
                          ? <span className={styles.presentBadge}>✓</span>
                          : <span className={styles.absentBadge}>-</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
