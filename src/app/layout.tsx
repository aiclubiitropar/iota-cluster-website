import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Iota Cluster | AI Club of IIT Ropar",
  description: "The premier Artificial Intelligence and Machine Learning club at the Indian Institute of Technology Ropar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <nav className={`glass-panel ${styles.nav}`}>
          <div className={styles.navContainer}>
            <div className={styles.navContent}>
              <div className={styles.logoArea}>
                <Link href="/" className={styles.logoArea}>
                  <img src="/logo.png" alt="Iota Cluster Logo" className={styles.logoImage} />
                  <span className={styles.logoText} style={{ fontFamily: 'var(--font-outfit)' }}>Iota Cluster</span>
                </Link>
              </div>
              <div className={styles.navLinks}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/team" className={styles.navLink}>Team</Link>
                <Link href="/projects" className={styles.navLink}>Projects</Link>
                <Link href="/gallery" className={styles.navLink}>Gallery</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className={styles.mainContent}>
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  );
}
