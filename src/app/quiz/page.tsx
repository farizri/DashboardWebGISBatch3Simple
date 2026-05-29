"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Timer, Home, Trophy, Award, Star, Shield, Brain, Map } from "lucide-react";
import styles from "./quiz.module.css";
import { QUIZ_QUESTIONS } from "@/lib/mock-data";

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

const BADGES_MAP: Record<string, Badge> = {
  explorer: { id: "explorer", name: "WebGIS Explorer", desc: "Memulai langkah di MAPID Academy", icon: "explorer" },
  perfect: { id: "perfect", name: "Top Performer", desc: "Mendapatkan nilai sempurna (100) pada Post Test", icon: "perfect" },
  speed: { id: "speed", name: "Speed Demon", desc: "Menyelesaikan Post Test dalam waktu < 45 detik", icon: "speed" },
  consistent: { id: "consistent", name: "Consistent Learner", desc: "Melakukan percobaan Post Test lebih dari 1 kali", icon: "consistent" },
  mapmaster: { id: "mapmaster", name: "Map Master", desc: "Menjawab minimal 4 soal benar (Skor >= 80)", icon: "mapmaster" }
};

const BADGE_ICON: Record<string, React.ReactElement> = {
  explorer: <Shield size={18} />,
  perfect: <Trophy size={18} />,
  speed: <Star size={18} />,
  consistent: <Brain size={18} />,
  mapmaster: <Map size={18} />,
};

export default function QuizPage() {
  const [mounted, setMounted] = useState(false);
  const [quizState, setQuizState] = useState<"active" | "result">("active");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Results State
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([]);
  const [timeTakenString, setTimeTakenString] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Timer interval
  useEffect(() => {
    if (quizState !== "active" || !mounted) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState, mounted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // 1. Calculate Score
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    setCorrectCount(correct);
    setScore(finalScore);

    // 2. Format final time taken
    const totalTimeStr = formatTime(timerSeconds);
    setTimeTakenString(totalTimeStr);

    // 3. Load & Update Local Storage
    const savedHighScore = localStorage.getItem("mapid_quiz_highscore");
    const savedAttempts = localStorage.getItem("mapid_quiz_attempts");
    const savedBadges = localStorage.getItem("mapid_quiz_badges");

    const currentHighScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;
    const currentAttempts = savedAttempts ? parseInt(savedAttempts, 10) : 0;
    let currentBadgesList: string[] = ["explorer"];

    if (savedBadges) {
      try {
        currentBadgesList = JSON.parse(savedBadges);
        if (!currentBadgesList.includes("explorer")) {
          currentBadgesList.push("explorer");
        }
      } catch (e) {
        console.error(e);
      }
    }

    const newAttempts = currentAttempts + 1;
    const newHighScore = Math.max(currentHighScore, finalScore);

    // 4. Badges unlock criteria logic
    const unlockedThisRun: string[] = [];

    if (!currentBadgesList.includes("explorer")) {
      unlockedThisRun.push("explorer");
    }

    // Top Performer
    if (finalScore === 100 && !currentBadgesList.includes("perfect")) {
      unlockedThisRun.push("perfect");
    }

    // Speed Demon
    if (timerSeconds <= 45 && finalScore >= 60 && !currentBadgesList.includes("speed")) {
      unlockedThisRun.push("speed");
    }

    // Consistent Learner
    if (newAttempts > 1 && !currentBadgesList.includes("consistent")) {
      unlockedThisRun.push("consistent");
    }

    // Map Master
    if (finalScore >= 80 && !currentBadgesList.includes("mapmaster")) {
      unlockedThisRun.push("mapmaster");
    }

    // Merge & Save
    const mergedBadges = Array.from(new Set([...currentBadgesList, ...unlockedThisRun]));

    localStorage.setItem("mapid_quiz_highscore", newHighScore.toString());
    localStorage.setItem("mapid_quiz_attempts", newAttempts.toString());
    localStorage.setItem("mapid_quiz_badges", JSON.stringify(mergedBadges));
    localStorage.setItem("mapid_quiz_completed", "true");

    setNewlyUnlockedBadges(unlockedThisRun);
    setQuizState("result");
  };

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.quizCard}>
          <div style={{ textAlign: "center", padding: "40px 0" }}>Loading Quiz System...</div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className={styles.container}>
      {quizState === "active" ? (
        <div className={styles.quizCard}>
          {/* Header */}
          <div className={styles.quizHeader}>
            <div className={styles.questionMeta}>
              <span className={styles.categoryTag}>{currentQuestion.category}</span>
              <span className={styles.questionNumber}>
                Pertanyaan {currentQuestionIndex + 1} dari {QUIZ_QUESTIONS.length}
              </span>
            </div>
            <div className={styles.timer}>
              <Timer size={14} />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarInner}
              style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          {/* Question & Options */}
          <div className={styles.questionContent}>
            <h2 className={styles.questionText}>{currentQuestion.question}</h2>

            {/* Optional Question Image */}
            {currentQuestion.image && (
              <div className={styles.imageWrapper}>
                <Image
                  className={styles.questionImage}
                  src={currentQuestion.image}
                  alt={currentQuestion.question}
                  width={400}
                  height={300}
                  unoptimized
                />
              </div>
            )}

            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={idx}
                    className={`${styles.optionButton} ${isSelected ? styles.optionButtonSelected : ""}`}
                    onClick={() => handleSelectOption(idx)}
                  >
                    <span className={styles.optionIndex}>{optionLabel}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Controls */}
          <div className={styles.quizFooter}>
            <button
              className={styles.backButton}
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              style={{ visibility: currentQuestionIndex === 0 ? "hidden" : "visible" }}
            >
              ← Kembali
            </button>
            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!isAnswered}
            >
              {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? "Selesai & Kirim" : "Lanjut →"}
            </button>
          </div>
        </div>
      ) : (
        /* ================= RESULT SCREEN ================= */
        <div className={styles.quizCard}>
          <div className={styles.resultContainer}>
            <div className={styles.resultTitle}>Hasil Evaluasi Anda</div>
            <p className={styles.summaryText}>
              Selamat! Anda telah menyelesaikan seluruh rangkaian evaluasi Post Test WebGIS Bootcamp. 
              Berikut adalah rincian performa pengerjaan Anda:
            </p>

            {/* Score Ring */}
            <div className={styles.scoreCircleOuter}>
              <div className={styles.scoreCircleInner}>
                <span className={styles.scoreNumber}>{score}</span>
                <span className={styles.scoreLabel}>SKOR AKHIR</span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className={styles.resultStatsGrid}>
              <div className={styles.resultStatBox}>
                <span className={styles.resultStatLabel}>Jawaban Benar</span>
                <span className={styles.resultStatVal}>
                  {correctCount} / {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className={styles.resultStatBox}>
                <span className={styles.resultStatLabel}>Durasi Pengerjaan</span>
                <span className={styles.resultStatVal}>{timeTakenString}</span>
              </div>
            </div>

            {/* Badges Earned Section */}
            {newlyUnlockedBadges.length > 0 && (
              <div className={styles.celebrationSection}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Award size={18} /> Pencapaian Baru Terbuka!</h3>
                <div className={styles.unlockedBadgesRow}>
                  {newlyUnlockedBadges.map((badgeId) => {
                    const badge = BADGES_MAP[badgeId];
                    if (!badge) return null;
                    return (
                      <div key={badgeId} className={styles.unlockedBadgeBadge}>
                        <span>{BADGE_ICON[badgeId]}</span>
                        <span>{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={styles.resultActions}>
              <Link href="/" className={styles.actionButtonSecondary} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <Home size={14} /> Kembali ke Dashboard
              </Link>
              <Link href="/leaderboard" className={`${styles.nextButton} ${styles.actionButtonSecondary}`} style={{ flex: 1, justifyContent: "center", display: "flex", alignItems: "center", gap: "7px" }}>
                <Trophy size={14} /> Lihat Scoreboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
