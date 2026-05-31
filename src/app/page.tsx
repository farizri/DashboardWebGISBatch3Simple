"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import ScheduleRules from "@/components/dashboard/ScheduleRules";
import AttendanceList from "@/components/dashboard/AttendanceList";
import TaskMonitoring from "@/components/dashboard/TaskMonitoring";
import PlatformSoftware from "@/components/dashboard/PlatformSoftware";
import MateriVideo from "@/components/dashboard/MateriVideo";
import F1PaddockQuiz from "@/components/dashboard/F1PaddockQuiz";
import FinalProjectComing from "@/components/dashboard/FinalProjectComing";
import LinkPendukung from "@/components/dashboard/LinkPendukung";
import styles from "./page.module.css";

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className={styles.loading}>Menghubungkan ke Paddock...</div>;
  }

  // SPA tab switcher
  switch (currentTab) {
    case "overview":
      return <DashboardOverview />;
    case "schedule":
      return <ScheduleRules />;
    case "absensi":
      return <AttendanceList />;
    case "tasks":
      return <TaskMonitoring />;
    case "materi":
      return <MateriVideo />;
    case "software":
      return <PlatformSoftware />;
    case "final_project":
      return <FinalProjectComing />;
    case "quiz":
      return <F1PaddockQuiz />;
    case "links":
      return <LinkPendukung />;
    default:
      return <DashboardOverview />;
  }
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div className={styles.loading}>Memuat Panel MAPID Academy...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
