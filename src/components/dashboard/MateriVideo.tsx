"use client";

import { BookOpen, PlayCircle, ExternalLink } from "lucide-react";
import styles from "./MateriVideo.module.css";

const GITHUB_URL  = "https://github.com/mapid-academy/webgis-bootcamp-batch3";
const YOUTUBE_URL = "https://www.youtube.com/@mapid_official";

export default function MateriVideo() {
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
            <p>Seluruh modul materi coding setiap sesi tersedia di repositori GitHub MAPID Academy. Akses langsung untuk referensi dan pengerjaan tugas.</p>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.linkBtnGithub}`}>
              <ExternalLink size={15} /> Buka GitHub Materi
            </a>
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
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className={`${styles.linkBtn} ${styles.linkBtnYoutube}`}>
              <PlayCircle size={15} /> Buka YouTube Playlist
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
