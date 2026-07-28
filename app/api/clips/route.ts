import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { clipsStore } from "./clipsStore";
import type { ApiResponse } from "../types";
import { getClipsQuerySchema } from "../schemas/index";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  
  // Validate query parameters with Zod
  const queryValidation = getClipsQuerySchema.safeParse({
    page: searchParams.get("page"),
    pageSize: searchParams.get("pageSize"),
    status: searchParams.get("status"),
    style: searchParams.get("style"),
    virality: searchParams.getAll("virality"),
  });

  if (!queryValidation.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: queryValidation.error.issues },
      { status: 400 }
    );
  }

  const { page, pageSize, status, style, virality } = queryValidation.data;

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
