-- ============================================================
-- Final Project — penilaian admin (UI 35% / Spasial 45% / Publikasi 20%)
-- Run di: Supabase Dashboard > SQL Editor
-- ============================================================

DROP TABLE IF EXISTS final_project_scores CASCADE;
CREATE TABLE final_project_scores (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant      text UNIQUE NOT NULL,
  ui_score         integer NOT NULL CHECK (ui_score BETWEEN 50 AND 100),
  spasial_score    integer NOT NULL CHECK (spasial_score BETWEEN 50 AND 100),
  publikasi_score  integer NOT NULL CHECK (publikasi_score BETWEEN 50 AND 100),
  weighted_average integer NOT NULL CHECK (weighted_average BETWEEN 0 AND 100),
  scored_at        timestamptz DEFAULT now()
);
ALTER TABLE final_project_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read final_project_scores" ON final_project_scores FOR SELECT USING (true);
CREATE POLICY "anon write final_project_scores"  ON final_project_scores FOR ALL USING (true) WITH CHECK (true);
