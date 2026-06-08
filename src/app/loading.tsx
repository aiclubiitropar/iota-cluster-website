export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center min-h-[80vh]">
      {/* Hero Skeleton */}
      <div className="w-full max-w-[800px] h-[400px] glass-panel mb-16 animate-pulse bg-white/5 border-white/10"></div>
      
      {/* Features Skeleton Grid */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-[200px] glass-panel animate-pulse bg-white/5 border-white/10"></div>
        <div className="h-[200px] glass-panel animate-pulse bg-white/5 border-white/10"></div>
        <div className="h-[200px] glass-panel animate-pulse bg-white/5 border-white/10"></div>
      </div>
    </div>
  );
}
