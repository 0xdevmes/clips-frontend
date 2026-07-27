"use client";

import { CloudUpload } from "lucide-react";
import { useUserStore, selectUserName } from "@/app/store";
import PlanUsage from "@/components/dashboard/PlanUsage";

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const userName = useUserStore(selectUserName);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl px-6 py-5 bg-surface/50 border border-white/5">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-white">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-zinc-400 text-sm">
          Your AI engine is active and ready for clip generation & style transformations.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <PlanUsage compact />

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#00E68A] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(0,230,138,0.35)] transition hover:brightness-95"
          aria-label="Quick upload video"
        >
          <CloudUpload className="h-4 w-4" aria-hidden="true" />
          Quick Upload
        </button>
      </div>
    </header>
  );
}
