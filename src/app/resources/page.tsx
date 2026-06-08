import prisma from "@/lib/prisma";
import styles from "./roadmap.module.css";

export const dynamic = 'force-dynamic';

function getYoutubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch (e) {
    return null;
  }
  return null;
}

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Learning <span className="text-gradient">Roadmap</span>
      </h1>

      {resources.length === 0 ? (
        <div className="glass-panel text-center p-8 text-[var(--text-secondary)]">
          Roadmap is currently being updated. Check back later!
        </div>
      ) : (
        <div className={styles.roadmap}>
          {resources.map((r, index) => {
            const videoId = r.youtubeUrl ? getYoutubeVideoId(r.youtubeUrl) : null;

            return (
              <div key={r.id} className={styles.node}>
                <h2 className={styles.nodeTitle}>
                  Step {index + 1}: {r.title}
                </h2>
                
                {r.description && (
                  <p className={styles.nodeDesc}>{r.description}</p>
                )}

                <div className={styles.mediaContainer}>
                  {videoId && (
                    <div className={styles.videoWrapper}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={r.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {r.fileUrls && r.fileUrls.length > 0 && (
                    <div className={styles.filesList}>
                      {r.fileUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.filePill}
                        >
                          <svg className={styles.fileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Attachment {i + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
