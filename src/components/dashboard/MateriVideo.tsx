"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, Video, FolderOpen, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { MateriRow } from "@/lib/supabase";
import styles from "./MateriVideo.module.css";

const CATEGORY_COLOR: Record<string, string> = {
  Concept: "#3b82f6",
  Frontend: "#8b5cf6",
  WebMap: "#22c55e",
  Python: "#f59e0b",
};

export default function MateriVideo() {
  const [materiList, setMateriList] = useState<MateriRow[]>([]);
  const [filter, setFilter] = useState<"All" | "Concept" | "Frontend" | "WebMap" | "Python">("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("academy_config_materi")
        .select("*")
        .order("session_no");

      if (data) {
        const parsed = (data as MateriRow[]).map((m) => ({
          ...m,
          topics: Array.isArray(m.topics) ? m.topics : [],
        }));
        setMateriList(parsed);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredMateri = materiList.filter((m) =>
    filter === "All" ? true : m.category === filter
  );

  if (loading) {
    return (
      <div className={styles.container} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FolderOpen size={22} />
          Materi &amp; Video Rekaman
        </h2>
        <p>Akses materi GitHub dan video rekaman pertemuan live Zoom/Discord kelas WebGIS Batch 3.</p>

        <div className={styles.filterBar}>
          {(["All", "Concept", "Frontend", "WebMap", "Python"] as const).map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.activeFilter : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "All" ? "Semua Modul" : cat === "Concept" ? "GIS Konseptual" : cat === "Frontend" ? "Web Frontend" : cat === "WebMap" ? "Interactive WebMap" : "Python GIS"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.materiGrid}>
        {filteredMateri.map((materi) => (
          <div key={materi.session_no} className={styles.card}>
            <div className={styles.thumbnailWrapper}>
              {materi.youtube_id ? (
                <Image
                   src={`https://img.youtube.com/vi/${materi.youtube_id}/hqdefault.jpg`}
                   alt={materi.title}
                   className={styles.thumbnail}
                   width={480}
                   height={360}
                   unoptimized
                />
              ) : (
                <div className={styles.thumbnailPlaceholder} />
              )}
              <div className={styles.thumbnailOverlay}>
                <span
                  className={styles.categoryPill}
                  style={{ background: CATEGORY_COLOR[materi.category] || "#6366f1" }}
                >
                  {materi.category}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardMeta}>
                <span className={styles.sessionNum}>{materi.number_label}</span>
              </div>
              <h3 className={styles.cardTitle}>{materi.title}</h3>

              <div className={styles.topicsBox}>
                {materi.topics.map((topic: string, idx: number) => (
                  <span key={idx} className={styles.topicTag}>&bull; {topic}</span>
                ))}
              </div>

              <div className={styles.cardActions}>
                <a href={materi.materi_url} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                  <BookOpen size={13} /> Materi <span>&#x2197;</span>
                </a>
                <a href={materi.playlist_url} target="_blank" rel="noopener noreferrer" className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
                  <Video size={13} /> Tonton Rekaman
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
