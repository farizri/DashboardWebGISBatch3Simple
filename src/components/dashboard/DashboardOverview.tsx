"use client";

import Link from "next/link";
import { Layers, GraduationCap, UploadCloud } from "lucide-react";
import styles from "./DashboardOverview.module.css";

export default function DashboardOverview() {
  return (
    <div className={styles.container}>

      {/* ── Hero Card ─────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>mulai belajar dengan dashboard ini!</span>
            <span className={styles.hashtag}>#CodetheMapDecodetheFuture</span>
          </div>
          <h1 className={styles.title}>
            Selamat Datang di Dashboard{" "}
            <span className={styles.highlight}>MAPID Academy WebGIS Development Bootcamp Batch 3!</span>
          </h1>
          <p className={styles.subtitle}>
            Platform pembelajaran terpadu yang dirancang khusus untuk peserta WebGIS Development Bootcamp Batch 3. Pantau kehadiran, selesaikan evaluasi, dan kelola pengumpulan tugas secara terpusat guna mendukung capaian kompetensi WebGIS secara terstruktur dan terukur.
          </p>

          {/* Features inside hero */}
          <div className={styles.featureGrid}>
            <div className={styles.featureRow}>
              <div className={styles.featureIconBox}><Layers size={16} /></div>
              <div className={styles.featureText}>
                <strong>Sentralisasi Aset Belajar</strong>
                <span>Modul coding GitHub, rekaman video YouTube, link software, dan absensi diatur rapi di satu halaman.</span>
              </div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureIconBox}><GraduationCap size={16} /></div>
              <div className={styles.featureText}>
                <strong>Post Test WebGIS Akademik</strong>
                <span>Evaluasi spasial interaktif dengan 15 sesi kuis untuk memvalidasi pemahaman spasialmu.</span>
              </div>
            </div>
            <div className={styles.featureRow}>
              <div className={styles.featureIconBox}><UploadCloud size={16} /></div>
              <div className={styles.featureText}>
                <strong>Sistem Pengumpulan Tugas Mulus</strong>
                <span>Pengumpulan link tugas berbasis cloud yang instan, mempermudah pelacakan kemajuan portofolio.</span>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Link href="/?tab=schedule" className={`${styles.btn} ${styles.btnPrimary}`}>Lihat Jadwal Kelas</Link>
            <Link href="/?tab=quiz"     className={`${styles.btn} ${styles.btnSecondary}`}>Mulai Post Test</Link>
          </div>
        </div>

        <div className={styles.heroIllustration}>
          <svg viewBox="0 0 200 200" className={styles.geoSvg}>
            <circle cx="100" cy="100" r="80" className={styles.orbit1} />
            <circle cx="100" cy="100" r="50" className={styles.orbit2} />
            <polygon points="100,40 150,130 50,130" className={styles.facetPolygon} />
            <circle cx="100" cy="40"  r="8" className={styles.node} />
            <circle cx="150" cy="130" r="8" className={styles.node} />
            <circle cx="50"  cy="130" r="8" className={styles.node} />
            <circle cx="100" cy="100" r="12" className={styles.centerNode} />
          </svg>
        </div>
      </section>

    </div>
  );
}
