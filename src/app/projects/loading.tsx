export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="h-[48px] w-64 bg-white/10 animate-pulse mx-auto mb-4 rounded-md"></div>
        <div className="h-[24px] w-96 bg-white/10 animate-pulse mx-auto rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-panel flex flex-col animate-pulse bg-white/5 border-white/10">
            <div className="h-48 w-full bg-white/10"></div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex gap-2 mb-3">
                <div className="h-[24px] w-16 bg-white/10 rounded-md"></div>
                <div className="h-[24px] w-16 bg-white/10 rounded-md"></div>
              </div>
              <div className="h-[32px] w-3/4 bg-white/10 mb-4 rounded-md"></div>
              <div className="h-[80px] w-full bg-white/10 mb-6 rounded-md"></div>
              <div className="flex gap-4 mt-auto pt-4 border-t border-white/10">
                <div className="w-24 h-[24px] bg-white/10 rounded-md"></div>
                <div className="w-24 h-[24px] bg-white/10 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
