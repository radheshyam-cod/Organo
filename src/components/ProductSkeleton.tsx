

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[4/5] bg-gray-200" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-7 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-8" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
