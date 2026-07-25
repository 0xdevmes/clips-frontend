"use client";

import React, { useState, useEffect } from "react";
import { X, Crop, Type, MonitorPlay, Smartphone } from "lucide-react";
import type { Clip } from "./ClipGrid";

export interface ClipEdits {
  trimStart: number;
  trimEnd: number;
  captionStyle: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
}

export interface ClipEditorModalProps {
  clip: Clip;
  onClose: () => void;
  onSave: (id: string, edits: ClipEdits) => void;
}

const CAPTION_STYLES = [
  "Bold & Dynamic",
  "Minimalist",
  "Emoji-Rich",
  "Subtitles Only"
];

export default function ClipEditorModal({ clip, onClose, onSave }: ClipEditorModalProps) {
  const [edits, setEdits] = useState<ClipEdits>({
    trimStart: 0,
    trimEnd: 100, // percentage or seconds, using percentage for demo
    captionStyle: clip.style,
    aspectRatio: clip.resolution === "1080x1920" ? "9:16" : "16:9"
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Trap focus roughly (a real implementation might use Dialog primitive)
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
      >
        {/* Left: Video Preview Area */}
        <div className="flex-1 bg-black p-6 flex flex-col items-center justify-center min-h-[300px] relative border-r border-white/10">
          <div className={`relative bg-white/5 rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center ${
            edits.aspectRatio === "9:16" ? "w-[240px] h-[426px]" : 
            edits.aspectRatio === "16:9" ? "w-[480px] h-[270px]" : "w-[300px] h-[300px]"
          }`}>
            <img src={clip.thumbnail} alt={clip.title} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/50 font-medium">Preview Area</span>
            </div>
            {/* Mock Caption Overlay */}
            <div className="absolute bottom-10 inset-x-4 text-center">
              <span className={`px-3 py-1 rounded bg-black/50 text-white font-bold ${
                edits.captionStyle === "Bold & Dynamic" ? "text-xl uppercase text-brand drop-shadow-md" : 
                edits.captionStyle === "Minimalist" ? "text-sm font-normal bg-transparent text-white/90" : 
                edits.captionStyle === "Emoji-Rich" ? "text-lg" : "text-sm"
              }`}>
                {edits.captionStyle === "Emoji-Rich" ? "🔥 Example Caption 🚀" : "Example Caption"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls Area */}
        <div className="w-full md:w-[360px] p-6 flex flex-col max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 id="editor-title" className="text-xl font-bold text-white">Edit Clip</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8 flex-1">
            {/* Trim Control */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Crop className="w-4 h-4" />
                <h3>Trim Video</h3>
              </div>
              <div className="pt-4 px-2">
                <div className="h-12 bg-white/5 rounded-lg relative">
                  <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden rounded-lg">
                    <img src={clip.thumbnail} alt="" className="w-full h-full object-cover opacity-20" />
                  </div>
                  {/* Pseudo range slider for mockup */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-brand cursor-ew-resize" />
                  <div className="absolute inset-y-0 right-0 w-1 bg-brand cursor-ew-resize" />
                  <div className="absolute inset-y-0 left-0 right-0 border-y-2 border-brand pointer-events-none" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>00:00</span>
                  <span>{clip.duration}</span>
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <MonitorPlay className="w-4 h-4" />
                <h3>Format</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "9:16", icon: Smartphone, label: "Shorts" },
                  { id: "16:9", icon: MonitorPlay, label: "Landscape" },
                  { id: "1:1", icon: Crop, label: "Square" },
                ].map((format) => {
                  const isActive = edits.aspectRatio === format.id;
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setEdits(prev => ({ ...prev, aspectRatio: format.id as ClipEdits["aspectRatio"] }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        isActive 
                          ? "bg-brand/10 border-brand text-brand" 
                          : "bg-white/5 border-transparent text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">{format.id}</span>
                      <span className="text-[10px] opacity-70">{format.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Captions Style */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Type className="w-4 h-4" />
                <h3>Caption Style</h3>
              </div>
              <div className="space-y-2">
                {CAPTION_STYLES.map((style) => {
                  const isActive = edits.captionStyle === style;
                  return (
                    <label
                      key={style}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isActive ? "bg-white/10 border-white/20" : "bg-transparent border-transparent hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name="captionStyle"
                        value={style}
                        checked={isActive}
                        onChange={() => setEdits(prev => ({ ...prev, captionStyle: style }))}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isActive ? "border-brand" : "border-white/30"
                      }`}>
                        {isActive && <div className="w-2 h-2 bg-brand rounded-full" />}
                      </div>
                      <span className={`text-sm font-medium ${isActive ? "text-white" : "text-white/70"}`}>
                        {style}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(clip.id, edits)}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-brand text-black hover:bg-brand-hover transition-colors shadow-[0_0_15px_rgba(var(--brand),0.3)]"
            >
              Save Edits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
