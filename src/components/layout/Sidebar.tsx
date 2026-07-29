"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  BookOpenCheck,
  FolderOpen,
  PlayCircle,
  Settings2,
  Trophy,
  Link2,
  Shield,
  UserCheck,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "MAIN MENU",
    items: [
      { id: "overview", name: "Dashboard Overview", icon: LayoutDashboard },
      { id: "schedule", name: "Schedule & Rules", icon: CalendarDays },
      { id: "absensi", name: "Absensi", icon: ClipboardCheck },
    ],
  },
  {
    title: "ACADEMICS",
    items: [
      { id: "quiz", name: "Post Test WebGIS", icon: BookOpenCheck },
      { id: "tasks", name: "Task Monitoring", icon: FolderOpen },
      { id: "materi", name: "Materi & Video Record", icon: PlayCircle },
    ],
  },
  {
    title: "RESOURCES",
    items: [
      { id: "software", name: "Platform & Software", icon: Settings2 },
      { id: "links", name: "Link Pendukung", icon: Link2 },
    ],
  },
  {
    title: "PORTFOLIO",
    items: [
      { id: "mentoring",     name: "Kelompok Mentoring", icon: UserCheck },
      { id: "exam",          name: "Exam",               icon: ListChecks },
      { id: "final_project", name: "Final Project",      icon: Trophy },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { id: "admin", name: "Admin Panel", icon: Shield },
    ],
  },
];

export default function Sidebar() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoContainer}>
          <svg viewBox="0 0 100 100" className={styles.logoSvg}>
            <path d="M10,50 L75,5 L80,55 Z" fill="#3884c7" />
            <path d="M10,50 L50,55 L62,85 Z" fill="#165da6" />
            <path d="M50,55 L80,55 L86,90 L62,85 Z" fill="#94cb5a" />
          </svg>
          <div className={styles.logoText}>
            <span className={styles.brandMapid}>MAPID</span>
            <span className={styles.brandAcademy}>Academy</span>
          </div>
        </div>
        <div className={styles.brandSubtitle}>WebGIS Development Bootcamp</div>
      </div>

      <nav className={styles.navigation}>
        {MENU_SECTIONS.map((section, idx) => (
          <div key={idx} className={styles.section}>
            <h4 className={styles.sectionTitle}>{section.title}</h4>
            <div className={styles.menuList}>
              {section.items.map((item) => {
                const isActive = currentTab === item.id;
                const Icon = item.icon;
                const href = item.id === "admin" ? "/admin" : `/?tab=${item.id}`;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`${styles.menuLink} ${isActive ? styles.activeLink : ""}`}
                  >
                    <span className={styles.menuIcon}>
                      <Icon size={16} />
                    </span>
                    <span className={styles.menuName}>{item.name}</span>
                    {isActive && <span className={styles.activeIndicator} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}
