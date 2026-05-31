"use client";

import { useState, useEffect } from "react";
import { FolderOpen, BarChart2, Plus, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { TaskSubmissionRow } from "@/lib/supabase";
import styles from "./TaskMonitoring.module.css";

interface TaskItem { task_order: number; number: string; title: string; }

export default function TaskMonitoring() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [taskList, setTaskList]         = useState<TaskItem[]>([]);
  const [selectedName, setSelectedName] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [inputUrl, setInputUrl]         = useState("");
  const [submissions, setSubmissions]   = useState<TaskSubmissionRow[]>([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
        supabase.from("config_participants").select("name").order("sort_order"),
        supabase.from("config_tasks").select("task_order,number,title").order("task_order"),
        supabase.from("task_submissions").select("participant,task_id,task_number,task_title,url,submitted_at").order("submitted_at"),
      ]);
      const names = (p || []).map((x: { name: string }) => x.name);
      const tasks = (t as TaskItem[]) || [];
      setParticipants(names);
      setTaskList(tasks);
      if (tasks.length) setSelectedOrder(tasks[0].task_order);
      const saved = localStorage.getItem("mapid_active_username");
      if (saved && names.includes(saved)) setSelectedName(saved);
      else if (names.length) setSelectedName(names[0]);
      setSubmissions((s as TaskSubmissionRow[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || submitting) return;
    setSubmitting(true);
    const task = taskList.find(t => t.task_order === selectedOrder)!;
    const entry: TaskSubmissionRow = {
      participant: selectedName,
      task_id: selectedOrder,
      task_number: task.number,
      task_title: task.title,
      url: inputUrl.trim(),
    };
    const { error } = await supabase.from("task_submissions").insert(entry);
    if (!error) {
      setSubmissions(prev => [...prev, entry]);
      localStorage.setItem("mapid_active_username", selectedName);
      setInputUrl("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
    setSubmitting(false);
  };

  const checklistMap: Record<string, Set<number>> = {};
  participants.forEach(p => { checklistMap[p] = new Set(); });
  submissions.forEach(s => {
    if (checklistMap[s.participant]) checklistMap[s.participant].add(s.task_id);
  });

  if (loading) return <div className={styles.loading}>Memuat data tugas...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FolderOpen size={22} /> Monitoring Tugas
        </h2>
        <p>Kumpulkan link tugas WebGIS Batch 3 dan pantau rekapitulasi pengumpulan seluruh peserta.</p>
      </div>

      {/* Submission Form */}
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>
          <span className={styles.formTag}>KIRIM TUGAS</span>
          <h3>Form Pengumpulan Tugas</h3>
          <p className={styles.formDesc}>Pilih nama, pilih tugas, dan masukkan link GitHub hasil kerjamu.</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.submitForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>NAMA PESERTA</label>
              <select value={selectedName} onChange={e => setSelectedName(e.target.value)} className={styles.formSelect}>
                {participants.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>PILIH TUGAS</label>
              <select value={selectedOrder} onChange={e => setSelectedOrder(Number(e.target.value))} className={styles.formSelect}>
                {taskList.map(t => <option key={t.task_order} value={t.task_order}>{t.number} — {t.title}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>LINK PENGUMPULAN (GITHUB)</label>
            <input type="url" required placeholder="https://github.com/username/nama-repo" value={inputUrl} onChange={e => setInputUrl(e.target.value)} className={styles.formInput} />
          </div>
          <button type="submit" disabled={submitting} className={styles.submitBtn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: submitting ? 0.7 : 1 }}>
            <Plus size={15} /> {submitting ? "Mengirim..." : "Kirim Tugas"}
          </button>
          {submitSuccess && (
            <div className={styles.successBanner} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <CheckCircle size={15} /> Tugas berhasil dikirim!
            </div>
          )}
        </form>
      </div>

      {/* Rekapitulasi */}
      <div className={styles.databaseCard}>
        <div className={styles.databaseHeader}>
          <div>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BarChart2 size={18} /> Rekapitulasi Pengumpulan Tugas
            </h3>
            <p className={styles.dbSubtitle}>Checklist pengumpulan tugas seluruh peserta kelas WebGIS Batch 3.</p>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.gridTable}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>Nama Peserta</th>
                {taskList.map((t, i) => <th key={t.task_order} className={styles.taskHeader}>T{i + 1}</th>)}
                <th className={styles.taskHeader}>Total</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(name => {
                const submitted = checklistMap[name];
                const total = submitted.size;
                return (
                  <tr key={name}>
                    <td className={styles.stickyCol}><strong>{name}</strong></td>
                    {taskList.map(t => (
                      <td key={t.task_order} style={{ textAlign: "center" }}>
                        {submitted.has(t.task_order)
                          ? <span className={styles.checkBadge}>✓</span>
                          : <span className={styles.dashBadge}>-</span>}
                      </td>
                    ))}
                    <td style={{ textAlign: "center" }}>
                      <span className={styles.totalBadge}>{total}/{taskList.length}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
