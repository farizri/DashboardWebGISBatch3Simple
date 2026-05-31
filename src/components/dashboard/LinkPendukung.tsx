"use client";

import { ExternalLink, Link2 } from "lucide-react";
import styles from "./LinkPendukung.module.css";

const LINKS = [
  {
    no: 1,
    desc: "Link Discord",
    url: "https://discord.gg/ExtsnzAm",
  },
  {
    no: 2,
    desc: "Virtual Background MAPID Academy Development Bootcamp",
    url: "https://drive.google.com/file/d/1MLTl6-V9O1daqE4tIHKzQwN7vS93i84b/view?usp=sharing",
  },
  {
    no: 3,
    desc: "Guideline for Final Project",
    url: "https://www.canva.com/design/DAG1G1pqIW4/yQHiCzJJDDgG1SljerKq2A/view?utm_content=DAG1G1pqIW4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h5fd6349262",
  },
  {
    no: 4,
    desc: "Referensi Final Project",
    url: "https://docs.google.com/spreadsheets/d/1zmQY6Ea_Od8TYLFqBqnjLihSCljufE3WVXiYbEaeHe8/edit?gid=0#gid=0",
  },
  {
    no: 5,
    desc: "Template Dokumentasi Final Project",
    url: "https://docs.google.com/document/d/1qWdFr_LlQK3MgXb8TTLARQwsBa6MLNwD/edit?usp=sharing&ouid=111544367470827883560&rtpof=true&sd=true",
  },
];

export default function LinkPendukung() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2><Link2 size={20} /> Link Pendukung</h2>
        <p>Kumpulan tautan tambahan yang dibutuhkan selama mengikuti WebGIS Development Bootcamp Batch 3. Ketik link pada kolom tautan untuk mengakses sumber daya yang tersedia.</p>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thNo}>No</th>
              <th>Deskripsi</th>
              <th className={styles.thLink}>Link Penting</th>
            </tr>
          </thead>
          <tbody>
            {LINKS.map((item) => (
              <tr key={item.no}>
                <td className={styles.tdNo}>{item.no}</td>
                <td className={styles.tdDesc}>{item.desc}</td>
                <td className={styles.tdLink}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    <ExternalLink size={13} /> Buka Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
