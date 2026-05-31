"use client";

import { useState, useEffect, useCallback } from "react";
import { BOOTCAMP_QUIZZES, QuizQuestion } from "../../lib/quiz-data";
import { sfx } from "../../lib/sound";
import { supabase } from "../../lib/supabase";
import {
  Globe, Trophy, Play,
  Home, Star, ThumbsUp, Target, AlertTriangle,
} from "lucide-react";
import styles from "./F1PaddockQuiz.module.css";

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
  "Adinda Dwi Yulianto"
];

const PARTICIPANT_EMAILS: Record<string, string> = {
  "Kalvin Reza Pratama": "kalvin@gmail.com",
  "Rafi Fistra Ali": "rafi@gmail.com",
  "Binar Aulia Setyawan": "binar@gmail.com",
  "Athirah Hamzah": "athirah@gmail.com",
  "Azya Naurah Sumakhalda": "azya@gmail.com",
  "Robertho Kadji": "robertho@gmail.com",
  "Rinjani Putri Djunaedi": "rinjani@gmail.com",
  "Rizki Amara Putri": "rizki@gmail.com",
  "Muhammad Thariq Aziz": "thariq@gmail.com",
  "Adinda Dwi Yulianto": "adinda@gmail.com"
};

const QUIZ_SESSIONS_MAP = [
  "Sesi 1 & 2: Onboarding & Get to Know WebGIS",
  "Sesi 3: GIS Fundamental",
  "Sesi 4: Location Value with GEO MAPID",
  "Sesi 5: Introduction to VS Code, Git, HTML & CSS",
  "Sesi 6: HTML and CSS Part 2 — Tailwind & Layouting",
  "Sesi 7: JavaScript Part 1 — Fundamentals",
  "Sesi 8 & 9: JavaScript Part 2 & Modern JS — DOM & Async",
  "Sesi 10: Introduction to WebMap & MapLibre Part 1",
  "Sesi 11: Introduction to WebMap & MapLibre Part 2",
  "Sesi 12: Introduction to WebMap & MapLibre Part 3",
  "Sesi 13: Feature Implementation Part 1 — Heatmap",
  "Sesi 14: Feature Implementation Part 2 — Radius/Buffer",
  "Sesi 14: Feature Implementation Part 2 — Isochrone Analysis",
  "Sesi 15: WebGIS Code Refinement and Deployment",
  "Sesi 16 & 17: Python for Spatial Data & Automation (Bonus)"
];

export default function F1PaddockQuiz() {
  const [selectedSession, setSelectedSession] = useState<number>(1);
  const [selectedUser, setSelectedUser]       = useState<string>("Kalvin Reza Pratama");
  const [quizState, setQuizState]             = useState<"LOBBY" | "PLAYING" | "RESULT">("LOBBY");

  const [questions, setQuestions]       = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx]     = useState<number>(0);
  const [selectedAns, setSelectedAns]   = useState<number | null>(null);
  const [isAnswered, setIsAnswered]     = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<("CORRECT" | "INCORRECT" | "UNANSWERED")[]>([]);
  const [score, setScore]               = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedName = localStorage.getItem("mapid_active_username");
      if (savedName && PARTICIPANTS.includes(savedName)) {
        setSelectedUser(savedName);
      } else {
        localStorage.setItem("mapid_active_username", "Kalvin Reza Pratama");
        localStorage.setItem("mapid_active_useremail", "kalvin@gmail.com");
        setSelectedUser("Kalvin Reza Pratama");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleUserChange = (name: string) => {
    setSelectedUser(name);
    localStorage.setItem("mapid_active_username", name);
    const email = PARTICIPANT_EMAILS[name] || "peserta@mapid.co.id";
    localStorage.setItem("mapid_active_useremail", email);
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

    const newScore = score + (isCorrect ? 10 : 0);
    if (isCorrect) {
      sfx.playCorrect();
      setScore(newScore);
    } else {
      sfx.playIncorrect();
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      const savedScores = localStorage.getItem("mapid_quiz_scores") || "{}";
      try {
        const scoresObj = JSON.parse(savedScores);
        const prevScore = scoresObj[selectedSession] || 0;
        if (newScore > prevScore) {
          scoresObj[selectedSession] = newScore;
          localStorage.setItem("mapid_quiz_scores", JSON.stringify(scoresObj));
          window.dispatchEvent(new Event("storage"));
        }
      } catch (e) { console.error(e); }

      const activeUserName = localStorage.getItem("mapid_active_username") || "Kalvin Reza Pratama";
      const activeEmail    = localStorage.getItem("mapid_active_useremail") || "";
      const { data: prevAttempts } = await supabase
        .from("quiz_scores")
        .select("attempt_no")
        .eq("participant", activeUserName)
        .eq("session_key", selectedSession)
        .order("attempt_no", { ascending: false })
        .limit(1);
      const nextAttemptNo = prevAttempts && prevAttempts.length > 0 ? prevAttempts[0].attempt_no + 1 : 1;
      await supabase.from("quiz_scores").insert({
        participant: activeUserName,
        email: activeEmail,
        session_key: selectedSession,
        score: newScore,
        attempt_no: nextAttemptNo,
      });

      sfx.playSuccess();
      setQuizState("RESULT");
    }
  }, [isAnswered, selectedAns, questions, currentIdx, answersStatus, score, selectedSession]);

  const startQuiz = () => {
    const qList = BOOTCAMP_QUIZZES[selectedSession];
    if (!qList || qList.length === 0) {
      alert("Soal kuis untuk sesi ini belum tersedia!");
      return;
    }
    const currentActiveName  = localStorage.getItem("mapid_active_username")  || "Kalvin Reza Pratama";
    const currentActiveEmail = localStorage.getItem("mapid_active_useremail") || "kalvin@gmail.com";
    localStorage.setItem("mapid_active_username",  currentActiveName);
    localStorage.setItem("mapid_active_useremail", currentActiveEmail);

    setQuestions(qList);
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersStatus(Array(10).fill("UNANSWERED"));
    setQuizState("PLAYING");
  };

  const handleAnswerSelect = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedAns(optIdx);
  };

  const returnToLobby = () => setQuizState("LOBBY");

  const scoreEmoji =
    score === 100 ? <Trophy size={52} color="#f59e0b" /> :
    score >= 80   ? <Star    size={52} color="#22c55e" /> :
    score >= 60   ? <ThumbsUp size={52} color="#84cc16" /> :
                    <Target  size={52} color="#f97316" />;
  const scoreColor =
    score === 100 ? "#16a34a" :
    score >= 80   ? "#22c55e" :
    score >= 70   ? "#84cc16" :
    score >= 60   ? "#eab308" :
    score >= 50   ? "#f97316" : "#ef4444";
  const scoreMessage =
    score === 100
      ? "Wah, pemahaman Anda tinggi sekali! Luar biasa!"
      : score >= 80
      ? "Bagus, keren! Anda sudah menguasai materi ini dengan baik."
      : score >= 60
      ? "Siap! Terus pertahankan semangat belajarnya."
      : "Yuk usahakan lebih baik di asesmen selanjutnya. Pelajari kembali materinya dengan giat dan jangan ragu tanyakan ke mentor ya!";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Globe size={22} />
          Post Test WebGIS Academy
        </h2>
        <p>Uji pemahaman spasial Anda dengan modul kuis evaluasi kelas WebGIS &amp; geospasial profesional.</p>
      </div>

      {quizState === "LOBBY" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Warning */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: "12px",
            background: "#fffbeb", border: "1px solid #fcd34d",
            borderRadius: "10px", padding: "14px 16px",
          }}>
            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Perhatian:</strong> Post Test hanya bisa diisi sekali. Usahakan pelajari dulu dari materi dan ulang kembali video recording sebelum memulai kuis!
            </p>
          </div>

          {/* Main Select Session */}
          <div className={styles.lobbyCard}>
            <span className={styles.f1Tag}>SESI KUIS WEBGIS</span>
            <h3>Pilih Sesi Ujian Post-Test</h3>
            <p className={styles.lobbyDesc}>
              Setiap sesi memiliki 10 pertanyaan spesifik tentang kurikulum WebGIS Batch 3.
              Pastikan Anda telah mempelajari modul &amp; video rekaman kelas sebelum memulai kuis!
            </p>

            <div className={styles.sessionSelectorWrapper} style={{ marginBottom: "16px" }}>
              <label htmlFor="user-select">PILIH NAMA ANDA (PESERTA):</label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => handleUserChange(e.target.value)}
                className={styles.sessionSelect}
              >
                {PARTICIPANTS.map((user) => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>

            <div className={styles.sessionSelectorWrapper}>
              <label htmlFor="session-select">PILIH SESI POST TEST:</label>
              <select
                id="session-select"
                value={selectedSession}
                onChange={(e) => setSelectedSession(Number(e.target.value))}
                className={styles.sessionSelect}
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={s}>
                    {QUIZ_SESSIONS_MAP[s - 1] || `Kuis Sesi ${s}`}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={startQuiz} className={styles.launchBtn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Play size={14} /> MULAI POST TEST
            </button>
          </div>
        </div>
      )}

      {quizState === "PLAYING" && questions.length > 0 && (
        <div className={styles.gameContainer}>
          <div className={styles.mainGameArea}>
            <div className={styles.questionPanel}>
              <div className={styles.questionHeader}>
                <span className={styles.lapCount}>SOAL NOMOR {currentIdx + 1}/10</span>
              </div>

              <h3 className={styles.questionText}>{questions[currentIdx].question}</h3>

              {questions[currentIdx].image && (
                <div className={styles.questionImageWrapper}>
                  <img
                    src={questions[currentIdx].image}
                    alt="Gambar soal"
                    className={styles.questionImage}
                  />
                </div>
              )}

              <div className={styles.optionsList}>
                {questions[currentIdx].options.map((option, idx) => {
                  let optStyle = styles.optionBtn;
                  if (selectedAns === idx) optStyle += ` ${styles.optionSelected}`;
                  if (isAnswered && selectedAns !== idx) optStyle += ` ${styles.optionDisabled}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={isAnswered}
                      className={optStyle}
                    >
                      <span className={styles.optLetter}>{String.fromCharCode(65 + idx)}</span>
                      <span className={styles.optText}>{option}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={submitAndNext}
                disabled={selectedAns === null || isAnswered}
                className={styles.submitAnsBtn}
              >
                KIRIM &amp; LANJUT SOAL BERIKUTNYA ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {quizState === "RESULT" && (
        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <div className={styles.resultCardTop}>
              <div>
                <span className={styles.f1Tag}>POST TEST SELESAI</span>
                <h3 className={styles.resultTitle}>
                  Hasil Post Test — {QUIZ_SESSIONS_MAP[selectedSession - 1] || `Sesi ${selectedSession}`}
                </h3>
              </div>
              <span className={styles.resultBigEmoji}>{scoreEmoji}</span>
            </div>

            <div className={styles.resultScoreRow}>
              <div className={styles.resultScoreBox} style={{ borderColor: scoreColor }}>
                <span className={styles.resultScoreLabel}>SKOR PEROLEHAN</span>
                <span className={styles.resultScoreVal} style={{ color: scoreColor }}>
                  {score}<span className={styles.resultScoreMax}> / 100</span>
                </span>
              </div>
              <div className={styles.resultMessageBox}>
                <p className={styles.resultMessage} style={{ color: scoreColor }}>{scoreMessage}</p>
              </div>
            </div>

            <button onClick={returnToLobby} className={styles.resultBackBtn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Home size={15} /> Kembali ke Lobby Kuis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
