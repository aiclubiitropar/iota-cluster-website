"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/auth";
import styles from "./page.module.css";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await loginAdmin(formData);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.loginBox}`}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Secure access for Iota Cluster</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form action={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={styles.input} 
              required 
              placeholder="user@iitrpr.ac.in"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="position" className={styles.label}>Position</label>
            <select 
              id="position" 
              name="position" 
              className={styles.input} 
              required
            >
              <option value="">Select a Position</option>
              <option value="Secretary">Secretary</option>
              <option value="Representative">Representative</option>
              <option value="Mentors">Mentors</option>
              <option value="Coordinators">Coordinators</option>
              <option value="Members">Members</option>
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className={styles.input} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
