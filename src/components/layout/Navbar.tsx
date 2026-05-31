import Link from 'next/link';
import { Settings } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/" className={styles.logo}>
          <h1>MAPID Academy</h1>
          <span>WEBGIS DEVELOPMENT BOOTCAMP</span>
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link href="/admin?tab=overview" className={`${styles.navLink} ${styles.adminLink}`}>
          <Settings size={14} /> Admin
        </Link>
      </div>
    </nav>
  );
}
