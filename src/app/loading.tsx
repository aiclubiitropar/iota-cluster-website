export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center min-h-[80vh]">
      {/* Hero Skeleton */}
      <div className="w-full max-w-[800px] h-[400px] glass-panel mb-16 animate-pulse bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
      
      {/* Features Skeleton Grid */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-[200px] glass-panel animate-pulse bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
        <div className="h-[200px] glass-panel animate-pulse bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
        <div className="h-[200px] glass-panel animate-pulse bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
      </div>
    </div>
  );
}
