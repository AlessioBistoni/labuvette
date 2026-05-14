"use client";

import Image from "next/image";
import { useId, useRef, useState, type ChangeEvent } from "react";

type Props = {
  name?: string;
  currentCover?: string | null;
};

export function CoverImagePicker({
  name = "coverFile",
  currentCover = null,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName(null);
      return;
    }
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  const displaySrc = preview ?? currentCover;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onFileChange}
      />

      {displaySrc ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden border border-[var(--line)] bg-[#0a0a0a]">
          <Image
            src={displaySrc}
            alt={preview ? "Anteprima copertina selezionata" : "Copertina attuale"}
            fill
            className="object-cover object-center"
            sizes="(max-width: 672px) 100vw, 672px"
            unoptimized={Boolean(preview)}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border border-[var(--ink)] bg-[var(--paper)] px-4 py-2.5 font-sans text-xs uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
        >
          {preview ? "Cambia immagine" : "Scegli dalle immagini"}
        </button>
        {fileName ? (
          <span className="font-sans text-xs text-[var(--ink-soft)]">{fileName}</span>
        ) : currentCover && !preview ? (
          <span className="font-sans text-xs text-[var(--ink-faint)]">
            Copertina attuale caricata
          </span>
        ) : (
          <span className="font-sans text-xs text-[var(--ink-faint)]">
            Apri la galleria o le foto del dispositivo
          </span>
        )}
      </div>
    </div>
  );
}
