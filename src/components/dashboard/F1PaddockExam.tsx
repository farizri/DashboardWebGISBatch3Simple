"use client";

import { useState, useEffect, useCallback } from "react";
import { sfx } from "../../lib/sound";
import { supabase } from "../../lib/supabase";
import {
  Globe, Trophy, Play,
  Home, Star, ThumbsUp, Target, AlertTriangle, BarChart2,
} from "lucide-react";
import styles from "./F1PaddockQuiz.module.css";

interface ExamQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

export default function F1PaddockExam() {
  const [participants, setParticipants] = useState<{ name: string; email: string }[]>([]);
  const [selectedUser, setSelectedUser]  = useState<string>("");
  const [examState, setExamState]        = useState<"LOBBY" | "PLAYING" | "RESULT">("LOBBY");
  const [loading, setLoading]            = useState(true);

  // Recap state — hanya checklist siapa yang sudah mengerjakan, skor dilihat di admin panel
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [recapPage, setRecapPage]       = useState(0);

  const [questions, setQuestions]       = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx]     = useState<number>(0);
  const [selectedAns, setSelectedAns]   = useState<number | null>(null);
  const [isAnswered, setIsAnswered]     = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<("CORRECT" | "INCORRECT" | "UNANSWERED")[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [finalScore, setFinalScore]     = useState<number>(0);

  useEffect(() => {
    async function load() {
      const [{ data: pList }, { data: scores }] = await Promise.all([
        supabase.from("config_participants").select("name,email").order("sort_order"),
        supabase.from("exam_scores").select("participant"),
      ]);

      const list = (pList || []) as { name: string; email: string }[];
      setParticipants(list);
      const savedName = localStorage.getItem("mapid_active_username");
      const found = list.find(p => p.name === savedName);
      if (found) {
        setSelectedUser(found.name);
      } else if (list.length > 0) {
        setSelectedUser(list[0].name);
        localStorage.setItem("mapid_active_username", list[0].name);
        localStorage.setItem("mapid_active_useremail", list[0].email || "");
      }

      const done = new Set<string>();
      (scores || []).forEach((r: { participant: string }) => done.add(r.participant));
      setCompletedSet(done);
      setLoading(false);
    }
    load();
  }, []);

  const handleUserChange = (name: string) => {
    setSelectedUser(name);
    localStorage.setItem("mapid_active_username", name);
    const found = participants.find(p => p.name === name);
    localStorage.setItem("mapid_active_useremail", found?.email || "peserta@mapid.co.id");
    window.dispatchEvent(new Event("storage"));
  };

  const submitAndNext = useCallback(async () => {
    if (isAnswered || selectedAns === null) return;
    setIsAnswered(true);

    const currentQuestion = questions[currentIdx];
    if (!currentQuestion) return;
    const isCorrect = selectedAns === currentQuestion.correctAnswer;

    const newStatus = [...answersStatus];
    newStatus[currentIdx] = isCorrect ? "CORRECT" : "INCORRECT";
    setAnswersStatus(newStatus);

    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) { sfx.playCorrect(); setCorrectCount(newCorrectCount); }
    else { sfx.playIncorrect(); }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      const computedScore = Math.round((newCorrectCount / questions.length) * 100);
      setFinalScore(computedScore);

      const activeUserName = localStorage.getItem("mapid_active_username") || "";
      const activeEmail    = localStorage.getItem("mapid_active_useremail") || "";
      await supabase.from("exam_scores").insert({
        participant: activeUserName, email: activeEmail,
        score: computedScore, attempt_no: 1,
      });

      sfx.playSuccess();
      setCompletedSet(prev => new Set(prev).add(activeUserName));
      setExamState("RESULT");
    }
  }, [isAnswered, selectedAns, questions, currentIdx, answersStatus, correctCount]);

  const startExam = async () => {
    const currentActiveName  = localStorage.getItem("mapid_active_username") || "";
    const currentActiveEmail = localStorage.getItem("mapid_active_useremail") || "";
    localStorage.setItem("mapid_active_username",  currentActiveName);
    localStorage.setItem("mapid_active_useremail", currentActiveEmail);

    if (completedSet.has(currentActiveName)) {
      alert("Anda sudah pernah mengerjakan Exam ini. Exam hanya bisa dikerjakan satu kali.");
      return;
    }

    const { data: dbQuestions } = await supabase
      .from("exam_questions")
      .select("question_text, options, correct_answer, image_url")
      .order("sort_order");

    if (!dbQuestions || dbQuestions.length === 0) {
      alert("Soal exam belum tersedia!");
      return;
    }

    const mapped: ExamQuestion[] = dbQuestions.map((q: {
      question_text: string; options: string[]; correct_answer: number; image_url: string;
    }) => ({
      question: q.question_text,
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correct_answer,
      image: q.image_url || undefined,
    }));

    setQuestions(mapped);
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setFinalScore(0);
    setAnswersStatus(Array(mapped.length).fill("UNANSWERED"));
    setExamState("PLAYING");
  };

  const handleAnswerSelect = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedAns(optIdx);
  };

  const returnToLobby = () => {
    setExamState("LOBBY");
  };

  const totalQ = questions.length || 25;

  const RECAP_PAGE_SIZE = 16;
  const recapTotalPages = Math.ceil(participants.length / RECAP_PAGE_SIZE);
  const recapPaged = participants.slice(recapPage * RECAP_PAGE_SIZE, (recapPage + 1) * RECAP_PAGE_SIZE);

  const alreadyAttempted = completedSet.has(selectedUser);

  const scoreEmoji =
    finalScore === 100 ? <Trophy size={52} color="#f59e0b" /> :
    finalScore >= 80   ? <Star    size={52} color="#22c55e" /> :
    finalScore >= 60   ? <ThumbsUp size={52} color="#84cc16" /> :
                    <Target  size={52} color="#f97316" />;
  const scoreColor =
    finalScore === 100 ? "#16a34a" : finalScore >= 80 ? "#22c55e" : finalScore >= 70 ? "#84cc16" :
    finalScore >= 60 ? "#eab308" : finalScore >= 50 ? "#f97316" : "#ef4444";
  const scoreMessage =
    finalScore === 100 ? "Luar biasa! Anda sudah sangat siap mengerjakan Final Project." :
    finalScore >= 80   ? "Bagus, keren! Anda sudah cukup siap mengerjakan Final Project." :
    finalScore >= 60   ? "Siap! Pastikan review kembali materi yang masih kurang sebelum mengerjakan Final Project." :
    "Yuk pelajari kembali materi dari awal sebelum mengerjakan Final Project agar hasilnya maksimal.";

  if (loading) {
    return <div className={styles.container}><p style={{ padding: 24 }}>Memuat data exam...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Globe size={22} /> Exam WebGIS Academy
        </h2>
        <p>Ujian wajib sebelum mengumpulkan Final Project — pastikan Anda sudah menguasai seluruh materi.</p>
      </div>

      {examState === "LOBBY" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Warning */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px",
            background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "10px", padding: "14px 16px" }}>
            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Perhatian:</strong> Exam ini wajib dikerjakan sebelum Anda mengumpulkan Final Project, dan hanya bisa dikerjakan <strong>satu kali</strong>. Pastikan Anda benar-benar siap sebelum memulai!
            </p>
          </div>

          <div className={styles.lobbyCard}>
            <span className={styles.f1Tag}>EXAM WEBGIS</span>
            <h3>Mulai Exam</h3>
            <p className={styles.lobbyDesc}>
              Exam berisi soal pilihan ganda yang menguji pemahaman Anda atas seluruh materi WebGIS bootcamp, sebagai syarat sebelum mengerjakan Final Project.
            </p>

            <div className={styles.sessionSelectorWrapper} style={{ marginBottom: "16px" }}>
              <label htmlFor="user-select">PILIH NAMA ANDA (PESERTA):</label>
              <select id="user-select" value={selectedUser} onChange={e => handleUserChange(e.target.value)} className={styles.sessionSelect}>
                {participants.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
            </div>

            {alreadyAttempted ? (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px",
                background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 14px" }}>
                <AlertTriangle size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 12.5, color: "#166534", lineHeight: 1.5 }}>
                  <strong>{selectedUser}</strong> sudah menyelesaikan Exam ini. Exam hanya bisa dikerjakan satu kali dan tidak dapat diulang.
                </p>
              </div>
            ) : (
              <button onClick={startExam} disabled={!selectedUser}
                className={styles.launchBtn}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Play size={14} /> MULAI EXAM
              </button>
            )}
          </div>

          {/* Recap */}
          {participants.length > 0 && (
            <div className={styles.databaseCard}>
              <div className={styles.databaseHeaderContainer}>
                <div className={styles.databaseTitleGroup}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart2 size={17} /> Checklist Pengerjaan Exam
                  </h3>
                  <p className={styles.databaseSubtitle}>Checklist peserta yang sudah mengerjakan exam.</p>
                </div>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.gridTable}>
                  <thead>
                    <tr>
                      <th className={styles.stickyCol}>Nama Peserta</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recapPaged.map(p => (
                      <tr key={p.name}>
                        <td className={styles.stickyCol}><strong>{p.name}</strong></td>
                        <td style={{ textAlign: "center" }}>
                          {completedSet.has(p.name)
                            ? <span className={styles.gridScoreChecked}>✓</span>
                            : <span className={styles.gridScoreDash}>-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {recapTotalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "16px 0 4px" }}>
                  <button onClick={() => setRecapPage(p => Math.max(0, p - 1))} disabled={recapPage === 0}
                    style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: recapPage === 0 ? "#f8fafc" : "#fff", color: recapPage === 0 ? "#cbd5e1" : "#334155", cursor: recapPage === 0 ? "not-allowed" : "pointer", fontSize: 13 }}>
                    ← Prev
                  </button>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{recapPage + 1} / {recapTotalPages}</span>
                  <button onClick={() => setRecapPage(p => Math.min(recapTotalPages - 1, p + 1))} disabled={recapPage === recapTotalPages - 1}
                    style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", background: recapPage === recapTotalPages - 1 ? "#f8fafc" : "#fff", color: recapPage === recapTotalPages - 1 ? "#cbd5e1" : "#334155", cursor: recapPage === recapTotalPages - 1 ? "not-allowed" : "pointer", fontSize: 13 }}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {examState === "PLAYING" && questions.length > 0 && (
        <div className={styles.gameContainer}>
          <div className={styles.mainGameArea}>
            <div className={styles.questionPanel}>
              <div className={styles.questionHeader}>
                <span className={styles.lapCount}>SOAL NOMOR {currentIdx + 1}/{totalQ}</span>
              </div>
              <h3 className={styles.questionText}>{questions[currentIdx].question}</h3>
              {questions[currentIdx].image && (
                <div className={styles.questionImageWrapper}>
                  <img src={questions[currentIdx].image} alt="Gambar soal" className={styles.questionImage} />
                </div>
              )}
              <div className={styles.optionsList}>
                {questions[currentIdx].options.map((option, idx) => {
                  let optStyle = styles.optionBtn;
                  if (selectedAns === idx) optStyle += ` ${styles.optionSelected}`;
                  if (isAnswered && selectedAns !== idx) optStyle += ` ${styles.optionDisabled}`;
                  return (
                    <button key={idx} onClick={() => handleAnswerSelect(idx)} disabled={isAnswered} className={optStyle}>
                      <span className={styles.optLetter}>{String.fromCharCode(65 + idx)}</span>
                      <span className={styles.optText}>{option}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={submitAndNext} disabled={selectedAns === null || isAnswered} className={styles.submitAnsBtn}>
                KIRIM &amp; LANJUT SOAL BERIKUTNYA ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {examState === "RESULT" && (
        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <div className={styles.resultCardTop}>
              <div>
                <span className={styles.f1Tag}>EXAM SELESAI</span>
                <h3 className={styles.resultTitle}>Hasil Exam</h3>
              </div>
              <span className={styles.resultBigEmoji}>{scoreEmoji}</span>
            </div>
            <div className={styles.resultScoreRow}>
              <div className={styles.resultScoreBox} style={{ borderColor: scoreColor }}>
                <span className={styles.resultScoreLabel}>SKOR PEROLEHAN</span>
                <span className={styles.resultScoreVal} style={{ color: scoreColor }}>
                  {finalScore}<span className={styles.resultScoreMax}> / 100</span>
                </span>
              </div>
              <div className={styles.resultMessageBox}>
                <p className={styles.resultMessage} style={{ color: scoreColor }}>{scoreMessage}</p>
              </div>
            </div>
            <button onClick={returnToLobby} className={styles.resultBackBtn}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Home size={15} /> Kembali ke Lobby Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
