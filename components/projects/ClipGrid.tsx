"use client";

import React from "react";

export interface ClipItem {
  id: string;
  title: string;
}

interface ClipGridProps {
  clips: ClipItem[];
  loading?: boolean;
  onSelect?: (id: string) => void;
}

export default function ClipGrid({ clips, loading }: ClipGridProps) {
  if (loading) {
    return <div data-testid="clip-grid-loading">Loading clips…</div>;
  }

  return (
    <div data-testid="clip-grid">
      {clips.map((clip) => (
        <div key={clip.id}>{clip.title}</div>
      ))}
    </div>
  );
}
