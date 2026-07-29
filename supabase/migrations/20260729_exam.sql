-- ============================================================
-- Fitur Exam — ujian wajib sebelum mengumpulkan Final Project
-- Run di: Supabase Dashboard > SQL Editor
-- ============================================================

-- EXAM QUESTIONS — soal exam, 1 set soal
DROP TABLE IF EXISTS exam_questions CASCADE;
CREATE TABLE exam_questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order     integer NOT NULL DEFAULT 0,
  question_text  text NOT NULL DEFAULT '',
  options        jsonb NOT NULL DEFAULT '["","","",""]',
  correct_answer integer NOT NULL DEFAULT 0 CHECK (correct_answer BETWEEN 0 AND 3),
  image_url      text DEFAULT ''
);
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read exam_questions" ON exam_questions FOR SELECT USING (true);
CREATE POLICY "anon write exam_questions"  ON exam_questions FOR ALL USING (true) WITH CHECK (true);

-- EXAM SCORES — hasil exam per peserta per attempt
DROP TABLE IF EXISTS exam_scores CASCADE;
CREATE TABLE exam_scores (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant   text NOT NULL,
  email         text,
  score         integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  attempt_no    integer NOT NULL DEFAULT 1,
  completed_at  timestamptz DEFAULT now(),
  UNIQUE (participant, attempt_no)
);
ALTER TABLE exam_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read exam_scores" ON exam_scores FOR SELECT USING (true);
CREATE POLICY "anon write exam_scores"  ON exam_scores FOR ALL USING (true) WITH CHECK (true);
