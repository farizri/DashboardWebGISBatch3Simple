"use client";

import React, { useState } from "react";
import { Wrench, List, Copy, Check, ChevronUp, ChevronDown } from "lucide-react";
import styles from "./PlatformSoftware.module.css";

interface SoftwareItem {
  id: string;
  name: string;
  version: string;
  icon: string;
  desc: string;
  guideSteps: string[];
  testCommand?: string;
  downloadUrl: string;
}

const LOGOS: Record<string, React.ReactElement> = {
  qgis: (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="#589632" aria-hidden="true">
      <path d="M12.879 13.006v3.65l-3.004-3.048v-3.495h3.582l2.852 2.893h-3.43zm10.886 7.606V24h-3.654l-5.73-5.9v-3.55h3.354l6.03 6.062zm-10.828-1.448l3.372 3.371c-1.309.442-2.557.726-4.325.726C5.136 23.26 0 18.243 0 11.565 0 4.92 5.136 0 11.984 0 18.864 0 24 4.952 24 11.565c0 2.12-.523 4.076-1.457 5.759l-3.625-3.725a8.393 8.393 0 0 0 .24-2.005c0-4.291-3.148-7.527-7.1-7.527-3.954 0-7.248 3.236-7.248 7.527s3.33 7.6 7.247 7.6c.548 0 .661.017.88-.03z"/>
    </svg>
  ),
  vscode: (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="#007ACC" aria-hidden="true">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="#181717" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
};

const SOFTWARE_LIST: SoftwareItem[] = [
  {
    id: "qgis",
    name: "QGIS Desktop",
    version: "v3.28 LTR (atau terbaru)",
    icon: "🗺️",
    desc: "Aplikasi GIS desktop open-source untuk mengelola, menganalisis, mendigitasi, dan memformat data spasial vektor/raster.",
    guideSteps: [
      "Kunjungi situs resmi pengunduhan QGIS.",
      "Unduh installer 'QGIS LTR (Long Term Release)' sesuai sistem operasi Anda (Windows/macOS/Linux).",
      "Jalankan file installer dan selesaikan wizard instalasi dengan opsi default.",
      "Buka QGIS Desktop untuk memastikan aplikasi berjalan dengan baik."
    ],
    testCommand: "qgis --version",
    downloadUrl: "https://qgis.org/en/site/forusers/download.html"
  },
  {
    id: "vscode",
    name: "VS Code",
    version: "Terbaru",
    icon: "💻",
    desc: "Code editor andalan developer modern untuk menulis HTML, CSS, JavaScript, MapLibre, hingga script spasial Python.",
    guideSteps: [
      "Unduh VS Code installer untuk sistem operasi Anda.",
      "Lakukan instalasi dan centang opsi 'Add to PATH' (sangat penting untuk Windows).",
      "Pasang ekstensi: Live Server (oleh Ritwick Dey) dan Live Preview (oleh Microsoft)."
    ],
    testCommand: "code --version",
    downloadUrl: "https://code.visualstudio.com/"
  },
  {
    id: "git",
    name: "Git & GitHub",
    version: "Terbaru",
    icon: "🐙",
    desc: "Version Control System untuk melacak perubahan kode, manajemen repositori tugas, dan deploy portfolio WebGIS.",
    guideSteps: [
      "Unduh Git Installer sesuai sistem operasi Anda.",
      "Gunakan konfigurasi default saat instalasi, pastikan Git CLI aktif.",
      "Buat akun di github.com jika belum memilikinya.",
      "Gunakan Git Bash atau terminal pilihan Anda untuk menguji konfigurasi."
    ],
    testCommand: "git --version",
    downloadUrl: "https://git-scm.com/downloads"
  },
  {
    id: "geomapid",
    name: "GEO MAPID",
    version: "Platform Cloud Spasial",
    icon: "🌐",
    desc: "Platform cloud database spasial MAPID untuk digitasi data, manajemen layer GeoJSON, dan aktivasi REST API Endpoint peta.",
    guideSteps: [
      "Kunjungi platform GEO MAPID dan buat akun baru dengan email aktif Anda.",
      "Setelah mendaftar, masuk ke menu Redeem Code.",
      "Masukkan kode akses bootcamp: WGA262 untuk mengaktifkan akses penuh platform.",
      "Eksplorasi fitur digitasi, upload GeoJSON, dan aktifkan API Endpoint data spasial Anda."
    ],
    downloadUrl: "https://geo.mapid.io"
  }
];

export default function PlatformSoftware() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleOpen = (id: string) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Wrench size={22} />
          Platform & Panduan Software
        </h2>
        <p>Instalasi toolchain developer penting untuk menunjang kelancaran materi coding WebGIS Batch 3.</p>
      </div>

      <div className={styles.accordionList}>
        {SOFTWARE_LIST.map((software) => {
          const isOpen = openId === software.id;
          return (
            <div key={software.id} className={`${styles.accordionCard} ${isOpen ? styles.accordionOpen : ""}`}>
              {/* Header Row */}
              <button className={styles.accordionHeader} onClick={() => toggleOpen(software.id)}>
                <div className={styles.accordionLeft}>
                  <span className={styles.softwareIcon}>
                    {software.id === "geomapid" ? (
                      <svg viewBox="0 0 100 100" width="36" height="36">
                        <path d="M10,50 L75,5 L80,55 Z" fill="#3884c7" />
                        <path d="M10,50 L50,55 L62,85 Z" fill="#165da6" />
                        <path d="M50,55 L80,55 L86,90 L62,85 Z" fill="#94cb5a" />
                      </svg>
                    ) : (
                      LOGOS[software.id]
                    )}
                  </span>
                  <div>
                    <span className={styles.softwareName}>{software.name}</span>
                    <span className={styles.versionBadge}>{software.version}</span>
                  </div>
                </div>
                <div className={styles.accordionRight}>
                  <span className={styles.accordionDesc}>{software.desc}</span>
                  <span className={styles.chevron}>{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                </div>
              </button>

              {/* Expanded Guide */}
              {isOpen && (
                <div className={styles.accordionBody}>
                  <div className={styles.guideBox}>
                    <h4 style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <List size={15} />
                      Langkah Instalasi / Setup:
                    </h4>
                    <ol className={styles.stepsList}>
                      {software.guideSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {software.id === "geomapid" && (
                    <div className={styles.redeemBox}>
                      <span className={styles.redeemLabel}>KODE AKSES BOOTCAMP</span>
                      <div className={styles.redeemCode}>
                        <span className={styles.codeText}>WGA262</span>
                        <button
                          onClick={() => handleCopy("WGA262", "geomapid")}
                          className={styles.copyBtn}
                        >
                          {copiedId === "geomapid" ? <><Check size={12} /> Tersalin</> : <><Copy size={12} /> Salin</>}
                        </button>
                      </div>
                      <p className={styles.redeemNote}>Masukkan kode ini di menu Redeem Code setelah membuat akun GEO MAPID.</p>
                    </div>
                  )}

                  {software.testCommand && (
                    <div className={styles.terminalBox}>
                      <div className={styles.terminalHeader}>
                        <span>Terminal Test Command</span>
                        <button
                          onClick={() => handleCopy(software.testCommand!, software.id)}
                          className={styles.copyBtn}
                        >
                          {copiedId === software.id ? <><Check size={12} /> Tersalin</> : <><Copy size={12} /> Salin</>}
                        </button>
                      </div>
                      <code>{software.testCommand}</code>
                    </div>
                  )}

                  <a
                    href={software.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadBtn}
                  >
                    {software.id === "geomapid" ? "Buka Platform GEO MAPID" : "Unduh Resminya"} <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
