import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { ActivityPhoto } from "@/lib/gallery-types";

interface LightboxProps {
  photos: ActivityPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = photos[index];

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-primary/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-4 text-primary-foreground/80">
        <p className="text-xs font-semibold uppercase tracking-[0.22em]">
          {index + 1} / {photos.length}
        </p>
        <button
          onClick={onClose}
          aria-label="Tutup pratinjau"
          className="rounded-full border border-primary-foreground/20 p-2 transition-colors hover:bg-primary-foreground/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-6 pb-4"
        onClick={(event) => event.stopPropagation()}
      >
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            aria-label="Foto sebelumnya"
            className="absolute left-4 z-10 rounded-full border border-primary-foreground/20 p-3 text-primary-foreground transition-colors hover:bg-primary-foreground/10 md:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <img
          src={photo.image_url}
          alt={photo.caption || "Foto kegiatan"}
          className="max-h-[72vh] max-w-full rounded-xl object-contain shadow-lift"
        />

        {photos.length > 1 && (
          <button
            onClick={goNext}
            aria-label="Foto berikutnya"
            className="absolute right-4 z-10 rounded-full border border-primary-foreground/20 p-3 text-primary-foreground transition-colors hover:bg-primary-foreground/10 md:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {photo.caption && (
        <p
          className="px-6 pb-8 text-center font-serif text-lg italic text-primary-foreground/85"
          onClick={(event) => event.stopPropagation()}
        >
          {photo.caption}
        </p>
      )}
    </div>
  );
}