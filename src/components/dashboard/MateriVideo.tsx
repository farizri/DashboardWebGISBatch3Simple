"use client";

import { useState, useEffect } from "react";
import { BookOpen, PlayCircle, ExternalLink } from "lucide-react";
import styles from "./MateriVideo.module.css";
import { supabase } from "../../lib/supabase";

export default function MateriVideo() {
  const [materiUrl, setMateriUrl] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");

  useEffect(() => {
    supabase
      .from("site_config")
      .select("key,value")
      .in("key", ["materi_link", "playlist_link"])
      .then(({ data }) => {
        (data || []).forEach((r: { key: string; value: string }) => {
          if (r.key === "materi_link") setMateriUrl(r.value);
          if (r.key === "playlist_link") setPlaylistUrl(r.value);
        });
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2><BookOpen size={20} /> Materi &amp; Video Rekaman</h2>
        <p>Akses materi dan rekaman video setiap pertemuan kelas WebGIS Batch 3.</p>
      </div>

      <div className={styles.cardsRow}>

        {/* Card 1 — Materials */}
        <div className={styles.card}>
          <div className={`${styles.cardBg} ${styles.cardBgMaterial}`}>
            <div className={styles.cardBadgeYear}>2026</div>
            <div className={styles.cardTagLine}>
              <span className={styles.cardTag}>Code the Map</span>
              <span className={styles.cardTagBold}>Decode the Future</span>
            </div>
            <div className={styles.cardBrand}>
              <span className={styles.brandMapid}>MAPID</span>
              <span className={styles.brandAcademy}>Academy</span>
            </div>
            <div className={styles.cardPill}>
              <span className={styles.pillBold}>WebGIS</span> Development Bootcamp
            </div>
            <div className={styles.cardType}>Materials</div>
            <div className={styles.cardDecorCircle} />
            <div className={styles.cardDecorDots} />
          </div>
          <div className={styles.cardBody}>
            <p>Seluruh modul materi coding setiap sesi tersedia di repositori MAPID Academy. Akses langsung untuk referensi dan pengerjaan tugas.</p>
            {materiUrl ? (
              <a href={materiUrl} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.linkBtnGithub}`}>
                <ExternalLink size={15} /> Buka Materi
              </a>
            ) : (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Link belum tersedia</span>
            )}
          </div>
        </div>

        {/* Card 2 — Playback */}
        <div className={styles.card}>
          <div className={`${styles.cardBg} ${styles.cardBgPlayback}`}>
            <div className={styles.cardBadgeYear}>2026</div>
            <div className={styles.cardTagLine}>
              <span className={styles.cardTag}>Code the Map</span>
              <span className={styles.cardTagBold}>Decode the Future</span>
            </div>
            <div className={styles.cardBrand}>
              <span className={styles.brandMapid}>MAPID</span>
              <span className={styles.brandAcademy}>Academy</span>
            </div>
            <div className={styles.cardPill}>
              <span className={styles.pillBold}>WebGIS</span> Development Bootcamp
            </div>
            <div className={styles.cardType}>Playback</div>
            <div className={styles.cardDecorCircle} />
            <div className={styles.cardDecorDots} />
          </div>
          <div className={styles.cardBody}>
            <p>Rekaman video setiap sesi live class tersedia di YouTube Playlist MAPID Academy. Tonton ulang kapan saja sesuai kebutuhanmu.</p>
            {playlistUrl ? (
              <a href={playlistUrl} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.linkBtnYoutube}`}>
                <PlayCircle size={15} /> Buka YouTube Playlist
              </a>
            ) : (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Link belum tersedia</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
