import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { clipsStore } from "./clipsStore";
import type { ApiResponse } from "../types";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const status = searchParams.get("status") || "";
  const style = searchParams.get("style") || "";
  // Optional filters
  const viralityParams = searchParams.getAll("virality");
  const virality = viralityParams.length > 0 ? viralityParams : ["high", "medium", "low"];

  // 1. Fetch user's clips
  let userClips = clipsStore.getClipsForUser(session.user.id);

  // 2. Filter
  if (status && status !== "all") {
    userClips = userClips.filter(c => c.status === status);
  }
  
  if (style && style !== "All Styles") {
    userClips = userClips.filter(c => c.style === style);
  }
  
  if (virality.length > 0 && virality.length < 3) {
    userClips = userClips.filter(c => virality.includes(c.scoreKey));
  }

  const total = userClips.length;

  // 3. Paginate
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedClips = userClips.slice(startIndex, endIndex);

  const body: ApiResponse<{ clips: typeof paginatedClips, total: number }> = {
    data: {
      clips: paginatedClips,
      total
    },
    error: null
  };

  return NextResponse.json(body);
}
