import projectStyles from "../projects/page.module.css";
import teamStyles from "../team/page.module.css";
import { getProjects } from "@/actions/projects";
import { getTeamMembers } from "@/actions/team";

export const dynamic = 'force-dynamic';

export default async function AISocPage() {
  const allProjects = await getProjects();
  const allMembers = await getTeamMembers();

  const aiSocProjects = allProjects.filter(p => p.isAiSoc);
  const aiSocContributors = allMembers.filter(m => m.position.toLowerCase() === "members");

  return (
    <div className={projectStyles.container}>
      <div className={projectStyles.header}>
        <h1 className={projectStyles.title}>
          <span className="text-gradient">AI Soc</span>
        </h1>
        <p className={projectStyles.subtitle}>
          Discover the AI Society at IIT Ropar - our mission, our members, and our impact.
        </p>
      </div>

      <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
        <h2 className={projectStyles.title} style={{ fontSize: '2rem' }}>
          Projects <span className="text-gradient">under AI soc</span>
        </h2>
      </div>

      {aiSocProjects.length === 0 ? (
        <div className={`glass-panel ${projectStyles.emptyState}`}>
          <p className="text-[var(--text-secondary)]">AI Soc projects are currently being updated. Check back soon!</p>
        </div>
      ) : (
        <div className={projectStyles.grid}>
          {aiSocProjects.map((project) => (
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
                  {project.tags.split(',').map(tag => (
                    <span key={tag} className={projectStyles.tag}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <h3 className={projectStyles.projectTitle}>{project.title}</h3>
                <p className={projectStyles.description}>{project.description}</p>
                
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
      )}

      <div style={{ marginTop: '4rem', marginBottom: '1rem' }}>
        <h2 className={projectStyles.title} style={{ fontSize: '2rem' }}>
          Our <span className="text-gradient">Contributors</span>
        </h2>
      </div>

      {aiSocContributors.length === 0 ? (
        <div className={`glass-panel ${projectStyles.emptyState}`}>
          <p className="text-[var(--text-secondary)]">Contributors are currently being updated. Check back soon!</p>
        </div>
      ) : (
        <div className={teamStyles.grid}>
          {aiSocContributors.map((member) => (
            <div key={member.id} className={`glass-panel ${teamStyles.card}`}>
              <div className={teamStyles.imageContainer}>
                <img
                  src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D0D17&color=8cf6eb`}
                  alt={member.name}
                  className={teamStyles.image}
                />
              </div>
              <h3 className={teamStyles.name}>{member.name}</h3>
              <p className={teamStyles.position}>{member.position}</p>
              
              <div className={teamStyles.links}>
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className={teamStyles.link}>
                    GitHub
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className={teamStyles.link}>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
