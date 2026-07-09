"use client";

import { useState, useEffect, useCallback } from "react";
import { sfx } from "../../lib/sound";
import { supabase } from "../../lib/supabase";
import {
  Globe, Trophy, Play,
  Home, Star, ThumbsUp, Target, AlertTriangle, BarChart2,
  ClipboardList, Send,
} from "lucide-react";
import styles from "./F1PaddockQuiz.module.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

interface SessionOption {
  session_key: number;
  name: string;
  count: number;
}

const QUIZ_SESSIONS_MAP: Record<number, string> = {
  1:  "Sesi 1 & 2: Onboarding & Get to Know WebGIS",
  2:  "Sesi 3: GIS Fundamental",
  3:  "Sesi 4: Location Value with GEO MAPID",
  4:  "Sesi 5: Introduction to VS Code, Git, HTML & CSS",
  5:  "Sesi 6: HTML and CSS Part 2 — Tailwind & Layouting",
  6:  "Sesi 7: JavaScript Part 1 — Fundamentals",
  7:  "Sesi 8 & 9: JavaScript Part 2 & Modern JS — DOM & Async",
  8:  "Sesi 10: Introduction to WebMap & MapLibre Part 1",
  9:  "Sesi 11: Introduction to WebMap & MapLibre Part 2",
  10: "Sesi 12: Introduction to WebMap & MapLibre Part 3",
  11: "Sesi 13: Feature Implementation Part 1 — Heatmap",
  12: "Sesi 14: Feature Implementation Part 2 — Radius/Buffer",
  13: "Sesi 14: Feature Implementation Part 3 — Isochrone",
  14: "Sesi 15: WebGIS Refinement and Deployment",
  15: "Sesi 16 & 17: Python for Spatial Data (Bonus)",
};

export default function F1PaddockQuiz() {
  const [participants, setParticipants]     = useState<{ name: string; email: string }[]>([]);
  const [availableSessions, setAvailableSessions] = useState<SessionOption[]>([]);
  const [selectedSession, setSelectedSession]     = useState<number>(0);
  const [selectedUser, setSelectedUser]           = useState<string>("");
  const [quizState, setQuizState]                 = useState<"LOBBY" | "PLAYING" | "FEEDBACK" | "RESULT">("LOBBY");
  const [loadingSessions, setLoadingSessions]     = useState(true);

  // Recap state: set of "participant|session_key" that have submitted
  const [quizDoneSet, setQuizDoneSet]   = useState<Set<string>>(new Set());
  const [recapPage, setRecapPage]       = useState(0);

  // Feedback / Evaluasi Sesi
  const [fbValues, setFbValues] = useState<Record<string, number | null>>({
    material_relevance: null,
    material_flow_clarity: null,
    hands_on_helpfulness: null,
    mentor_explanation: null,
    facilitator_responsiveness: null,
    webgis_project_readiness: null,
  });
  const [fbTouched, setFbTouched] = useState<Record<string, boolean>>({
    material_relevance: false,
    material_flow_clarity: false,
    hands_on_helpfulness: false,
    mentor_explanation: false,
    facilitator_responsiveness: false,
    webgis_project_readiness: false,
  });
  const [fbText, setFbText]         = useState("");
  const [fbSubmitting, setFbSubmitting] = useState(false);

  const [questions, setQuestions]       = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx]     = useState<number>(0);
  const [selectedAns, setSelectedAns]   = useState<number | null>(null);
  const [isAnswered, setIsAnswered]     = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<("CORRECT" | "INCORRECT" | "UNANSWERED")[]>([]);
  const [score, setScore]               = useState<number>(0);

  useEffect(() => {
    async function load() {
      const [{ data: pList }, { data: cfg }, { data: qData }] = await Promise.all([
        supabase.from("config_participants").select("name,email").order("sort_order"),
        supabase.from("post_test_config").select("total_sessions").limit(1).single(),
        supabase.from("quiz_questions").select("session_key"),
      ]);

      // Participants
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

      // Build available sessions: hanya sesi yang ada soalnya di DB & dalam limit aktif
      const totalLimit: number = (cfg as { total_sessions: number } | null)?.total_sessions ?? 15;
      const countMap: Record<number, number> = {};
      (qData || []).forEach((r: { session_key: number }) => {
        countMap[r.session_key] = (countMap[r.session_key] || 0) + 1;
      });

      const sessions: SessionOption[] = [];
      for (let key = 1; key <= totalLimit; key++) {
        if (countMap[key] && countMap[key] > 0) {
          sessions.push({
            session_key: key,
            name: QUIZ_SESSIONS_MAP[key] || `Kuis Sesi ${key}`,
            count: countMap[key],
          });
        }
      }

      setAvailableSessions(sessions);
      if (sessions.length > 0) setSelectedSession(sessions[0].session_key);

      // Fetch recap: semua quiz_scores untuk membangun checklist
      const { data: scores } = await supabase
        .from("quiz_scores")
        .select("participant,session_key");
      const doneSet = new Set<string>();
      (scores || []).forEach((r: { participant: string; session_key: number }) => {
        doneSet.add(`${r.participant}|${r.session_key}`);
      });
      setQuizDoneSet(doneSet);

      setLoadingSessions(false);
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

    const newScore = score + (isCorrect ? 10 : 0);
    if (isCorrect) { sfx.playCorrect(); setScore(newScore); }
    else { sfx.playIncorrect(); }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      const savedScores = localStorage.getItem("mapid_quiz_scores") || "{}";
      try {
        const scoresObj = JSON.parse(savedScores);
        if (newScore > (scoresObj[selectedSession] || 0)) {
          scoresObj[selectedSession] = newScore;
          localStorage.setItem("mapid_quiz_scores", JSON.stringify(scoresObj));
          window.dispatchEvent(new Event("storage"));
        }
      } catch (e) { console.error(e); }

      const activeUserName = localStorage.getItem("mapid_active_username") || "";
      const activeEmail    = localStorage.getItem("mapid_active_useremail") || "";
      const { data: prevAttempts } = await supabase
        .from("quiz_scores").select("attempt_no")
        .eq("participant", activeUserName).eq("session_key", selectedSession)
        .order("attempt_no", { ascending: false }).limit(1);
      const nextAttemptNo = prevAttempts?.length ? prevAttempts[0].attempt_no + 1 : 1;
      await supabase.from("quiz_scores").insert({
        participant: activeUserName, email: activeEmail,
        session_key: selectedSession, score: newScore, attempt_no: nextAttemptNo,
      });

      sfx.playSuccess();
      setQuizDoneSet(prev => new Set(prev).add(`${activeUserName}|${selectedSession}`));
      setQuizState("FEEDBACK");
    }
  }, [isAnswered, selectedAns, questions, currentIdx, answersStatus, score, selectedSession]);

  const startQuiz = async () => {
    if (!selectedSession) return;
    const currentActiveName  = localStorage.getItem("mapid_active_username") || "";
    const currentActiveEmail = localStorage.getItem("mapid_active_useremail") || "";
    localStorage.setItem("mapid_active_username",  currentActiveName);
    localStorage.setItem("mapid_active_useremail", currentActiveEmail);

    const { data: dbQuestions } = await supabase
      .from("quiz_questions")
      .select("question_text, options, correct_answer, image_url")
      .eq("session_key", selectedSession)
      .order("sort_order");

    if (!dbQuestions || dbQuestions.length === 0) {
      alert("Soal kuis untuk sesi ini belum tersedia!");
      return;
    }

    const mapped: QuizQuestion[] = dbQuestions.map((q: {
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
    setScore(0);
    setAnswersStatus(Array(mapped.length).fill("UNANSWERED"));
    setQuizState("PLAYING");
  };

  const handleAnswerSelect = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedAns(optIdx);
  };

  const returnToLobby = () => {
    setQuizState("LOBBY");
    setFbValues({ material_relevance: null, material_flow_clarity: null, hands_on_helpfulness: null, mentor_explanation: null, facilitator_responsiveness: null, webgis_project_readiness: null });
    setFbTouched({ material_relevance: false, material_flow_clarity: false, hands_on_helpfulness: false, mentor_explanation: false, facilitator_responsiveness: false, webgis_project_readiness: false });
    setFbText("");
  };

  const handleFeedbackSubmit = async () => {
    setFbSubmitting(true);
    const activeUserName = localStorage.getItem("mapid_active_username") || selectedUser;
    const { error } = await supabase.from("quiz_feedback").insert({
      participant: activeUserName,
      session_key: selectedSession,
      ...fbValues,
      feedback_text: fbText.trim() || null,
    });
    if (error) {
      console.error("Feedback insert error:", error);
      alert(`Gagal menyimpan evaluasi: ${error.message}`);
      setFbSubmitting(false);
      return;
    }
    setFbSubmitting(false);
    setQuizState("RESULT");
  };

  const sessionName = QUIZ_SESSIONS_MAP[selectedSession] || `Sesi ${selectedSession}`;
  const totalQ = questions.length || 10;

  const RECAP_PAGE_SIZE = 16;
  const recapTotalPages = Math.ceil(participants.length / RECAP_PAGE_SIZE);
  const recapPaged = participants.slice(recapPage * RECAP_PAGE_SIZE, (recapPage + 1) * RECAP_PAGE_SIZE);

  const scoreEmoji =
    score === 100 ? <Trophy size={52} color="#f59e0b" /> :
    score >= 80   ? <Star    size={52} color="#22c55e" /> :
    score >= 60   ? <ThumbsUp size={52} color="#84cc16" /> :
                    <Target  size={52} color="#f97316" />;
  const scoreColor =
    score === 100 ? "#16a34a" : score >= 80 ? "#22c55e" : score >= 70 ? "#84cc16" :
    score >= 60 ? "#eab308" : score >= 50 ? "#f97316" : "#ef4444";
  const scoreMessage =
    score === 100 ? "Wah, pemahaman Anda tinggi sekali! Luar biasa!" :
    score >= 80   ? "Bagus, keren! Anda sudah menguasai materi ini dengan baik." :
    score >= 60   ? "Siap! Terus pertahankan semangat belajarnya." :
    "Yuk usahakan lebih baik di asesmen selanjutnya. Pelajari kembali materinya dengan giat dan jangan ragu tanyakan ke mentor ya!";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Globe size={22} /> Post Test WebGIS Academy
        </h2>
        <p>Uji pemahaman spasial Anda dengan modul kuis evaluasi kelas WebGIS &amp; geospasial profesional.</p>
      </div>

      {quizState === "LOBBY" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Warning */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px",
            background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: "10px", padding: "14px 16px" }}>
            <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Perhatian:</strong> Post Test hanya bisa diisi sekali. Usahakan pelajari dulu dari materi dan ulang kembali video recording sebelum memulai kuis!
            </p>
          </div>

          <div className={styles.lobbyCard}>
            <span className={styles.f1Tag}>SESI KUIS WEBGIS</span>
            <h3>Pilih Sesi Ujian Post-Test</h3>
            <p className={styles.lobbyDesc}>
              Hanya sesi yang sudah memiliki soal yang dapat dipilih. Pastikan Anda telah mempelajari modul &amp; video rekaman kelas sebelum memulai kuis!
            </p>

            <div className={styles.sessionSelectorWrapper} style={{ marginBottom: "16px" }}>
              <label htmlFor="user-select">PILIH NAMA ANDA (PESERTA):</label>
              <select id="user-select" value={selectedUser} onChange={e => handleUserChange(e.target.value)} className={styles.sessionSelect}>
                {participants.map(u => <option key={u.name} value={u.name}>{u.name}</option>)}
              </select>
            </div>

            <div className={styles.sessionSelectorWrapper}>
              <label htmlFor="session-select">PILIH SESI POST TEST:</label>
              {loadingSessions ? (
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "8px 0" }}>Memuat sesi tersedia...</p>
              ) : availableSessions.length === 0 ? (
                <p style={{ fontSize: 13, color: "#f97316", margin: "8px 0" }}>Belum ada sesi post test yang aktif.</p>
              ) : (
                <select id="session-select" value={selectedSession} onChange={e => setSelectedSession(Number(e.target.value))} className={styles.sessionSelect}>
                  {availableSessions.map(s => (
                    <option key={s.session_key} value={s.session_key}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            <button onClick={startQuiz} disabled={availableSessions.length === 0 || !selectedSession}
              className={styles.launchBtn}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                opacity: availableSessions.length === 0 ? 0.5 : 1 }}>
              <Play size={14} /> MULAI POST TEST
            </button>
          </div>

          {/* Recap Checklist */}
          {availableSessions.length > 0 && (
            <div className={styles.databaseCard}>
              <div className={styles.databaseHeaderContainer}>
                <div className={styles.databaseTitleGroup}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart2 size={17} /> Rekapitulasi Pengisian Post Test
                  </h3>
                  <p className={styles.databaseSubtitle}>Checklist peserta yang sudah mengisi post test per sesi.</p>
                </div>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.gridTable}>
                  <thead>
                    <tr>
                      <th className={styles.stickyCol}>Nama Peserta</th>
                      {availableSessions.map(s => (
                        <th key={s.session_key}>Post Test {s.session_key}</th>
                      ))}
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recapPaged.map(p => {
                      const doneCount = availableSessions.filter(s => quizDoneSet.has(`${p.name}|${s.session_key}`)).length;
                      return (
                        <tr key={p.name}>
                          <td className={styles.stickyCol}><strong>{p.name}</strong></td>
                          {availableSessions.map(s => (
                            <td key={s.session_key} style={{ textAlign: "center" }}>
                              {quizDoneSet.has(`${p.name}|${s.session_key}`)
                                ? <span className={styles.gridScoreChecked}>✓</span>
                                : <span className={styles.gridScoreDash}>-</span>}
                            </td>
                          ))}
                          <td style={{ textAlign: "center" }}>
                            <span className={doneCount === availableSessions.length ? styles.gridScoreExcellent : styles.gridScoreEmpty} style={{ padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 12, display: "inline-block" }}>
                              {doneCount}/{availableSessions.length}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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

      {quizState === "PLAYING" && questions.length > 0 && (
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

      {quizState === "FEEDBACK" && (
        <div className={styles.resultContainer}>
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackSectionHead}>
              <h3><ClipboardList size={20} /> Evaluasi Sesi</h3>
              <p>Bantu kami meningkatkan kualitas pembelajaran WebGIS Development Bootcamp dengan memberikan penilaian terhadap sesi hari ini.</p>
            </div>

            <div className={styles.feedbackSliderGroup}>
              {([
                { key: "material_relevance",        label: "Seberapa relevan materi pada sesi ini dengan kebutuhan belajar Anda?" },
                { key: "material_flow_clarity",     label: "Seberapa mudah Anda mengikuti alur penyampaian materi pada sesi ini?" },
                { key: "hands_on_helpfulness",      label: "Seberapa membantu aktivitas hands-on dalam memahami materi yang dipelajari?" },
                { key: "mentor_explanation",        label: "Seberapa membantu penjelasan mentor dalam memahami materi?" },
                { key: "facilitator_responsiveness",label: "Seberapa responsif fasilitator dalam membantu kebutuhan atau pertanyaan peserta?" },
                { key: "webgis_project_readiness",  label: "Seberapa membantu sesi ini dalam mempersiapkan Anda mengerjakan project WebGIS?" },
              ] as { key: string; label: string }[]).map((item, idx) => {
                const val = fbValues[item.key];
                const isTouched = fbTouched[item.key];
                const pct = val !== null ? ((val - 1) / 3) * 100 : 0;
                return (
                  <div key={item.key} className={styles.feedbackSliderItem}>
                    <div className={styles.feedbackSliderLabel}>
                      <span className={styles.feedbackSliderNum}>{idx + 1}</span>
                      {item.label}
                      {!isTouched && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginLeft: 6 }}>*wajib diisi</span>}
                    </div>
                    <div className={styles.feedbackSliderTrack}>
                      <span className={styles.feedbackScaleLabel}>Sangat tidak puas</span>
                      <input
                        type="range"
                        min={1} max={4} step={1}
                        value={val ?? 2}
                        className={`${styles.feedbackRangeInput} ${!isTouched ? styles.feedbackRangeUntouched : ''}`}
                        style={{ "--progress": isTouched ? `${pct}%` : '0%' } as React.CSSProperties}
                        onChange={e => {
                          const newVal = Number(e.target.value);
                          setFbValues(prev => ({ ...prev, [item.key]: newVal }));
                          setFbTouched(prev => ({ ...prev, [item.key]: true }));
                        }}
                      />
                      <span className={`${styles.feedbackScaleLabel} ${styles.feedbackScaleLabelRight}`}>Sangat puas</span>
                      <span className={`${styles.feedbackValuePill} ${!isTouched ? styles.feedbackValuePillUntouched : ''}`}>{isTouched ? val : '--'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13.5, fontWeight: 700, color: "var(--primary)" }}>
                Kritik, saran, atau rekomendasi untuk meningkatkan sesi pembelajaran berikutnya.
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginLeft: 6 }}>(opsional)</span>
              </label>
              <textarea
                className={styles.feedbackTextArea}
                rows={4}
                placeholder="Tulis kritik, saran, atau rekomendasi kamu di sini..."
                value={fbText}
                onChange={e => setFbText(e.target.value)}
              />
            </div>

            {!Object.values(fbTouched).every(Boolean) && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px",
                background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 14px" }}>
                <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 12.5, color: "#991b1b", lineHeight: 1.5 }}>
                  Silakan isi semua penilaian slider di atas sebelum mengirim evaluasi.
                </p>
              </div>
            )}
            <button
              className={styles.feedbackSubmitBtn}
              onClick={handleFeedbackSubmit}
              disabled={fbSubmitting || !Object.values(fbTouched).every(Boolean)}
            >
              <Send size={15} />
              {fbSubmitting ? "Mengirim evaluasi..." : "Kirim Evaluasi & Lihat Hasil"}
            </button>
          </div>
        </div>
      )}

      {quizState === "RESULT" && (
        <div className={styles.resultContainer}>
          <div className={styles.resultCard}>
            <div className={styles.resultCardTop}>
              <div>
                <span className={styles.f1Tag}>POST TEST SELESAI</span>
                <h3 className={styles.resultTitle}>Hasil Post Test — {sessionName}</h3>
              </div>
              <span className={styles.resultBigEmoji}>{scoreEmoji}</span>
            </div>
            <div className={styles.resultScoreRow}>
              <div className={styles.resultScoreBox} style={{ borderColor: scoreColor }}>
                <span className={styles.resultScoreLabel}>SKOR PEROLEHAN</span>
                <span className={styles.resultScoreVal} style={{ color: scoreColor }}>
                  {score}<span className={styles.resultScoreMax}> / {totalQ * 10}</span>
                </span>
              </div>
              <div className={styles.resultMessageBox}>
                <p className={styles.resultMessage} style={{ color: scoreColor }}>{scoreMessage}</p>
              </div>
            </div>
            <button onClick={returnToLobby} className={styles.resultBackBtn}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Home size={15} /> Kembali ke Lobby Kuis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
