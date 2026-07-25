"use client";

import React from "react";
import { Copy, Download, Link2, Share2, Sparkles, Undo2, Redo2 } from "lucide-react";

export interface SelectionFooterProps {
  count: number;
  selectedIds: string[];
  onMint: () => void;
  isMinting: boolean;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function SelectionFooter({
  count,
  onMint,
  isMinting,
  undo,
  redo,
  canUndo,
  canRedo,
}: SelectionFooterProps) {
  if (count === 0) return null;

  return (
    <div className="sticky bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[800px] w-full px-4 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Side: Count & Undo/Redo */}
        <div className="flex items-center gap-4 pl-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-black font-bold text-xs">
              {count}
            </span>
            <span className="text-sm font-medium text-white/90">
              Selected
            </span>
          </div>

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${
                canUndo ? "hover:bg-white/10 text-white" : "text-white/30 cursor-not-allowed"
              }`}
              aria-label="Undo selection"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${
                canRedo ? "hover:bg-white/10 text-white" : "text-white/30 cursor-not-allowed"
              }`}
              aria-label="Redo selection"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 pr-1 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Post</span>
          </button>
          <button
            onClick={onMint}
            disabled={isMinting}
            className="flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold bg-brand text-black hover:bg-brand-hover transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
          >
            {isMinting ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Mint as NFT
          </button>
        </div>
      </div>
    </div>
  );
}
