import Card from "@/components/ui/card";

export default function LinkHistorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3" aria-label="Loading links" aria-busy="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="rounded-xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="h-5 w-32 animate-pulse rounded bg-black/10 dark:bg-white/10" />
              <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-black/10 dark:bg-white/10" />
              <div className="mt-4 flex gap-5">
                <div className="h-3 w-24 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-black/10 dark:bg-white/10" />
              </div>
            </div>
            <div className="flex justify-end gap-1">
              {Array.from({ length: 3 }).map((__, actionIndex) => (
                <div key={actionIndex} className="h-10 w-10 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
