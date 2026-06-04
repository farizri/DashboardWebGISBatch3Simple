import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ecpsrncpvswkszuoxrof.supabase.co",
  "sb_publishable_206gqTh16wlWSIEWlKMXYQ_UrZGpN_E"
);

const SESSIONS = [
  { session_no: 1,  number_label: "Sesi 1",       sort_order: 1,  session_date: "2026-06-05", title: "Onboarding Program",                          topic: "Ruang pengenalan awal program, meliputi platform komunikasi, tata cara pengumpulan tugas, dan ketentuan sertifikat kelulusan.", pic: "MC",                  tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 2,  number_label: "Sesi 2",       sort_order: 2,  session_date: "2026-06-08", title: "Get to Know WebGIS",                           topic: "Apa itu WebGIS? Learning Journey, Industry Real Case dari Mentor, Potensi Karir Praktisi WebGIS dan Real Case.",              pic: "All Mentor",          tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 3,  number_label: "Sesi 3",       sort_order: 3,  session_date: "2026-06-12", title: "GIS Fundamental",                              topic: "Konsep GIS dan data spasial dan format data spasial yang bisa masuk ke WebGIS: GeoJSON, Shapefile, Raster.",                 pic: "Dzikri Nashrul",      tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 4,  number_label: "Sesi 4",       sort_order: 4,  session_date: "2026-06-15", title: "Location Value with GEO MAPID",                topic: "GEO MAPID sebagai database dan pengelola data spasial: digitasi, impor data, API MAPID.",                                    pic: "Dzikri Nashrul",      tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 5,  number_label: "Sesi 5",       sort_order: 5,  session_date: "2026-06-19", title: "Introduction to VS Code, Git, HTML & CSS",    topic: "Workflow development: VS Code, Git & GitHub, struktur dasar website dengan HTML dan CSS.",                                 pic: "Rifqi Naufal",        tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 6,  number_label: "Sesi 6",       sort_order: 6,  session_date: "2026-06-22", title: "HTML and CSS Part 2 — Tailwind & Layouting",  topic: "Layouting dashboard dengan Flexbox/Grid dan Tailwind CSS. Pengenalan Stitch AI untuk inspirasi UI.",                       pic: "Rifqi Naufal",        tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 7,  number_label: "Sesi 7",       sort_order: 7,  session_date: "2026-06-26", title: "JavaScript Part 1 — Fundamentals",            topic: "Dasar JavaScript: variable, logic, function, dan event sebagai pondasi interaksi website.",                                 pic: "Rifqi Naufal",        tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 8,  number_label: "Sesi 8",       sort_order: 8,  session_date: "2026-06-29", title: "JavaScript Part 2 — DOM & Interactivity",     topic: "DOM manipulation dan integrasi interaksi ke elemen website sebagai dasar interaktivitas WebGIS.",                         pic: "Rifqi Naufal",        tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 9,  number_label: "Sesi 9",       sort_order: 9,  session_date: "2026-07-03", title: "Introduction JavaScript Modern",               topic: "Struktur code modern, async-await, dan workflow integrasi web map sebagai transisi ke MapLibre.",                          pic: "Rifqi Naufal",        tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 10, number_label: "Sesi 10",      sort_order: 10, session_date: "2026-07-06", title: "Setup Your First WebGIS Project",              topic: "NodeJS, Vite, dan MapLibre GL JS. Setup repository GitHub dan implementasi web map pertama.",                             pic: "Ahmad Zaenun Faiz",   tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 11, number_label: "Sesi 11",      sort_order: 11, session_date: "2026-07-10", title: "Dive Into MapLibre GL JS",                     topic: "Visualisasi data spasial, vector vs raster mapping, implementasi GeoJSON pada web map interaktif.",                       pic: "Ahmad Zaenun Faiz",   tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 12, number_label: "Sesi 12",      sort_order: 12, session_date: "2026-07-13", title: "Control Your WebMap",                          topic: "Fitur interaktif: popup, controls, handlers, browser gesture, dan event interaction pada peta.",                          pic: "Ahmad Zaenun Faiz",   tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 13, number_label: "Sesi 13",      sort_order: 13, session_date: "2026-07-17", title: "Use Spatial Engine Processor",                 topic: "Feature processing, workflow spatial processing, dan integrasi UI untuk spatial engine pada WebGIS.",                     pic: "Ahmad Zaenun Faiz",   tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 14, number_label: "Sesi 14",      sort_order: 14, session_date: "2026-07-20", title: "Leverage Development with AI",                 topic: "Cursor AI pada workflow development: multiple pages, code review, debugging, dan boilerplate management.",                 pic: "Ahmad Zaenun Faiz",   tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 15, number_label: "Sesi 15",      sort_order: 15, session_date: "2026-07-24", title: "Make Your WebGIS Accessible",                  topic: "Deployment modern ke public internet via GitHub Actions, monitoring pipeline, dan AI-assisted config.",                    pic: "Ahmad Zaenun Faiz",   tools: "", time_label: "19.00 - 21.30", outcome: "" },
  { session_no: 16, number_label: "Bonus 1",      sort_order: 16, session_date: "2026-07-25", title: "Python for Spatial Data",                      topic: "Pengenalan Python untuk pengolahan dan preprocessing data spasial WebGIS dengan GEO MAPID.",                             pic: "Raden Pranantya",     tools: "", time_label: "08.30 - 11.30", outcome: "" },
  { session_no: 17, number_label: "Bonus 2",      sort_order: 17, session_date: "2026-07-26", title: "Spatial Analysis & Automation",                topic: "Spatial analysis sederhana dengan library Python dan data GEO MAPID, termasuk automation preprocessing.",                 pic: "Raden Pranantya",     tools: "", time_label: "08.30 - 11.30", outcome: "" },
];

async function seed() {
  console.log("Deleting old sessions...");
  const { error: delErr } = await supabase.from("config_sessions").delete().gte("session_no", 0);
  if (delErr) { console.error("Delete error:", delErr); return; }

  console.log("Inserting 17 sessions...");
  const { error: insErr } = await supabase.from("config_sessions").insert(SESSIONS);
  if (insErr) { console.error("Insert error:", insErr); return; }

  console.log("Done! 17 sessions seeded.");
}

seed();
