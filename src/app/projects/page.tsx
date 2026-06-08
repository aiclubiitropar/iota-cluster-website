import { getProjects } from "@/actions/projects";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Our <span className="text-gradient">Projects</span>
        </h1>
        <p className={styles.subtitle}>
          Showcasing the technical excellence and innovations from the Iota Cluster.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className={`glass-panel ${styles.emptyState}`}>
          <p className="text-[var(--text-secondary)]">Projects are currently being updated. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={`glass-panel ${styles.card}`}>
              <div className={styles.imageWrapper}>
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className={styles.image} />
                ) : (
                  <div className={styles.placeholder}>
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <div className={styles.tags}>
                  {project.tags.split(',').map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
                
                <div className={styles.links}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      View Code &rarr;
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      Live Demo &rarr;
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
