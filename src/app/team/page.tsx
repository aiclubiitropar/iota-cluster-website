import { getTeamMembers } from "@/actions/team";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const allMembers = await getTeamMembers();
  const members = allMembers.filter(m => m.position.toLowerCase() !== "member");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Meet Our <span className="text-gradient">Team</span>
        </h1>
        <p className={styles.subtitle}>
          The brilliant minds driving AI innovation at IIT Ropar.
        </p>
      </div>

      {members.length === 0 ? (
        <div className={`glass-panel ${styles.emptyState}`}>
          <p className="text-[var(--text-secondary)]">Team members are currently being updated. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {members.map((member) => (
            <div key={member.id} className={`glass-panel ${styles.card}`}>
              <div className={styles.imageContainer}>
                <img
                  src={member.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D0D17&color=8cf6eb`}
                  alt={member.name}
                  className={styles.image}
                />
              </div>
              <h3 className={styles.name}>{member.name}</h3>
              <p className={styles.position}>{member.position}</p>
              
              <div className={styles.links}>
                {member.githubUrl && (
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    GitHub
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
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
