"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Team", href: "/team" },
    { label: "Projects", href: "/projects" },
    { label: "Events", href: "/events" },
    { label: "Gallery", href: "/gallery" },
    { label: "Resources", href: "/resources" },
    { label: "AI Soc", href: "/ai-soc", isSpecial: true },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact Us", href: "/#contact" },
  ];

  return (
    <>
      <nav className={`glass-panel ${styles.nav}`}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>
            <div className={styles.logoArea}>
              <Link href="/" className={styles.logoArea}>
                <img src="/logo.png" alt="Iota Cluster Logo" className={styles.logoImage} />
                <span className={styles.logoText} style={{ fontFamily: 'var(--font-outfit)' }}>Iota Cluster</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className={styles.desktopNavLinks}>
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={item.isSpecial ? `${styles.navLink} ${styles.aiSocNav}` : styles.navLink}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Hamburger Button for Mobile */}
            <button 
              className={`${styles.menuButton} ${isMenuOpen ? styles.menuOpen : ""}`} 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.mobileMenuOverlayOpen : ""}`}>
        <div className={styles.mobileNavLinks}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={item.isSpecial ? `${styles.mobileNavLink} ${styles.aiSocNav}` : styles.mobileNavLink}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
