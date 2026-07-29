-- ============================================================
-- MAPID Academy WebGIS Batch 3 — Supabase Schema
-- Run di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- 1. ATTENDANCE — per peserta per sesi
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS attendance CASCADE;
CREATE TABLE attendance (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant  text NOT NULL,
  session_no   integer NOT NULL CHECK (session_no BETWEEN 1 AND 17),
  attended     boolean NOT NULL DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (participant, session_no)
);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "anon write attendance"  ON attendance FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 2. TASK SUBMISSIONS — link tugas peserta
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS task_submissions CASCADE;
CREATE TABLE task_submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant  text NOT NULL,
  task_id      integer NOT NULL,
  task_number  text NOT NULL,
  task_title   text NOT NULL,
  url          text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read task_submissions" ON task_submissions FOR SELECT USING (true);
CREATE POLICY "anon write task_submissions"  ON task_submissions FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 3. QUIZ SCORES — hasil post test per peserta per sesi
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS quiz_scores CASCADE;
CREATE TABLE quiz_scores (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant   text NOT NULL,
  email         text,
  session_key   integer NOT NULL CHECK (session_key BETWEEN 1 AND 15),
  score         integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  attempt_no    integer NOT NULL DEFAULT 1,
  completed_at  timestamptz DEFAULT now(),
  UNIQUE (participant, session_key, attempt_no)
);
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read quiz_scores" ON quiz_scores FOR SELECT USING (true);
CREATE POLICY "anon write quiz_scores"  ON quiz_scores FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 4. FINAL PROJECTS — pengumpulan final project
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS final_projects CASCADE;
CREATE TABLE final_projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant  text UNIQUE NOT NULL,
  url          text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
ALTER TABLE final_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read final_projects" ON final_projects FOR SELECT USING (true);
CREATE POLICY "anon write final_projects"  ON final_projects FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 5. POST TEST CONFIG — admin konfigurasi jumlah sesi quiz
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS post_test_config CASCADE;
CREATE TABLE post_test_config (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_sessions integer NOT NULL DEFAULT 1 CHECK (total_sessions BETWEEN 1 AND 15),
  updated_at     timestamptz DEFAULT now()
);
INSERT INTO post_test_config (total_sessions) VALUES (1);
ALTER TABLE post_test_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read post_test_config" ON post_test_config FOR SELECT USING (true);
CREATE POLICY "anon write post_test_config"  ON post_test_config FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 6. SITE CONFIG — key-value untuk tata tertib, kontak, link
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS site_config CASCADE;
CREATE TABLE site_config (
  key        text PRIMARY KEY,
  value      text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "anon write site_config"  ON site_config FOR ALL USING (true) WITH CHECK (true);

INSERT INTO site_config (key, value) VALUES
  ('attendance_link',          'https://forms.gle/mapid-academy-attendance'),
  ('discord_link',             'https://discord.gg/mapid'),
  ('zoom_link',                'https://zoom.us/j/88219283192?pwd=mapidacademy'),
  ('zoom_meeting_id',          '882 1928 3192'),
  ('zoom_passcode',            'mapidacademy'),
  ('fasilitator_1_name',       'Farah'),
  ('fasilitator_1_phone',      '+6281234567890'),
  ('fasilitator_2_name',       'Rofi'),
  ('fasilitator_2_phone',      '+6281234567891'),
  ('tata_tertib_1_title',      'Penyelesaian Post Test'),
  ('tata_tertib_1_desc',       'Post test wajib diisi setiap selesai mengikuti masing-masing sesi pertemuan.'),
  ('tata_tertib_2_title',      'Konektivitas Tugas Terintegrasi'),
  ('tata_tertib_2_desc',       'Tugas mingguan (Sesi 1-15) saling berkesinambungan membentuk final project berupa webgis mandiri.'),
  ('tata_tertib_3_title',      'Evaluasi Logika Mandiri'),
  ('tata_tertib_3_desc',       'Penilaian berfokus pada pemahaman sintaks. Penggunaan AI diperbolehkan sebagai asisten logika.'),
  ('tata_tertib_4_title',      'Fokus Penilaian Portofolio'),
  ('tata_tertib_4_desc',       'Portofolio dievaluasi atas: Storytelling, UI/UX Peta, fungsionalitas WebGIS, dan hasil deploy cloud.'),
  ('total_absensi_sessions',   '17'),
  ('total_bootcamp_sessions',  '17'),
  ('total_quiz_sessions',      '15'),
  ('total_task_count',         '15'),
  ('total_participants',       '10'),
  ('redeem_code',              'WGA262'),
  ('youtube_playlist_url',     'https://www.youtube.com/@mapid_official'),
  ('quiz_sessions_map',        '{"1":"Sesi 1 & 2: Onboarding & Get to Know WebGIS","2":"Sesi 3: GIS Fundamental","3":"Sesi 4: Location Value with GEO MAPID","4":"Sesi 5: Introduction to VS Code, Git, HTML, CSS, and JS","5":"Sesi 6: HTML and CSS Part 2","6":"Sesi 7: JavaScript Part 1","7":"Sesi 8: JavaScript Part 2","8":"Sesi 9: Introduction JavaScript Modern","9":"Sesi 10: WebMap & MapLibre Part 1","10":"Sesi 11: WebMap & MapLibre Part 2","11":"Sesi 12: WebMap & MapLibre Part 3","12":"Sesi 13: Feature Implementation Part 1","13":"Sesi 14: Feature Implementation Part 2","14":"Sesi 15: WebGIS Code Refinement and Deployment","15":"Bonus: Python Spatial Data"}');

-- ═══════════════════════════════════════════════════════════════
-- 7. CONFIG PARTICIPANTS — daftar peserta
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_participants CASCADE;
CREATE TABLE config_participants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text UNIQUE NOT NULL,
  email      text DEFAULT '',
  sort_order integer DEFAULT 0
);
ALTER TABLE config_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_participants" ON config_participants FOR SELECT USING (true);
CREATE POLICY "anon write config_participants"  ON config_participants FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_participants (name, email, sort_order) VALUES
  ('Kalvin Reza Pratama',    'kalvin@gmail.com',    1),
  ('Rafi Fistra Ali',        'rafi@gmail.com',      2),
  ('Binar Aulia Setyawan',   'binar@gmail.com',     3),
  ('Athirah Hamzah',         'athirah@gmail.com',   4),
  ('Azya Naurah Sumakhalda', 'azya@gmail.com',      5),
  ('Robertho Kadji',         'robertho@gmail.com',  6),
  ('Rinjani Putri Djunaedi', 'rinjani@gmail.com',   7),
  ('Rizki Amara Putri',      'rizki@gmail.com',     8),
  ('Muhammad Thariq Aziz',   'thariq@gmail.com',    9),
  ('Adinda Dwi Yulianto',    'adinda@gmail.com',    10);

-- ═══════════════════════════════════════════════════════════════
-- 8. CONFIG TASKS — definisi tugas per fase
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_tasks CASCADE;
CREATE TABLE config_tasks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_order integer UNIQUE NOT NULL,
  number     text NOT NULL,
  title      text NOT NULL,
  phase      text DEFAULT ''
);
ALTER TABLE config_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_tasks" ON config_tasks FOR SELECT USING (true);
CREATE POLICY "anon write config_tasks"  ON config_tasks FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_tasks (task_order, number, title, phase) VALUES
  (1, 'Tugas 1-2',  'Spatial Preparation — Format GIS & Problem Solving',        'GIS & Location Value'),
  (2, 'Tugas 3',    'Project Definition — Ide WebGIS & Data Spasial Awal',       'GIS & Location Value'),
  (3, 'Tugas 4',    'Web Structure & Dashboard UI — HTML & CSS',                 'HTML & CSS'),
  (4, 'Tugas 5',    'Web Interaction & Dynamic Content — JavaScript',            'JavaScript'),
  (5, 'Tugas 6',    'WebMap Integration — Layer, Data Spasial & Popup',           'WebMap Fundamentals'),
  (6, 'Tugas 7',    'Spatial Feature Implementation — Heatmap/Radius/Isochrone', 'Feature Development'),
  (7, 'Tugas 8',    'Final WebGIS Project — Refinement & Deployment (Cursor AI)','Refinement & Deployment'),
  (8, 'Bonus Task', 'Python for Spatial Data — Preprocessing & Spatial Analysis','Bonus Session');

-- ═══════════════════════════════════════════════════════════════
-- 9. CONFIG SESSIONS — jadwal 17 sesi bootcamp
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_sessions CASCADE;
CREATE TABLE config_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_no    integer UNIQUE NOT NULL CHECK (session_no BETWEEN 1 AND 17),
  number_label  text NOT NULL,
  title         text NOT NULL,
  topic         text NOT NULL,
  tools         text NOT NULL,
  pic           text NOT NULL,
  outcome       text NOT NULL,
  time_label    text NOT NULL DEFAULT '19.00 - 21.30',
  session_date  text NOT NULL DEFAULT '',
  sort_order    integer NOT NULL DEFAULT 0
);
ALTER TABLE config_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_sessions" ON config_sessions FOR SELECT USING (true);
CREATE POLICY "anon write config_sessions"  ON config_sessions FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_sessions (session_no, number_label, title, topic, tools, pic, outcome, time_label, session_date, sort_order) VALUES
(1,  'Sesi 1',  'Onboarding Program',
     'Ruang pengenalan awal program: platform komunikasi, tata cara pengumpulan tugas, dan ketentuan sertifikat kelulusan.',
     'Konseptual', 'MC',
     'Mengetahui teknis program secara keseluruhan serta kesiapan mengikuti seluruh program.',
     '19.00 - 21.30', '2025-03-19', 1),
(2,  'Sesi 2',  'Get to Know WebGIS',
     'Apa itu WebGIS? Learning Journey, Industry Real Case, Potensi Karir Praktisi WebGIS.',
     'Konseptual, Pengenalan Tools Teknis', 'All Mentor',
     'Peserta memahami fundamental WebGIS, cara pembuatannya, dan potensi karir.',
     '19.00 - 21.30', '2025-03-21', 2),
(3,  'Sesi 3',  'GIS Fundamental',
     'Konsep GIS dan data spasial serta format yang bisa masuk ke WebGIS (GeoJSON, Shapefile, Raster).',
     'Konseptual dan QGIS singkat', 'Dzikri',
     'Pemahaman GIS yang seragam dan mengetahui data spasial yang bisa masuk ke WebGIS.',
     '19.00 - 21.30', '2025-03-24', 3),
(4,  'Sesi 4',  'Location Value with GEO MAPID',
     'Konsep GEO MAPID sebagai database cloud spasial: digitasi, import data, dan pengenalan API.',
     'GEO MAPID', 'Dzikri',
     'Mengetahui fungsi GEO MAPID sebagai cloud database spasial dan cara mengelola data.',
     '19.00 - 21.30', '2025-03-26', 4),
(5,  'Sesi 5',  'Introduction to VS Code, Git, HTML & CSS',
     'Workflow development dasar: VS Code, Git/GitHub, struktur HTML dasar, dan styling CSS.',
     'VS Code, HTML, CSS', 'Rifqi',
     'Mampu membuat struktur halaman web sederhana dan mengenal workflow developer modern.',
     '19.00 - 21.30', '2025-03-28', 5),
(6,  'Sesi 6',  'HTML and CSS Part 2 — Tailwind & Layouting',
     'Layouting dashboard dengan Flexbox/Grid dan CSS Tailwind. Pengenalan Stitch AI untuk visual UI.',
     'VS Code + Stitch AI, HTML, CSS, Tailwind', 'Rifqi',
     'Mampu membuat tampilan dashboard yang rapi dan siap integrasi WebGIS.',
     '19.00 - 21.30', '2025-03-31', 6),
(7,  'Sesi 7',  'JavaScript Part 1 — Fundamentals',
     'Dasar JavaScript: variable, logic, function, dan event sebagai pondasi interaksi website.',
     'VS Code, JS', 'Rifqi',
     'Mampu membuat interaksi dasar pada web.',
     '19.00 - 21.30', '2025-04-02', 7),
(8,  'Sesi 8',  'JavaScript Part 2 — DOM & Interactivity',
     'DOM manipulation dan integrasi interaksi ke elemen website.',
     'VS Code, JS', 'Rifqi',
     'Mampu mengontrol elemen web secara dinamis sebagai dasar integrasi map.',
     '19.00 - 21.30', '2025-04-04', 8),
(9,  'Sesi 9',  'Introduction JavaScript Modern',
     'JavaScript modern: async-await, fetch API data spasial, dan workflow integrasi menuju MapLibre.',
     'VS Code, JS', 'Rifqi',
     'Transisi ke implementasi JavaScript modern pada pengembangan WebGIS.',
     '19.00 - 21.30', '2025-04-07', 9),
(10, 'Sesi 10', 'Introduction to WebMap & MapLibre Part 1',
     'Konsep WebMap, cara kerja peta di web, dan inisialisasi MapLibre GL JS.',
     'MapLibre GL JS', 'Ahmad Faiz',
     'Mampu menampilkan peta dasar di web.',
     '19.00 - 21.30', '2025-04-09', 10),
(11, 'Sesi 11', 'Introduction to WebMap & MapLibre Part 2',
     'Integrasi data spasial GeoJSON/API, pengelolaan layer, dan styling peta interaktif.',
     'MapLibre + GEO MAPID API', 'Ahmad Faiz',
     'Mampu menampilkan data spasial sebagai layer di peta.',
     '19.00 - 21.30', '2025-04-11', 11),
(12, 'Sesi 12', 'Introduction to WebMap & MapLibre Part 3',
     'Interaktivitas peta: popup, event klik, kontrol map, dan pengembangan feature interaktif.',
     'MapLibre GL JS', 'Ahmad Faiz',
     'Mampu membuat peta interaktif dengan user interaction.',
     '19.00 - 21.30', '2025-04-14', 12),
(13, 'Sesi 13', 'Feature Implementation Part 1 — Heatmap',
     'Implementasi Heatmap: visualisasi densitas data spasial dan debugging workflow.',
     'MapLibre + Data API GEO', 'Ahmad Faiz',
     'Mampu membuat visualisasi heatmap dari data spasial serta memahami code review.',
     '19.00 - 21.30', '2025-04-16', 13),
(14, 'Sesi 14', 'Feature Implementation Part 2 — Radius & Isochrone',
     'Implementasi Radius/Buffer dan Isochrone Analysis via Turf JS + Cursor AI untuk troubleshooting.',
     'MapLibre + GEO API + Turf JS + Cursor AI', 'Ahmad Faiz',
     'Mampu membuat analisis radius dan memahami troubleshooting sebelum deployment.',
     '19.00 - 21.30', '2025-04-18', 14),
(15, 'Sesi 15', 'WebGIS Refinement and Deployment',
     'Deployment workflow dengan Cursor AI, pengecekan error, konfigurasi project, dan publikasi.',
     'MapLibre + Github + Cursor AI', 'Ahmad Faiz',
     'Mampu melakukan finalisasi dan deployment project WebGIS ke publik.',
     '19.00 - 21.30', '2025-04-21', 15),
(16, 'Sesi 16 (Bonus 1)', 'Python for Spatial Data',
     'Pengenalan Python untuk pengolahan data spasial sederhana dan preprocessing data WebGIS.',
     'VS Code + GEO MAPID', 'Raden Pranantya',
     'Peserta memahami penggunaan Python sederhana untuk workflow data spasial.',
     '08.30 - 11.30', '2025-04-26', 16),
(17, 'Sesi 17 (Bonus 2)', 'Spatial Analysis & Automation',
     'Explorasi spatial analysis menggunakan library Python dan data GEO MAPID.',
     'VS Code + GEO MAPID', 'Raden Pranantya',
     'Peserta memahami potensi automation dan preprocessing data spasial menggunakan Python.',
     '08.30 - 11.30', '2025-05-03', 17);

-- ═══════════════════════════════════════════════════════════════
-- 10. CONFIG MATERI — materi & video rekaman per sesi
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_materi CASCADE;
CREATE TABLE config_materi (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_no   integer UNIQUE NOT NULL,
  number_label text NOT NULL,
  title        text NOT NULL,
  category     text NOT NULL DEFAULT 'Concept',
  materi_url   text DEFAULT '',
  playlist_url text DEFAULT '',
  youtube_id   text DEFAULT '',
  topics       jsonb DEFAULT '[]'
);
ALTER TABLE config_materi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_materi" ON config_materi FOR SELECT USING (true);
CREATE POLICY "anon write config_materi"  ON config_materi FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_materi (session_no, number_label, title, category, materi_url, playlist_url, youtube_id, topics) VALUES
(1,  'Sesi 1',  'Onboarding Program',             'Concept',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Sistem administrasi program", "Tata cara pengumpulan tugas", "Ketentuan sertifikat kelulusan"]'),
(2,  'Sesi 2',  'Get to Know WebGIS',             'Concept',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Apa itu WebGIS & Learning Journey", "Industry Real Case dari Mentor", "Potensi Karir Praktisi WebGIS"]'),
(3,  'Sesi 3',  'GIS Fundamental',                'Concept',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-3',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Konsep GIS & datum koordinat (WGS84)", "Vektor vs Raster & format data spasial", "GeoJSON, Shapefile & QGIS singkat"]'),
(4,  'Sesi 4',  'Location Value with GEO MAPID',  'Concept',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-4',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Digitasi & import data spasial online", "GEO MAPID sebagai Cloud Database Spasial", "Pengenalan REST API Endpoint MAPID"]'),
(5,  'Sesi 5',  'VS Code, Git, HTML, CSS & JS',   'Frontend',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-5',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["VS Code setup & Git/GitHub workflow", "Struktur tag HTML5 dasar website", "CSS selectors, styling & Add to PATH"]'),
(6,  'Sesi 6',  'HTML and CSS Part 2',            'Frontend',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-6',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Flexbox & CSS Grid — dashboard layout", "CSS Tailwind utility classes", "Stitch AI sebagai referensi visual UI"]'),
(7,  'Sesi 7',  'JavaScript Part 1',              'Frontend',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-7',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Variable (let, const) & tipe data", "Logic, loop & conditional statement", "Function & Arrow Function ES6"]'),
(8,  'Sesi 8',  'JavaScript Part 2',              'Frontend',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-8',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["DOM Manipulation & querySelector", "addEventListener & Click/Submit events", "Dasar integrasi dinamis elemen web"]'),
(9,  'Sesi 9',  'Introduction JavaScript Modern', 'Frontend',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-9',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Async/Await & Promise handling", "Fetch API untuk data spasial GeoJSON", "Workflow integrasi modern menuju MapLibre"]'),
(10, 'Sesi 10', 'WebMap & MapLibre Part 1',       'WebMap',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-10',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Konsep WebMap & cara kerja peta di web", "Inisialisasi MapLibre GL JS", "Basemap tiles, Zoom & Center koordinat"]'),
(11, 'Sesi 11', 'WebMap & MapLibre Part 2',       'WebMap',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-11',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Integrasi data spasial GeoJSON/API", "addSource & addLayer — fill, line, circle", "Styling layer & color expressions"]'),
(12, 'Sesi 12', 'WebMap & MapLibre Part 3',       'WebMap',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-12',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Interactive Popup & setHTML", "Event klik layer & queryRenderedFeatures", "NavigationControl & map custom controls"]'),
(13, 'Sesi 13', 'Feature Implementation Part 1',  'WebMap',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-13',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Heatmap density layer & heatmap-radius", "Gradien warna & heatmap-weight atribut", "Debugging workflow & code review"]'),
(14, 'Sesi 14', 'Feature Implementation Part 2',  'WebMap',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-14',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Radius/Buffer analisis via Turf.js", "Isochrone Analysis — jangkauan jalan nyata", "Cursor AI untuk troubleshooting codebase"]'),
(15, 'Sesi 15', 'Refinement and Deployment',      'WebMap',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/session-15',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Cursor AI — deployment workflow & error check", "Netlify/GitHub Pages/Vercel deployment", "Final WebGIS portfolio-ready check"]'),
(16, 'Sesi 16 (Bonus 1)', 'Python for Spatial Data', 'Python',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/bonus-1',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Pengenalan GeoPandas & Shapely", "Pre-processing data spasial WebGIS", "gpd.read_file() & to_file() GeoJSON"]'),
(17, 'Sesi 17 (Bonus 2)', 'Spatial Analysis & Automation', 'Python',
     'https://github.com/mapid-academy/webgis-bootcamp-batch3/tree/main/bonus-2',
     'https://www.youtube.com/@mapid_official', 'dQw4w9WgXcQ',
     '["Spatial analysis library Python", "Script ETL & automation preprocessing", "Integrasi output Python ke GEO MAPID"]');

-- ═══════════════════════════════════════════════════════════════
-- 11. QUIZ QUESTIONS — soal post test per sesi
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS quiz_questions CASCADE;
CREATE TABLE quiz_questions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key    integer NOT NULL CHECK (session_key BETWEEN 1 AND 15),
  sort_order     integer NOT NULL DEFAULT 0,
  question_text  text NOT NULL DEFAULT '',
  options        jsonb NOT NULL DEFAULT '["","","",""]',
  correct_answer integer NOT NULL DEFAULT 0 CHECK (correct_answer BETWEEN 0 AND 3),
  image_url      text DEFAULT ''
);
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read quiz_questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "anon write quiz_questions"  ON quiz_questions FOR ALL USING (true) WITH CHECK (true);

INSERT INTO quiz_questions (session_key, sort_order, question_text, options, correct_answer, image_url) VALUES
(1, 1, 'Apa fungsi utama GeoJSON dalam pengembangan WebGIS?',
 '["Menyimpan data spasial berbasis JSON", "Membuat tampilan UI website", "Menghubungkan database SQL", "Mengatur hosting deployment"]', 0, ''),
(1, 2, 'Sistem koordinat mana yang paling umum digunakan dalam peta web (Google Maps, MapLibre)?',
 '["WGS 84 (EPSG:4326)", "Web Mercator (EPSG:3857)", "UTM Zone 48S", "DMS (Degrees Minutes Seconds)"]', 1, ''),
(1, 3, 'Apa yang dilakukan oleh Map Engine dalam WebGIS?',
 '["Menyimpan data spasial", "Mengatur database", "Merender peta", "Mengedit data spasial"]', 2, ''),
(1, 4, 'Dalam MapLibre, komponen yang berfungsi sebagai sumber data disebut...',
 '["Layer", "Map Object", "Source", "Event"]', 2, ''),
(1, 5, 'Metode MapLibre untuk menyembunyikan/menampilkan layer secara dinamis adalah...',
 '["map.setPaintProperty()", "map.setLayoutProperty()", "map.addLayer()", "map.addSource()"]', 1, ''),
(1, 6, 'Apa fungsi utama heatmap dalam visualisasi data spasial?',
 '["Area yang dapat dicapai dalam waktu tertentu", "Mengelompokkan titik berdekatan jadi satu simbol", "Menampilkan kepadatan data dengan gradasi warna", "Mengubah warna peta dasar"]', 2, ''),
(1, 7, 'Apa yang dilakukan cluster pada peta?',
 '["Area yang dapat dicapai dalam waktu tertentu", "Mengelompokkan titik berdekatan jadi satu simbol", "Menampilkan kepadatan data dengan gradasi warna", "Mengubah warna peta dasar"]', 1, ''),
(1, 8, 'Apa yang dimaksud dengan isochrone dalam analisis spasial?',
 '["Area yang dapat dicapai dalam waktu tertentu dari suatu titik", "Mengelompokkan titik berdekatan jadi satu simbol", "Menampilkan kepadatan data dengan gradasi warna", "Garis batas antara dua wilayah administratif"]', 0, ''),
(1, 9, 'Format file spasial native QGIS yang mendukung banyak tipe geometri dalam satu file?',
 '["Shapefile (.shp)", "GeoPackage (.gpkg)", "GeoJSON (.geojson)", "KML (.kml)"]', 1, ''),
(1, 10, 'Dalam arsitektur WebGIS, REST API Endpoint GEO MAPID berfungsi sebagai...',
 '["Framework JavaScript merender peta", "Antarmuka akses data spasial dari cloud database", "Tool deployment project ke Netlify", "Plugin QGIS untuk digitasi data"]', 1, '');

-- ═══════════════════════════════════════════════════════════════
-- 12. CONFIG SOFTWARE — daftar software & panduan instalasi
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_software CASCADE;
CREATE TABLE config_software (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  software_key  text UNIQUE NOT NULL,
  name          text NOT NULL,
  version       text NOT NULL,
  description   text NOT NULL,
  guide_steps   jsonb NOT NULL DEFAULT '[]',
  test_command  text DEFAULT '',
  download_url  text NOT NULL DEFAULT '',
  redeem_code   text DEFAULT '',
  sort_order    integer NOT NULL DEFAULT 0
);
ALTER TABLE config_software ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_software" ON config_software FOR SELECT USING (true);
CREATE POLICY "anon write config_software"  ON config_software FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_software (software_key, name, version, description, guide_steps, test_command, download_url, redeem_code, sort_order) VALUES
('qgis', 'QGIS Desktop', 'v3.28 LTR (atau terbaru)',
 'Aplikasi GIS desktop open-source untuk mengelola, menganalisis, mendigitasi, dan memformat data spasial vektor/raster.',
 '["Kunjungi situs resmi pengunduhan QGIS.", "Unduh installer QGIS LTR (Long Term Release) sesuai OS Anda.", "Jalankan installer dan selesaikan wizard instalasi dengan opsi default.", "Buka QGIS Desktop untuk memastikan aplikasi berjalan dengan baik."]',
 'qgis --version', 'https://qgis.org/en/site/forusers/download.html', '', 1),
('vscode', 'VS Code', 'Terbaru',
 'Code editor andalan developer modern untuk menulis HTML, CSS, JavaScript, MapLibre, hingga script spasial Python.',
 '["Unduh VS Code installer untuk sistem operasi Anda.", "Lakukan instalasi dan centang opsi Add to PATH (penting untuk Windows).", "Pasang ekstensi: Live Server (Ritwick Dey) dan Live Preview (Microsoft)."]',
 'code --version', 'https://code.visualstudio.com/', '', 2),
('git', 'Git & GitHub', 'Terbaru',
 'Version Control System untuk melacak perubahan kode, manajemen repositori tugas, dan deploy portfolio WebGIS.',
 '["Unduh Git Installer sesuai sistem operasi Anda.", "Gunakan konfigurasi default saat instalasi, pastikan Git CLI aktif.", "Buat akun di github.com jika belum memilikinya.", "Gunakan Git Bash atau terminal pilihan Anda untuk menguji konfigurasi."]',
 'git --version', 'https://git-scm.com/downloads', '', 3),
('geomapid', 'GEO MAPID', 'Platform Cloud Spasial',
 'Platform cloud database spasial MAPID untuk digitasi data, manajemen layer GeoJSON, dan aktivasi REST API Endpoint peta.',
 '["Kunjungi platform GEO MAPID dan buat akun baru dengan email aktif Anda.", "Setelah mendaftar, masuk ke menu Redeem Code.", "Masukkan kode akses bootcamp untuk mengaktifkan akses penuh platform.", "Eksplorasi fitur digitasi, upload GeoJSON, dan aktifkan API Endpoint data spasial Anda."]',
 '', 'https://geo.mapid.io', 'WGA262', 4);

-- ═══════════════════════════════════════════════════════════════
-- 13. CONFIG FINAL PROJECT — kriteria penilaian
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_final_project CASCADE;
CREATE TABLE config_final_project (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key  text UNIQUE NOT NULL,
  content      jsonb NOT NULL DEFAULT '{}'
);
ALTER TABLE config_final_project ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_final_project" ON config_final_project FOR SELECT USING (true);
CREATE POLICY "anon write config_final_project"  ON config_final_project FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_final_project (section_key, content) VALUES
('requirements', '{
  "title": "Output Minimum WebGIS",
  "description": "Setiap proyek akhir peserta wajib memenuhi kriteria minimum berikut untuk dinyatakan lulus:",
  "items": [
    {"title": "Landing Page / Dashboard", "desc": "Halaman web pembungkus peta yang rapi, informatif, dan responsif di mobile/tablet."},
    {"title": "WebMap Interaktif", "desc": "Peta dasar MapLibre GL JS lengkap dengan fitur navigasi zoom, panning, dan pointer."},
    {"title": "Integrasi Cloud Database Spasial", "desc": "Data peta dimuat secara dinamis menggunakan REST API Endpoint GEO MAPID pribadi."},
    {"title": "Minimal 1 Fitur Analisis Spasial", "desc": "Popup detail, Heatmap densitas, Buffer radius Turf.js, atau Isochrone Analysis."},
    {"title": "Public Live Deployment", "desc": "Aplikasi web di-deploy ke publik (Netlify / GitHub Pages / Vercel) dan dapat diakses online."}
  ]
}'),
('criteria', '{
  "title": "Fokus Penilaian Portfolio",
  "description": "Tim juri dan mentor MAPID Academy menilai proyek berdasarkan kriteria industri riil:",
  "items": [
    {"title": "Industry Relevance & Use Case", "desc": "Seberapa relevan solusi WebGIS menyelesaikan permasalahan nyata di lapangan."},
    {"title": "UI/UX & Visual Clarity", "desc": "Kerapian layout, harmoni warna peta, kenyamanan popup, dan keterbacaan data spasial."},
    {"title": "Coding Logic & Reasoning", "desc": "Struktur kode yang bersih (clean code) dan pemahaman reasoning di balik fitur."}
  ]
}');

-- ═══════════════════════════════════════════════════════════════
-- 14. CONFIG LINKS — link pendukung
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS config_links CASCADE;
CREATE TABLE config_links (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  url        text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE config_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read config_links" ON config_links FOR SELECT USING (true);
CREATE POLICY "anon write config_links"  ON config_links FOR ALL USING (true) WITH CHECK (true);

INSERT INTO config_links (title, url, sort_order) VALUES
  ('Link Discord', 'https://discord.gg/ExtsnzAm', 1),
  ('Virtual Background MAPID Academy', 'https://drive.google.com/file/d/1MLTl6-V9O1daqE4tIHKzQwN7vS93i84b/view?usp=sharing', 2),
  ('Guideline for Final Project', 'https://www.canva.com/design/DAG1G1pqIW4/yQHiCzJJDDgG1SljerKq2A/view', 3),
  ('Referensi Final Project', 'https://docs.google.com/spreadsheets/d/1zmQY6Ea_Od8TYLFqBqnjLihSCljufE3WVXiYbEaeHe8/edit', 4),
  ('Template Dokumentasi Final Project', 'https://docs.google.com/document/d/1qWdFr_LlQK3MgXb8TTLARQwsBa6MLNwD/edit', 5);

-- ═══════════════════════════════════════════════════════════════
-- 15. SEED: ATTENDANCE — sesi 1-5
-- ═══════════════════════════════════════════════════════════════
INSERT INTO attendance (participant, session_no, attended) VALUES
  ('Kalvin Reza Pratama',   1, true),  ('Kalvin Reza Pratama',   2, true),  ('Kalvin Reza Pratama',   3, true),  ('Kalvin Reza Pratama',   4, true),  ('Kalvin Reza Pratama',   5, true),
  ('Rafi Fistra Ali',       1, true),  ('Rafi Fistra Ali',       2, true),  ('Rafi Fistra Ali',       3, true),  ('Rafi Fistra Ali',       4, true),  ('Rafi Fistra Ali',       5, true),
  ('Binar Aulia Setyawan',  1, true),  ('Binar Aulia Setyawan',  2, true),  ('Binar Aulia Setyawan',  3, true),  ('Binar Aulia Setyawan',  4, true),  ('Binar Aulia Setyawan',  5, false),
  ('Athirah Hamzah',        1, true),  ('Athirah Hamzah',        2, true),  ('Athirah Hamzah',        3, true),  ('Athirah Hamzah',        4, true),  ('Athirah Hamzah',        5, true),
  ('Azya Naurah Sumakhalda',1, true),  ('Azya Naurah Sumakhalda',2, true),  ('Azya Naurah Sumakhalda',3, true),  ('Azya Naurah Sumakhalda',4, true),  ('Azya Naurah Sumakhalda',5, true),
  ('Robertho Kadji',        1, true),  ('Robertho Kadji',        2, true),  ('Robertho Kadji',        3, true),  ('Robertho Kadji',        4, true),  ('Robertho Kadji',        5, false),
  ('Rinjani Putri Djunaedi',1, true),  ('Rinjani Putri Djunaedi',2, true),  ('Rinjani Putri Djunaedi',3, true),  ('Rinjani Putri Djunaedi',4, true),  ('Rinjani Putri Djunaedi',5, true),
  ('Rizki Amara Putri',     1, true),  ('Rizki Amara Putri',     2, true),  ('Rizki Amara Putri',     3, true),  ('Rizki Amara Putri',     4, true),  ('Rizki Amara Putri',     5, true),
  ('Muhammad Thariq Aziz',  1, true),  ('Muhammad Thariq Aziz',  2, true),  ('Muhammad Thariq Aziz',  3, true),  ('Muhammad Thariq Aziz',  4, true),  ('Muhammad Thariq Aziz',  5, true),
  ('Adinda Dwi Yulianto',   1, true),  ('Adinda Dwi Yulianto',   2, true),  ('Adinda Dwi Yulianto',   3, true),  ('Adinda Dwi Yulianto',   4, true),  ('Adinda Dwi Yulianto',   5, true)
ON CONFLICT (participant, session_no) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 16. EXAM QUESTIONS — soal exam sebelum final project, 1 set soal (25 PG)
-- ═══════════════════════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════════════════════
-- 17. EXAM SCORES — hasil exam sebelum final project per peserta per attempt
-- ═══════════════════════════════════════════════════════════════
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

-- ═══════════════════════════════════════════════════════════════
-- DONE. 16 tabel, RLS, policies, seed data lengkap.
-- ═══════════════════════════════════════════════════════════════
