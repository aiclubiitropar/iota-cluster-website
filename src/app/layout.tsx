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
  metadataBase: new URL("https://iota-cluster.vercel.app"),
  title: {
    default: "Iota Cluster | AI Club of IIT Ropar",
    template: "%s | Iota Cluster",
  },
  description: "The Artificial Intelligence and Machine Learning club at the Indian Institute of Technology Ropar.",
  keywords: ["AI", "Machine Learning", "IIT Ropar", "Iota Cluster", "Artificial Intelligence", "Tech Club", "Generative AI", "RAG"],
  openGraph: {
    title: "Iota Cluster | AI Club of IIT Ropar",
    description: "The Artificial Intelligence and Machine Learning club at the Indian Institute of Technology Ropar.",
    url: "https://iota-cluster.vercel.app", // Adjust if you have a custom domain
    siteName: "Iota Cluster",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Iota Cluster Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iota Cluster | AI Club of IIT Ropar",
    description: "The Artificial Intelligence and Machine Learning club at the Indian Institute of Technology Ropar.",
    images: ["/logo.png"],
  },
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
