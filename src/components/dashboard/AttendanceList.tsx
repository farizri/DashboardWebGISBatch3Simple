"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./AttendanceList.module.css";

const PARTICIPANTS = [
  "Kalvin Reza Pratama",
  "Rafi Fistra Ali",
  "Binar Aulia Setyawan",
  "Athirah Hamzah",
  "Azya Naurah Sumakhalda",
  "Robertho Kadji",
  "Rinjani Putri Djunaedi",
  "Rizki Amara Putri",
  "Muhammad Thariq Aziz",
  "Adinda Dwi Yulianto",
];

// attendanceMap[participant][session_no] = attended
type AttendanceMap = Record<string, Record<number, boolean>>;

export default function AttendanceList() {
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      const { data, error } = await supabase
        .from("attendance")
        .select("participant, session_no, attended")
        .order("session_no");

      if (error) {
        console.error("Error fetching attendance:", error);
        setLoading(false);
        return;
      }

      const map: AttendanceMap = {};
      PARTICIPANTS.forEach((p) => { map[p] = {}; });
      (data ?? []).forEach((row) => {
        if (map[row.participant]) {
          map[row.participant][row.session_no] = row.attended;
        }
      });
      setAttendanceMap(map);
      setLoading(false);
    }

    fetchAttendance();
  }, []);

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
        <div className={styles.summaryCard}>
          <span className={styles.cardLabel}>Pengisian Absensi Kelas</span>
          <h3 className={styles.cardTitle}>Isi Kehadiran Sesi Sekarang</h3>
          <p className={styles.cardDesc}>
            Silakan klik tautan tombol di bawah ini untuk mengisi absensi kehadiran kelas hari ini melalui formulir resmi MAPID Academy.
          </p>
          <a
            href="https://forms.gle/mapid-academy-attendance"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fillAttendanceBtn}
          >
            Isi Absensi Sekarang
          </a>
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

      {/* Attendance Table Card */}
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
                {Array.from({ length: 17 }).map((_, i) => (
                  <th key={i}>Sesi {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PARTICIPANTS.map((name) => (
                <tr key={name}>
                  <td className={styles.stickyCol}>
                    <span>{name}</span>
                  </td>
                  {Array.from({ length: 17 }).map((_, i) => {
                    const sessionNo = i + 1;
                    const isPresent = !!(attendanceMap[name]?.[sessionNo]);
                    return (
                      <td key={i} style={{ textAlign: "center" }}>
                        {isPresent ? (
                          <span className={styles.presentBadge}>✓</span>
                        ) : (
                          <span className={styles.absentBadge}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
