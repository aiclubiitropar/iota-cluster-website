import prisma from "@/lib/prisma";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }]
  });

  const now = new Date();

  return (
    <div className={styles.container}>
      <h1 className="text-gradient" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', textAlign: 'center', marginBottom: '1rem', fontWeight: 800 }}>Events</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        Check out our upcoming and past events.
      </p>

      {events.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No events have been added yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {events.map(event => {
            const isEnded = event.endDate ? new Date(event.endDate) < now : false;

            return (
              <div key={event.id} className={`glass-panel ${styles.card}`}>
                <div className={styles.imageWrapper}>
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className={styles.image} />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <span>No Image</span>
                    </div>
                  )}
                  {isEnded && (
                    <div className={styles.endedBadge}>Ended</div>
                  )}
                </div>
                
                <div className={styles.content}>
                  <h2 className={styles.title}>{event.title}</h2>
                  
                  <div className={styles.dates}>
                    {event.startDate && (
                      <span>Start: {new Date(event.startDate).toLocaleDateString()}</span>
                    )}
                    {event.endDate && (
                      <span>End: {new Date(event.endDate).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className={styles.links}>
                    {event.unstopUrl && (
                      <a href={event.unstopUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                        Unstop
                      </a>
                    )}
                    {event.deploymentUrl && (
                      <a href={event.deploymentUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                        Deployment
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
