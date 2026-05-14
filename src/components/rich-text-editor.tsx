"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { marked } from "marked";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-text-style/color";
import { FontSize } from "@tiptap/extension-text-style/font-size";
import Placeholder from "@tiptap/extension-placeholder";

marked.setOptions({ gfm: true, breaks: true });

function toEditorHtml(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "<p></p>";
  if (/^<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return marked.parse(trimmed) as string;
}

const FONT_SIZES = [
  { label: "Piccolo", value: "14px" },
  { label: "Normale", value: "18px" },
  { label: "Grande", value: "22px" },
  { label: "Titolo", value: "28px" },
];

const COLORS = [
  { label: "Nero", value: "#1a1a1a" },
  { label: "Vino", value: "#5c1f2e" },
  { label: "Grigio", value: "#6b6b6b" },
  { label: "Crema", value: "#8a7f72" },
];

type Props = {
  name: string;
  defaultValue?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-8 rounded px-2 py-1 font-sans text-xs transition-colors ${
        active
          ? "bg-[var(--ink)] text-[var(--paper)]"
          : "text-[var(--ink-muted)] hover:bg-[var(--cream-dark)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ name, defaultValue = "" }: Props) {
  const initialHtml = useMemo(() => toEditorHtml(defaultValue), [defaultValue]);
  const [html, setHtml] = useState(initialHtml);
  const [focused, setFocused] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Placeholder.configure({
        placeholder: "Scrivi il testo dell’articolo…",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-4 font-serif text-lg leading-relaxed text-[var(--ink)] outline-none [&_p]:mb-3 [&_h1]:mb-3 [&_h1]:mt-2 [&_h1]:text-2xl [&_h2]:mb-2 [&_h2]:mt-2 [&_h2]:text-xl [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.getHTML());
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  const toolbar = (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--line)] bg-[var(--cream-dark)]/40 px-2 py-2">
      <ToolbarButton
        title="Grassetto"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        title="Corsivo"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        title="Sottolineato"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-[var(--line)]" aria-hidden />

      <label className="sr-only" htmlFor={`${name}-font-size`}>
        Dimensione testo
      </label>
      <select
        id={`${name}-font-size`}
        className="max-w-[7.5rem] border border-[var(--line)] bg-[var(--paper)] px-2 py-1 font-sans text-[11px] text-[var(--ink-muted)] outline-none focus:ring-1 focus:ring-[var(--wine)]/30"
        value={
          FONT_SIZES.find((s) => editor.isActive("textStyle", { fontSize: s.value }))
            ?.value ?? ""
        }
        onChange={(e) => {
          const v = e.target.value;
          if (!v) {
            editor.chain().focus().unsetFontSize().run();
            return;
          }
          editor.chain().focus().setFontSize(v).run();
        }}
      >
        <option value="">Dimensione</option>
        {FONT_SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <span className="mx-1 h-5 w-px bg-[var(--line)]" aria-hidden />

      <div className="flex items-center gap-1" role="group" aria-label="Colore testo">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setColor(c.value).run()}
            className={`h-6 w-6 rounded-full border ${
              editor.isActive("textStyle", { color: c.value })
                ? "border-[var(--ink)] ring-2 ring-[var(--wine)]/40"
                : "border-[var(--line)]"
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
        <label className="sr-only" htmlFor={`${name}-color`}>
          Colore personalizzato
        </label>
        <input
          id={`${name}-color`}
          type="color"
          className="h-6 w-8 cursor-pointer border border-[var(--line)] bg-transparent p-0"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        />
      </div>
    </div>
  );

  return (
    <div className="border border-[var(--line)] bg-[var(--paper)]">
      <input type="hidden" name={name} value={html} />
      {(focused || editor.state.selection.from !== editor.state.selection.to) &&
        toolbar}
      <BubbleMenu
        editor={editor}
        className="flex flex-wrap items-center gap-1 rounded border border-[var(--line)] bg-[var(--paper)] px-2 py-1.5 shadow-lg"
      >
        <ToolbarButton
          title="Grassetto"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          title="Corsivo"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          title="Sottolineato"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        {COLORS.slice(0, 3).map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setColor(c.value).run()}
            className="h-5 w-5 rounded-full border border-[var(--line)]"
            style={{ backgroundColor: c.value }}
          />
        ))}
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
