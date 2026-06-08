import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Iota Cluster | AI Club of IIT Ropar",
  description: "The Artificial Intelligence and Machine Learning club at the Indian Institute of Technology Ropar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Navbar />
        <main className={styles.mainContent}>
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  );
}
