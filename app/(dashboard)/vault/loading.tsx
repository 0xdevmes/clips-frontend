import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="dashboard-main space-y-8 max-w-full mx-auto w-full">
      <div className="px-6 sm:px-8 pt-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-6 px-6 sm:px-8 pb-8">
        <div className="hidden lg:block w-64 shrink-0">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-full rounded-xl mb-2" />
          <Skeleton className="h-10 w-full rounded-xl mb-2" />
          <Skeleton className="h-10 w-full rounded-xl mb-2" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-[24px] p-4 flex flex-col gap-4">
                <Skeleton className="w-full aspect-square rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}