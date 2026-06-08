import Link from "next/link";
import styles from "./page.module.css";
import { getProjects } from "@/actions/projects";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();
  const recentProjects = projects.slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.hero}`}>
        <img 
          src="/logo.png" 
          alt="Iota Cluster" 
          className={styles.logo}
        />
        <h1 className={styles.title}>
          Welcome to <span className="text-gradient">Iota Cluster</span>
        </h1>
        <p className={styles.subtitle}>
          The premier Artificial Intelligence and Machine Learning club at IIT Ropar. 
          We build, learn, and innovate with GenAI, RAG, and cutting-edge technologies.
        </p>
        <div className={styles.actions}>
          <Link href="/projects" className="btn-primary">
            Explore Projects
          </Link>
          <Link href="/team" className={`btn-primary ${styles.btnSecondary}`}>
            Meet the Team
          </Link>
        </div>
      </div>

      <div className={styles.featuresGrid}>
        <div className={`glass-panel ${styles.featureCard}`}>
          <h3 className={`text-gradient ${styles.featureTitle}`}>Innovation</h3>
          <p className={styles.featureDesc}>Pushing boundaries with real-time AI and live data processing hackathons.</p>
        </div>
        <div className={`glass-panel ${styles.featureCard}`}>
          <h3 className={`text-gradient ${styles.featureTitle}`}>Collaboration</h3>
          <p className={styles.featureDesc}>A community of driven students mentoring each other in AI/ML development.</p>
        </div>
        <div className={`glass-panel ${styles.featureCard}`}>
          <h3 className={`text-gradient ${styles.featureTitle}`}>Research</h3>
          <p className={styles.featureDesc}>Leading technical projects in surveillance, generative models, and more.</p>
        </div>
      </div>

      {recentProjects.length > 0 && (
        <div className={styles.projectsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Recent <span className="text-gradient">Projects</span>
            </h2>
            <Link href="/projects" className={styles.viewAllLink}>
              View All &rarr;
            </Link>
          </div>
          
          <div className={styles.projectsGrid}>
            {recentProjects.map(project => (
              <div key={project.id} className={`glass-panel ${styles.projectCard}`}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDesc}>
                  {project.description.length > 100 
                    ? project.description.substring(0, 100) + "..." 
                    : project.description}
                </p>
                <div className={styles.projectTags}>
                  {project.tags.split(',').slice(0, 3).map(tag => (
                    <span key={tag} className={styles.projectTag}>{tag.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
