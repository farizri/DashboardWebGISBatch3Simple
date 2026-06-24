"use client";

import React, { useEffect, useState } from "react";
import { Users, MessageSquare, GraduationCap, Trophy, Rocket, CalendarCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./MentoringGroup.module.css";

interface GroupRow {
  group_number: number;
  mentor_name: string;
  participant_name: string;
}

interface GroupData {
  group_number: number;
  mentor_name: string;
  members: string[];
}

interface PhasePoint { Icon: React.ElementType; text: string; }
interface Phase {
  label: string; sublabel: string; color: string; bg: string; border: string;
  Icon: React.ElementType; start: Date; end: Date; points: PhasePoint[];
}

const PHASES: Phase[] = [
  {
    label: "Pra-Mentoring", sublabel: "24 Jun – 31 Jul 2026",
    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",
    Icon: MessageSquare,
    start: new Date("2026-06-24"), end: new Date("2026-07-31"),
    points: [
      { Icon: Users,          text: "Berdiskusi seputar tugas dan seputar WebGIS bersama anggota kelompokmu sebagai kelompok belajar. Diskusi tugas bersama mentor tetap tersedia di channel #diskusi- Discord yang didampingi fasilitator." },
      { Icon: MessageSquare,  text: "Mulai bertanya dan diskusi langsung ke mentormu via PC Discord jika ingin membahas WebGIS yang ingin kamu buat." },
    ],
  },
  {
    label: "Mentoring Aktif", sublabel: "1 Agu – 17 Agu 2026",
    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0",
    Icon: GraduationCap,
    start: new Date("2026-08-01"), end: new Date("2026-08-17"),
    points: [
      { Icon: CalendarCheck,  text: "Mentor mulai mendampingi kelompok masing-masing secara resmi mulai 1 Agustus 2026." },
      { Icon: GraduationCap,  text: "Sesi mentoring kelompok minimal 1 kali per minggu — jadwal disepakati bersama mentor." },
    ],
  },
  {
    label: "Penilaian Final Project", sublabel: "Minggu terakhir Agustus",
    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
    Icon: Trophy,
    start: new Date("2026-08-10"), end: new Date("2026-08-17"),
    points: [
      { Icon: Trophy,   text: "Mentor melakukan penilaian Final Project pada minggu terakhir program." },
      { Icon: Rocket,   text: "Pastikan WebGIS-mu sudah deployed dan siap dipresentasikan sebelum deadline." },
    ],
  },
];

const MENTOR_STYLES: Record<string, { accent: string; light: string; border: string; avatar: string }> = {
  "Raden Pranantya":   { accent: "#1d4ed8", light: "#eff6ff", border: "#bfdbfe", avatar: "RP" },
  "Rifqi Naufal":      { accent: "#b45309", light: "#fefce8", border: "#fde68a", avatar: "RN" },
  "Ahmad Zaenun Faiz": { accent: "#be185d", light: "#fdf2f8", border: "#f9a8d4", avatar: "AZ" },
};

function getActivePhaseIdx(): number {
  const now = new Date();
  if (now < new Date("2026-08-01")) return 0;
  if (now <= new Date("2026-08-17")) return 1;
  return 2;
}

export default function MentoringGroup() {
  const [groups, setGroups]               = useState<GroupData[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("config_groups")
        .select("group_number,mentor_name,participant_name")
        .order("group_number");

      const rows = (data as GroupRow[]) || [];
      const map = new Map<number, GroupData>();
      rows.forEach(r => {
        if (!map.has(r.group_number)) {
          map.set(r.group_number, { group_number: r.group_number, mentor_name: r.mentor_name, members: [] });
        }
        map.get(r.group_number)!.members.push(r.participant_name);
      });
      setGroups(Array.from(map.values()).sort((a, b) => a.group_number - b.group_number));
      setLoading(false);
    }
    load();
  }, []);

  const mentors = ["Raden Pranantya", "Rifqi Naufal", "Ahmad Zaenun Faiz"];
  const activePhaseIdx = getActivePhaseIdx();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2><Users size={22} style={{ display:"inline", verticalAlign:"middle", marginRight:8 }} />Kelompok Mentoring</h2>
        <p>Panduan arahan mentoring dan informasi kelompokmu di WebGIS Bootcamp Batch 3</p>
      </div>

      {/* Fase Timeline */}
      <div className={styles.phaseSection}>
        <div className={styles.sectionTitle}><CalendarCheck size={14} style={{ display:"inline", verticalAlign:"middle", marginRight:6 }} />Alur &amp; Periode Mentoring</div>
        <div className={styles.phaseTimeline}>
          {PHASES.map((p, i) => {
            const isActive = i === activePhaseIdx;
            const isPast   = i < activePhaseIdx;
            return (
              <div key={i} className={styles.phaseCard}
                style={{ background: p.bg, borderColor: p.border }}>
                <div className={styles.phaseTop}>
                  <div className={styles.phaseIconBox} style={{ background: p.color + "18" }}>
                    <p.Icon size={18} color={p.color} />
                  </div>
                  <div>
                    <div className={styles.phaseLabel} style={{ color: p.color }}>
                      {p.label}
                    </div>
                    <div className={styles.phaseSublabel}>{p.sublabel}</div>
                  </div>
                </div>
                <ul className={styles.phasePoints}>
                  {p.points.map((pt, j) => (
                    <li key={j}>
                      <pt.Icon size={14} color={p.color} className={styles.phasePointIcon} />
                      <span>{pt.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Semua Kelompok per Mentor */}
      {loading ? (
        <div className={styles.loading}>Memuat data kelompok...</div>
      ) : (
        <div className={styles.allGroupsSection}>
          <div className={styles.sectionTitle}><Users size={14} style={{ display:"inline", verticalAlign:"middle", marginRight:6 }} />Semua Kelompok Mentoring</div>
          {mentors.map(mentor => {
            const ms = MENTOR_STYLES[mentor] || MENTOR_STYLES["Mas Raden"];
            const mentorGroups = groups.filter(g => g.mentor_name === mentor);
            if (mentorGroups.length === 0) return null;
            return (
              <div key={mentor} className={styles.mentorBlock} style={{ borderColor: ms.border }}>
                <div className={styles.mentorHeader} style={{ background: ms.light }}>
                  <div className={styles.mentorAvatar} style={{ background: ms.accent }}>{ms.avatar}</div>
                  <div>
                    <div className={styles.mentorName} style={{ color: ms.accent }}>{mentor}</div>
                    <div className={styles.mentorMeta}>{mentorGroups.length} kelompok · {mentorGroups.reduce((a, g) => a + g.members.length, 0)} peserta</div>
                  </div>
                </div>
                <div className={styles.mentorGroups}>
                  {mentorGroups.map(group => {
                    const isOpen = expandedGroup === group.group_number;
                    return (
                      <div key={group.group_number} className={styles.groupRow}>
                        <button className={styles.groupToggle}
                          onClick={() => setExpandedGroup(isOpen ? null : group.group_number)}>
                          <span className={styles.groupNum} style={{ background: ms.accent }}>
                            Kelompok {group.group_number}
                          </span>
                          <span className={styles.groupCount}>{group.members.length} peserta</span>
                          <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
                        </button>
                        {isOpen && (
                          <div className={styles.memberList}>
                            {group.members.map((name, idx) => (
                              <div key={idx} className={styles.memberRow}>
                                <span className={styles.memberNum}>{idx + 1}</span>
                                <span style={{ color: "#334155" }}>{name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
