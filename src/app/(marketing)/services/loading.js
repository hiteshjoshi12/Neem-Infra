export default function ServicesLoading() {
  return (
    <div className="w-full min-h-screen bg-[#F7F5EF] pt-28 pb-20 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full bg-[#0E162B] py-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-36 bg-white/10 rounded-full mb-6" />
          <div className="h-10 sm:h-14 w-3/4 max-w-xl bg-white/10 rounded-2xl mb-4" />
          <div className="h-6 w-1/2 max-w-md bg-white/10 rounded-xl mb-8" />
          <div className="flex gap-4">
            <div className="h-12 w-48 bg-[#C6A24A]/40 rounded-xl" />
            <div className="h-12 w-40 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="h-8 w-64 bg-[#17213D]/10 rounded-xl mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl border border-[#E2DDD5] overflow-hidden p-6">
              <div className="h-56 w-full bg-[#17213D]/5 rounded-2xl mb-6" />
              <div className="h-6 w-1/2 bg-[#17213D]/10 rounded-lg mb-3" />
              <div className="h-4 w-3/4 bg-[#17213D]/5 rounded-lg mb-6" />
              <div className="h-11 w-full bg-[#17213D]/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
