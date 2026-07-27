import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/api/types";
import {
  ANIME_SUB_STYLE_META,
  ANIME_SUB_STYLES,
  OUTLINE_THICKNESS_META,
  OUTLINE_THICKNESSES,
  BACKGROUND_STYLE_META,
  BACKGROUND_STYLES,
  type AnimeSubStyle,
  type OutlineThickness,
  type BackgroundStyle,
} from "@/app/lib/animeTransform";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Metadata about available sub-style variants (anime only, for now). */
export interface TransformStyleVariants {
  subStyles: Array<{ value: AnimeSubStyle; label: string; description: string }>;
  outlineThicknesses: Array<{ value: OutlineThickness; label: string }>;
  backgroundStyles: Array<{ value: BackgroundStyle; label: string; description: string }>;
}

export interface TransformStyle {
  /** Stable machine identifier, e.g. "anime" */
  name: string;
  /** Human-readable label, e.g. "Anime" */
  label: string;
  /** Short description shown beneath the style name */
  description: string;
  /** URL to a representative before/after thumbnail image */
  thumbnail: string;
  /** Estimated processing time in seconds */
  avgDurationSeconds: number;
  /**
   * Optional sub-style / variant metadata.
   * Only present for styles that expose tuning controls (currently just "anime").
   */
  variants?: TransformStyleVariants;
}

// ─── Style catalogue ──────────────────────────────────────────────────────────

/**
 * Static style catalogue for V1.
 *
 * In a future iteration this can be sourced from a CMS or database.
 * Thumbnails point to public assets served from /public/styles/.
 */
const STYLES: TransformStyle[] = [
  {
    name: "anime",
    label: "Anime",
    description: "Bold outlines, vivid colours, cel-shaded look",
    thumbnail: "/styles/anime.jpg",
    avgDurationSeconds: 45,
    // Expose the full tuning surface so clients can build the controls
    // without a separate round-trip.
    variants: {
      subStyles: ANIME_SUB_STYLES.map((s) => ANIME_SUB_STYLE_META[s]),
      outlineThicknesses: OUTLINE_THICKNESSES.map((t) => OUTLINE_THICKNESS_META[t]),
      backgroundStyles: BACKGROUND_STYLES.map((b) => BACKGROUND_STYLE_META[b]),
    },
  },
  {
    name: "cinematic",
    label: "Cinematic",
    description: "Film grain, colour grading, anamorphic lens flares",
    thumbnail: "/styles/cinematic.jpg",
    avgDurationSeconds: 55,
  },
  {
    name: "sketch",
    label: "Sketch",
    description: "Pencil-drawn outlines with subtle paper texture",
    thumbnail: "/styles/sketch.jpg",
    avgDurationSeconds: 38,
  },
  {
    name: "watercolor",
    label: "Watercolour",
    description: "Soft washes, blurred edges, painterly brush strokes",
    thumbnail: "/styles/watercolor.jpg",
    avgDurationSeconds: 50,
  },
  {
    name: "retro-vhs",
    label: "Retro VHS",
    description: "Scan lines, colour bleed, 80s tape-deck artefacts",
    thumbnail: "/styles/retro-vhs.jpg",
    avgDurationSeconds: 35,
  },
  {
    name: "neon-noir",
    label: "Neon Noir",
    description: "High-contrast shadows with vivid neon accent lighting",
    thumbnail: "/styles/neon-noir.jpg",
    avgDurationSeconds: 60,
  },
];

// ─── GET /api/transform/styles ────────────────────────────────────────────────

/**
 * Returns the list of available AI transformation style presets.
 *
 * Response: 200 { data: TransformStyle[], error: null }
 *
 * This endpoint is intentionally unauthenticated — style metadata is
 * public information and safe to expose without a session.
 */
export async function GET(): Promise<NextResponse<ApiResponse<TransformStyle[]>>> {
  return NextResponse.json({ data: STYLES, error: null });
}
