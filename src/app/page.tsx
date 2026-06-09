import Link from "next/link";
import styles from "./page.module.css";
import projectStyles from "./projects/page.module.css";
import { getProjects } from "@/actions/projects";
import { getGalleryImages } from "@/actions/gallery";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const allProjects = await getProjects();
  const projects = allProjects.filter(p => !p.isAiSoc);
  const recentProjects = projects.slice(0, 3);
  const galleryImages = await getGalleryImages();
  const recentGallery = galleryImages.slice(0, 8); // show max 8 images

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
          The Artificial Intelligence and Machine Learning club at IIT Ropar. 
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
          
          <div className={projectStyles.grid}>
            {recentProjects.map((project) => (
              <div key={project.id} className={`glass-panel ${projectStyles.card}`}>
                <div className={projectStyles.imageWrapper}>
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className={projectStyles.image} />
                  ) : (
                    <div className={projectStyles.placeholder}>
                      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                </div>
                <div className={projectStyles.content}>
                  <div className={projectStyles.tags}>
                    {project.tags.split(',').slice(0, 3).map(tag => (
                      <span key={tag} className={projectStyles.tag}>
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  <h3 className={projectStyles.projectTitle}>{project.title}</h3>
                  <p className={projectStyles.description}>
                    {project.description.length > 150 
                      ? project.description.substring(0, 150) + "..." 
                      : project.description}
                  </p>
                  
                  <div className={projectStyles.links}>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={projectStyles.link} title="View Source Code">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={projectStyles.link} title="Visit Live Site">
                        <span>Live Demo</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                    )}
                    {project.deploymentUrl && (
                      <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className={projectStyles.link} title="Visit Deployment">
                        <span>Visit</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentGallery.length > 0 && (
        <div className={styles.gallerySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Event <span className="text-gradient">Gallery</span>
            </h2>
          </div>
          
          <div className={styles.galleryGrid}>
            {recentGallery.map(img => (
              <div key={img.id} className={`glass-panel ${styles.galleryImageCard}`}>
                <img src={img.imageUrl} alt={img.title || "Gallery Image"} className={styles.galleryImage} />
                {img.title && <div className={styles.galleryTitle}>{img.title}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div id="contact" className={`glass-panel ${styles.contactSection}`} style={{ marginTop: '4rem', padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h2 className={styles.sectionTitle}>
          Reach us <span className="text-gradient">at</span>
        </h2>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <a href="mailto:club.iotacluster@iitrpr.ac.in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1.1rem', transition: 'color 0.2s' }} className="hover:text-[var(--accent-cyan)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>club.iotacluster@iitrpr.ac.in</span>
          </a>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://www.instagram.com/aiclub_iitrpr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', transition: 'color 0.2s' }} className="hover:text-[#E1306C]" title="Instagram">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            
            <a href="https://github.com/aiclubiitropar/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', transition: 'color 0.2s' }} className="hover:text-[var(--accent-purple)]" title="GitHub">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            
            <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', transition: 'color 0.2s' }} className="hover:text-[#0077b5]" title="LinkedIn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
