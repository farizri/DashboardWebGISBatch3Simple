import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ecpsrncpvswkszuoxrof.supabase.co",
  "sb_publishable_206gqTh16wlWSIEWlKMXYQ_UrZGpN_E"
);

async function reset() {
  console.log("Menghapus semua data absensi...");
  const { error: e1 } = await supabase.from("attendance").delete().gte("session_no", 0);
  if (e1) { console.error("Error absensi:", e1); } else { console.log("✓ Attendance cleared"); }

  console.log("Menghapus semua data quiz scores (post test)...");
  const { error: e2 } = await supabase.from("quiz_scores").delete().gte("session_key", 0);
  if (e2) { console.error("Error quiz scores:", e2); } else { console.log("✓ Quiz scores cleared"); }

  console.log("\nDone! Checklist absensi dan post test sudah direset ke netral.");
}

reset();
