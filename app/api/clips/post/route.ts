import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PLATFORMS = ["youtube", "instagram", "tiktok", "twitter"] as const;
type Platform = (typeof ALLOWED_PLATFORMS)[number];

interface PostClipRequest {
  clipIds: string[];
  platforms: string[];
}

function mockUpload(platform: string, clipId: string): { ok: boolean; postId?: string; error?: string } {
  const success = Math.random() > 0.2; // 80% success rate for mock
  if (success) {
    return { ok: true, postId: `${platform}-${clipId}-${Date.now()}` };
  }
  return { ok: false, error: `Simulated platform error for ${platform}` };
}

export async function POST(req: NextRequest) {
  const body: PostClipRequest = await req.json().catch(() => ({ clipIds: [], platforms: [] }));

  if (!Array.isArray(body.clipIds) || body.clipIds.length === 0) {
    return NextResponse.json({ error: "clipIds must be a non-empty array" }, { status: 400 });
  }
  if (!Array.isArray(body.platforms) || body.platforms.length === 0) {
    return NextResponse.json({ error: "platforms must be a non-empty array" }, { status: 400 });
  }

  const invalid = body.platforms.filter((p) => !ALLOWED_PLATFORMS.includes(p as Platform));
  if (invalid.length > 0) {
    return NextResponse.json({ error: `Invalid platforms: ${invalid.join(", ")}` }, { status: 400 });
  }

  const posted: { clipId: string; platform: string; postId: string; url: string }[] = [];
  const failed: { clipId: string; platform: string; error: string }[] = [];

  for (const clipId of body.clipIds) {
    for (const platform of body.platforms) {
      const result = mockUpload(platform, clipId);
      if (result.ok && result.postId) {
        posted.push({
          clipId,
          platform,
          postId: result.postId,
          url: `https://${platform}.com/post/${result.postId}`,
        });
      } else {
        failed.push({ clipId, platform, error: result.error || "Unknown error" });
      }
    }
  }

  return NextResponse.json({ posted, failed });
}