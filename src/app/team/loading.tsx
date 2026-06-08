export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="h-[48px] w-64 bg-white/10 animate-pulse mx-auto mb-4 rounded-md"></div>
        <div className="h-[24px] w-96 bg-white/10 animate-pulse mx-auto rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col items-center animate-pulse bg-white/5 border-white/10">
            <div className="w-32 h-32 rounded-full bg-white/10 mb-4"></div>
            <div className="h-[24px] w-3/4 bg-white/10 mb-2 rounded-md"></div>
            <div className="h-[20px] w-1/2 bg-white/10 mb-6 rounded-md"></div>
            <div className="flex gap-4 mt-auto">
              <div className="w-16 h-[20px] bg-white/10 rounded-md"></div>
              <div className="w-16 h-[20px] bg-white/10 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
