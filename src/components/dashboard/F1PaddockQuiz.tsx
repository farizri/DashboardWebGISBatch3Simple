"use client";

import { useState, useEffect, useCallback } from "react";
import { BOOTCAMP_QUIZZES, QuizQuestion } from "../../lib/quiz-data";
import { sfx } from "../../lib/sound";
import { supabase } from "../../lib/supabase";
import {
  Globe, Trophy, Check, User, Play,
  BarChart2, Wrench, Home, Star, ThumbsUp, Target,
} from "lucide-react";
import styles from "./F1PaddockQuiz.module.css";

interface ClassStanding {
  name: string;
  score: number;
  isUser: boolean;
  avatar: string;
}

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

const getMockParticipantScore = (name: string, session: number): number | null => {
  const seedScoreMap: Record<string, Record<number, number>> = {
    "Rafi Fistra Ali": { 1: 100, 2: 90, 3: 100, 4: 90, 5: 100, 6: 90 },
    "Athirah Hamzah": { 1: 90, 2: 90, 3: 90, 4: 100, 5: 90, 6: 80 },
    "Azya Naurah Sumakhalda": { 1: 80, 2: 90, 3: 90, 4: 90, 5: 90 },
    "Rizki Amara Putri": { 1: 90, 2: 80, 3: 80, 4: 90, 5: 90 },
    "Muhammad Thariq Aziz": { 1: 80, 2: 80, 3: 90, 4: 80, 5: 80 },
    "Adinda Dwi Yulianto": { 1: 80, 2: 70, 3: 80, 4: 80, 5: 80 },
    "Rinjani Putri Djunaedi": { 1: 70, 2: 80, 3: 70, 4: 70, 5: 80 },
    "Binar Aulia Setyawan": { 1: 80, 2: 70, 3: 60, 4: 80, 5: 70 },
    "Robertho Kadji": { 1: 70, 2: 60, 3: 70, 4: 70, 5: 60 },
    "Kalvin Reza Pratama": { 1: 90, 2: 90, 3: 90, 4: 90, 5: 90, 6: 80 }
  };

  const scores = seedScoreMap[name];
  if (scores && scores[session] !== undefined) {
    return scores[session];
  }
  return null;
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

interface CollectiveQuizEntry {
  name: string;
  session: number;
  sessionName: string;
  score: number;
  date: string;
}

export default function F1PaddockQuiz() {
  const [selectedSession, setSelectedSession] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<string>("Kalvin Reza Pratama");
  const [quizState, setQuizState] = useState<"LOBBY" | "PLAYING" | "RESULT">("LOBBY");
  
  // Game state variables
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<("CORRECT" | "INCORRECT" | "UNANSWERED")[]>([]);
  const [score, setScore] = useState<number>(0);
  // Standings Leaderboard mock list + User dynamic slot
  const [standings, setStandings] = useState<ClassStanding[]>([]);
  const [collectiveQuizzes, setCollectiveQuizzes] = useState<CollectiveQuizEntry[]>([]);
  
  // Standing Session Limit & Database Tab state
  const [leaderboardSessionLimit, setLeaderboardSessionLimit] = useState<number>(6);
  const [activeDbTab, setActiveDbTab] = useState<"checklist" | "log">("checklist");
  const [leaderboardPage, setLeaderboardPage] = useState<number>(0);
  const ITEMS_PER_PAGE = 6;

  // Helper to get active user high scores from localStorage
  const getUserHighScoreForSession = (session: number): number | null => {
    if (typeof window === "undefined") return null;
    const savedScores = localStorage.getItem("mapid_quiz_scores");
    if (savedScores) {
      try {
        const parsed = JSON.parse(savedScores) as Record<string, number>;
        if (parsed[session] !== undefined) {
          return parsed[session];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  const updateStandingsList = useCallback(async () => {
    // Load all quiz high scores up to leaderboardSessionLimit to calculate user's total score
    let userHighScoreTotal = 0;
    const savedScores = localStorage.getItem("mapid_quiz_scores");
    if (savedScores) {
      try {
        const parsed = JSON.parse(savedScores) as Record<string, number>;
        Object.entries(parsed).forEach(([sessionStr, scoreVal]) => {
          const sessionNum = Number(sessionStr);
          if (sessionNum <= leaderboardSessionLimit) {
            userHighScoreTotal += scoreVal;
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    const activeUserName = localStorage.getItem("mapid_active_username") || "Kalvin Reza Pratama";

    // Define base ratios for everyone
    const participantRatios: Record<string, number> = {
      "Rafi Fistra Ali": 0.95,
      "Athirah Hamzah": 0.90,
      "Azya Naurah Sumakhalda": 0.85,
      "Rizki Amara Putri": 0.82,
      "Muhammad Thariq Aziz": 0.78,
      "Adinda Dwi Yulianto": 0.75,
      "Rinjani Putri Djunaedi": 0.70,
      "Binar Aulia Setyawan": 0.65,
      "Robertho Kadji": 0.60,
      "Kalvin Reza Pratama": 0.88
    };

    const baseStandings: ClassStanding[] = PARTICIPANTS.map((name) => {
      const isUser = name === activeUserName;
      let scoreVal = 0;
      if (isUser) {
        scoreVal = userHighScoreTotal;
      } else {
        const ratio = participantRatios[name] || 0.70;
        // Calculate dynamic mock score based on leaderboardSessionLimit
        scoreVal = Math.round(ratio * leaderboardSessionLimit * 100);
        // Ensure mock score doesn't exceed max possible
        scoreVal = Math.min(scoreVal, leaderboardSessionLimit * 100);
      }

      return {
        name,
        score: scoreVal,
        isUser,
        avatar: "👤"
      };
    });

    // Sort by score descending
    baseStandings.sort((a, b) => b.score - a.score);
    setStandings(baseStandings);

    // Load collective quizzes from Supabase
    const { data: quizData } = await supabase
      .from("quiz_scores")
      .select("participant, session_key, score, completed_at")
      .order("completed_at", { ascending: false });

    if (quizData) {
      const entries: CollectiveQuizEntry[] = quizData.map((row) => ({
        name: row.participant,
        session: row.session_key,
        sessionName: QUIZ_SESSIONS_MAP[row.session_key - 1] || `Pertemuan ${row.session_key}`,
        score: row.score,
        date: new Date(row.completed_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          + " " + new Date(row.completed_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      }));
      setCollectiveQuizzes(entries);
    }
  }, [leaderboardSessionLimit]);

  const handleUserChange = (name: string) => {
    setSelectedUser(name);
    localStorage.setItem("mapid_active_username", name);
    const email = PARTICIPANT_EMAILS[name] || "peserta@mapid.co.id";
    localStorage.setItem("mapid_active_useremail", email);
    
    // Dispatch event to sync other tabs instantly
    window.dispatchEvent(new Event("storage"));
    
    // Re-calculate standing with newly selected user name
    setTimeout(() => {
      updateStandingsList();
    }, 0);
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

    // Move to next question or finish
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      // Update localStorage cache for standings calculation
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

      // Persist to Supabase
      const activeUserName = localStorage.getItem("mapid_active_username") || "Kalvin Reza Pratama";
      const activeEmail = localStorage.getItem("mapid_active_useremail") || "";
      // Get next attempt number for this user+session
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
      updateStandingsList();
      setQuizState("RESULT");
    }
  }, [isAnswered, selectedAns, questions, currentIdx, answersStatus, score, selectedSession, updateStandingsList]);

  // Load name on mount and update standings
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
      updateStandingsList();
    }, 0);
    return () => clearTimeout(timer);
  }, [updateStandingsList]);

  // Trigger standings recalculation when the limit changes
  useEffect(() => {
    updateStandingsList();
  }, [leaderboardSessionLimit, updateStandingsList]);


  const startQuiz = () => {
    const qList = BOOTCAMP_QUIZZES[selectedSession];
    if (!qList || qList.length === 0) {
      alert("Soal kuis untuk sesi ini belum tersedia!");
      return;
    }
    
    // Ensure active profile is strictly set
    const currentActiveName = localStorage.getItem("mapid_active_username") || "Kalvin Reza Pratama";
    const currentActiveEmail = localStorage.getItem("mapid_active_useremail") || "kalvin@gmail.com";
    localStorage.setItem("mapid_active_username", currentActiveName);
    localStorage.setItem("mapid_active_useremail", currentActiveEmail);

    // Reset states
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


  const returnToLobby = () => {
    setQuizState("LOBBY");
    updateStandingsList();
  };

  const scoreEmoji =
    score === 100 ? <Trophy size={52} color="#f59e0b" /> :
    score >= 80   ? <Star    size={52} color="#22c55e" /> :
    score >= 60   ? <ThumbsUp size={52} color="#84cc16" /> :
                    <Target  size={52} color="#f97316" />;
  const scoreColor =
    score === 100 ? "#16a34a" :
    score >= 80  ? "#22c55e" :
    score >= 70  ? "#84cc16" :
    score >= 60  ? "#eab308" :
    score >= 50  ? "#f97316" : "#ef4444";
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
        <p>Uji pemahaman spasial Anda dengan modul kuis evaluasi kelas WebGIS & geospasial profesional.</p>
      </div>

      {quizState === "LOBBY" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            {/* Main Select Session */}
            <div className={styles.lobbyCard}>
              <span className={styles.f1Tag}>SESI KUIS WEBGIS</span>
              <h3>Pilih Sesi Ujian Post-Test</h3>
              <p className={styles.lobbyDesc}>
                Setiap sesi memiliki 10 pertanyaan spesifik tentang kurikulum WebGIS Batch 3.
                Pastikan Anda telah mempelajari modul & video rekaman kelas sebelum memulai kuis!
              </p>

              {/* User Dropdown Selector */}
              <div className={styles.sessionSelectorWrapper} style={{ marginBottom: "16px" }}>
                <label htmlFor="user-select">PILIH NAMA ANDA (PESERTA):</label>
                <select
                  id="user-select"
                  value={selectedUser}
                  onChange={(e) => handleUserChange(e.target.value)}
                  className={styles.sessionSelect}
                >
                  {PARTICIPANTS.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Selector */}
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

          {/* Database Pengisian Kuis (Collective Database) */}
          <div className={styles.databaseCard}>
            <div className={styles.databaseHeaderContainer}>
              <div className={styles.databaseTitleGroup}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChart2 size={18} />
                Checklist Rekapitulasi Post Test Peserta
              </h3>
                <p className={styles.databaseSubtitle}>Rekapitulasi checklist pengisian post test seluruh peserta kelas.</p>
              </div>
            </div>

            <div className={styles.tableWrapper} style={{ marginTop: "16px" }}>
              <table className={styles.gridTable}>
                <thead>
                  <tr>
                    <th className={styles.stickyCol}>Nama Peserta</th>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((s) => (
                      <th key={s} className={styles.sessionHeader}>Sesi {s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PARTICIPANTS.map((name, pIdx) => {
                    const isUser = name === selectedUser;
                    return (
                      <tr key={pIdx} className={isUser ? styles.highlightedGridRow : ""}>
                        <td className={styles.stickyCol}>
                          <strong>{name}</strong>
                        </td>
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((sessionNum) => {
                          const scoreVal = isUser 
                            ? getUserHighScoreForSession(sessionNum) 
                            : getMockParticipantScore(name, sessionNum);

                          return (
                            <td key={sessionNum} style={{ textAlign: "center" }}>
                              {scoreVal !== null ? (
                                <span className={`${styles.gridScoreBadge} ${styles.gridScoreChecked}`}>
                                  ✓
                                </span>
                              ) : (
                                <span className={styles.gridScoreDash}>-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {quizState === "PLAYING" && questions.length > 0 && (
        <div className={styles.gameContainer}>
          {/* Question Grid Lights */}
          <div className={styles.telemetryLightsPanel}>
            <span className={styles.telemetryLabel}>STATUS SOAL POST TEST</span>
            <div className={styles.lightsRow}>
              {answersStatus.map((status, idx) => (
                <div
                  key={idx}
                  className={`${styles.lightLed} ${
                    idx === currentIdx
                      ? styles.lightCurrent
                      : status === "CORRECT"
                      ? styles.lightCorrect
                      : status === "INCORRECT"
                      ? styles.lightIncorrect
                      : styles.lightUnanswered
                  }`}
                >
                  <span className={styles.lightNum}>{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mainGameArea}>
            {/* Question Panel */}
            <div className={styles.questionPanel}>
              <div className={styles.questionHeader}>
                <span className={styles.lapCount}>SOAL NOMOR {currentIdx + 1}/10</span>
                
                {/* Circular timer */}
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
                      <span className={styles.optLetter}>
                        {String.fromCharCode(65 + idx)}
                      </span>
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
                KIRIM & LANJUT SOAL BERIKUTNYA ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {quizState === "RESULT" && (
        <div className={styles.resultContainer}>
          {/* Result Card */}
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
                <p className={styles.resultMessage} style={{ color: scoreColor }}>
                  {scoreMessage}
                </p>
              </div>
            </div>

            <button onClick={returnToLobby} className={styles.resultBackBtn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Home size={15} /> Kembali ke Lobby Kuis
            </button>
          </div>

          {/* Answer Analysis Card */}
          <div className={styles.reviewCard}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Wrench size={18} />
              Analisis Review Jawaban
            </h3>
            <p className={styles.reviewIntro}>
              Pelajari detail kesalahan pengerjaan kuis untuk menyempurnakan reasoning logika spasial Anda di dunia nyata.
            </p>

            <div className={styles.reviewList}>
              {questions.map((question, idx) => {
                const status = answersStatus[idx];
                return (
                  <div
                    key={idx}
                    className={`${styles.reviewRow} ${
                      status === "CORRECT" ? styles.reviewCorrect : styles.reviewIncorrect
                    }`}
                  >
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewLap}>SOAL {idx + 1}</span>
                      <span
                        className={`${styles.reviewStatusBadge} ${
                          status === "CORRECT" ? styles.reviewBadgeCorrect : styles.reviewBadgeIncorrect
                        }`}
                      >
                        {status === "CORRECT" ? "BENAR" : "SALAH"}
                      </span>
                    </div>

                    <h4 className={styles.reviewQuestion}>{question.question}</h4>
                    
                    <div className={styles.answersReview}>
                      <p>
                        <strong>Jawaban Benar:</strong>{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                    </div>

                    <p className={styles.reviewExplanation}>
                      <strong>Penjelasan Analisis:</strong> {question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
