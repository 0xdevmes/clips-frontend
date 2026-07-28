import { z } from "zod";

/**
 * Query parameters for GET /api/clips
 */
export const getClipsQuerySchema = z.object({
  page: z.string().optional().default("1").transform((val) => parseInt(val, 10)),
  pageSize: z.string().optional().default("20").transform((val) => parseInt(val, 10)),
  status: z.string().optional().default(""),
  style: z.string().optional().default(""),
  virality: z.array(z.string()).optional().default(["high", "medium", "low"]),
});

/**
 * Request body for POST /api/clips/post (post clips to platforms)
 */
export const postClipBodySchema = z.object({
  clipIds: z.array(z.string().min(1)).min(1, "At least one clip ID is required"),
  platforms: z.array(z.enum(["youtube", "instagram", "tiktok", "twitter"])).min(1, "At least one platform is required"),
});

/**
 * Request body for POST /api/clips/mint (mint clip as NFT)
 */
export const mintClipBodySchema = z.object({
  clipId: z.string().min(1, "Clip ID is required"),
});

/**
 * Request body for POST /api/clips (create clip)
 */
export const createClipBodySchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  title: z.string().min(1, "Title is required"),
  style: z.string().optional(),
  virality: z.enum(["high", "medium", "low"]).optional(),
});

export type GetClipsQuery = z.infer<typeof getClipsQuerySchema>;
export type PostClipBody = z.infer<typeof postClipBodySchema>;
export type MintClipBody = z.infer<typeof mintClipBodySchema>;
export type CreateClipBody = z.infer<typeof createClipBodySchema>;
