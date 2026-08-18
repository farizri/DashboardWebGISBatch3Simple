-- ============================================================
-- Final Project — tambah field GitHub link & Data Publication link
-- Run di: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE final_projects ADD COLUMN IF NOT EXISTS github_url      text DEFAULT '';
ALTER TABLE final_projects ADD COLUMN IF NOT EXISTS publication_url text DEFAULT '';
