"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { Play, Copy, Check, RotateCcw, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, rectangularSelection, crosshairCursor } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

type Language = "javascript" | "typescript" | "python" | "html" | "css" | "jsx" | "tsx";

interface CodeBlockProps {
  code: string;
  language?: Language;
  readOnly?: boolean;
  onChange?: (code: string) => void;
  onRun?: (code: string) => void;
  output?: string;
  className?: string;
}

const LANGUAGE_MAP: Record<Language, ReturnType<typeof javascript>> = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  python: python(),
  html: html(),
  css: css(),
  jsx: javascript({ jsx: true }),
  tsx: javascript({ jsx: true, typescript: true }),
};

function createLightTheme() {
  return EditorView.theme({
    "&": {
      backgroundColor: "var(--surface-card)",
      color: "var(--text-primary)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--surface-sunken)",
      color: "var(--text-tertiary)",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(37, 99, 235, 0.08)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(37, 99, 235, 0.04)",
    },
    ".cm-cursor": {
      borderLeftColor: "var(--color-accent-500, #2563eb)",
    },
    ".cm-selectionBackground, .cm-focused .cm-selectionBackground": {
      backgroundColor: "rgba(37, 99, 235, 0.15)",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(37, 99, 235, 0.12)",
      outline: "1px solid rgba(37, 99, 235, 0.3)",
    },
    "&.cm-focused": {
      outline: "none",
    },
  });
}

const COMPARTMENT_THEME = new Compartment();
const COMPARTMENT_LANG = new Compartment();
const COMPARTMENT_READONLY = new Compartment();

export default function CodeBlock({
  code: initialCode,
  language = "javascript",
  readOnly = false,
  onChange,
  onRun,
  output,
  className,
}: CodeBlockProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [copied, setCopied] = useState(false);
  const [ran, setRan] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Create editor — intentionally runs once; external system pattern
  useEffect(() => {
    if (!editorRef.current) return;
    if (viewRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        onChange(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        drawSelection(),
        rectangularSelection(),
        crosshairCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        history(),
        foldGutter(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...foldKeymap,
          indentWithTab,
        ]),
        EditorView.lineWrapping,
        updateListener,
        COMPARTMENT_THEME.of(isDark ? oneDark : createLightTheme()),
        COMPARTMENT_LANG.of(LANGUAGE_MAP[language] || javascript()),
        COMPARTMENT_READONLY.of(EditorState.readOnly.of(readOnly)),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme when dark/light changes
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: COMPARTMENT_THEME.reconfigure(isDark ? oneDark : createLightTheme()),
    });
  }, [isDark]);

  // Update language
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: COMPARTMENT_LANG.reconfigure(LANGUAGE_MAP[language] || javascript()),
    });
  }, [language]);

  // Update readOnly
  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: COMPARTMENT_READONLY.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  }, [readOnly]);

  const getCode = useCallback(() => {
    return viewRef.current?.state.doc.toString() || "";
  }, []);

  const handleCopy = async () => {
    const code = getCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (onRun) {
      onRun(getCode());
      setRan(true);
      setTimeout(() => setRan(false), 2000);
    }
  };

  const handleReset = () => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      changes: { from: 0, to: viewRef.current.state.doc.length, insert: initialCode },
    });
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border-default bg-surface-card", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border-default px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRun && (
            <button
              onClick={handleRun}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-text-on-accent transition-all hover:bg-accent-600 active:scale-[0.97]"
              aria-label="Run code"
            >
              {ran ? (
                <>
                  <Check size={12} /> Running
                </>
              ) : (
                <>
                  <Play size={12} /> Run
                </>
              )}
            </button>
          )}
          {!readOnly && (
            <button
              onClick={handleReset}
              className="rounded-lg px-2 py-1.5 text-text-tertiary transition-colors hover:text-text-primary hover:bg-surface-card-hover"
              aria-label="Reset code"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="rounded-lg px-2 py-1.5 text-text-tertiary transition-colors hover:text-text-primary hover:bg-surface-card-hover"
            aria-label="Copy code"
          >
            {copied ? <Check size={14} className="text-accent-green" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="grid md:grid-cols-2">
        <div
          ref={editorRef}
          className="overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono [&_.cm-scroller]:text-sm"
        />

        {/* Output panel */}
        {output !== undefined && (
          <div className="border-t border-border-default md:border-t-0 md:border-l border-border-default">
            <div className="border-b border-border-default px-4 py-2">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Output
              </span>
            </div>
            <pre className="overflow-auto p-4 font-mono text-sm leading-relaxed text-text-primary">
              {output || (
                <span className="text-text-tertiary italic">
                  Click Run to see output
                </span>
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
