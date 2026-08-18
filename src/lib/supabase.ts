import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ───────────────────────────────────────────────────

export interface AttendanceRow {
  participant: string;
  session_no: number;
  attended: boolean;
}

export interface TaskSubmissionRow {
  id?: string;
  participant: string;
  task_id: number;
  task_number: string;
  task_title: string;
  url: string;
  submitted_at?: string;
}

export interface QuizScoreRow {
  id?: string;
  participant: string;
  email?: string;
  session_key: number;
  score: number;
  attempt_no?: number;
  completed_at?: string;
}

export interface FinalProjectRow {
  participant: string;
  url: string;
  github_url?: string;
  publication_url?: string;
  submitted_at?: string;
  updated_at?: string;
}

export interface ParticipantRow {
  id?: string;
  name: string;
  email: string;
  sort_order: number;
}

export interface TaskRow {
  id?: string;
  task_order: number;
  number: string;
  title: string;
  phase: string;
}

export interface SessionRow {
  id?: string;
  session_no: number;
  number_label: string;
  title: string;
  topic: string;
  tools: string;
  pic: string;
  outcome: string;
  time_label: string;
  session_date: string;
  sort_order: number;
}

export interface SessionWithStatus extends SessionRow {
  status: "Completed" | "Today" | "Upcoming";
}

export interface MateriRow {
  id?: string;
  session_no: number;
  number_label: string;
  title: string;
  category: string;
  materi_url: string;
  playlist_url: string;
  youtube_id: string;
  topics: string[];
}

export interface SoftwareRow {
  id?: string;
  software_key: string;
  name: string;
  version: string;
  description: string;
  guide_steps: string[];
  test_command: string;
  download_url: string;
  redeem_code: string;
  sort_order: number;
}

export interface FinalProjectSectionRow {
  id?: string;
  section_key: string;
  content: Record<string, unknown>;
}

export interface QuizQuestionRow {
  id?: string;
  session_key: number;
  sort_order: number;
  question_text: string;
  options: string[];
  correct_answer: number;
  image_url: string;
}

export interface LinkRow {
  id?: string;
  title: string;
  url: string;
  sort_order: number;
}

export interface ExamQuestionRow {
  id?: string;
  sort_order: number;
  question_text: string;
  options: string[];
  correct_answer: number;
  image_url: string;
}

export interface ExamScoreRow {
  id?: string;
  participant: string;
  email?: string;
  score: number;
  attempt_no?: number;
  completed_at?: string;
}

export interface QuizFeedbackRow {
  id?: string;
  participant: string;
  session_key: number;
  material_relevance: number;
  material_flow_clarity: number;
  hands_on_helpfulness: number;
  mentor_explanation: number;
  facilitator_responsiveness: number;
  webgis_project_readiness: number;
  feedback_text?: string;
  submitted_at?: string;
}
