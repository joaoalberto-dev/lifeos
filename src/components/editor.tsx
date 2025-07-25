"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, $getRoot, $createParagraphNode } from "lexical";
import { useQueryClient } from "@tanstack/react-query";
import { saveNote } from "~/app/actions";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-gray-400",
  paragraph: "mb-2",
  quote: "border-l-4 border-gray-300 pl-4 italic",
  heading: {
    h1: "text-2xl font-bold mb-4",
    h2: "text-xl font-bold mb-3",
    h3: "text-lg font-bold mb-2",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-4",
    ul: "list-disc ml-4",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
  },
};

function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) && !selection.isCollapsed()) {
      const nativeSelection = window.getSelection();
      if (nativeSelection && nativeSelection.rangeCount > 0) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 50,
        });
        setIsVisible(true);
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
      }
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const handleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const handleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-stone-800 text-white rounded-lg px-2 py-1 shadow-lg flex gap-1"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
      }}
    >
      <button
        className={`px-2 py-1 rounded text-sm font-medium hover:bg-stone-700 ${
          isBold ? "bg-stone-600" : ""
        }`}
        onClick={handleBold}
      >
        B
      </button>
      <button
        className={`px-2 py-1 rounded text-sm italic hover:bg-stone-700 ${
          isItalic ? "bg-stone-600" : ""
        }`}
        onClick={handleItalic}
      >
        I
      </button>
    </div>
  );
}

function onError(error: Error) {
  console.error(error);
}

export default function Editor() {
  const [isSaving, setIsSaving] = useState(false);

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-50 rounded-lg p-6">
      <LexicalComposer initialConfig={initialConfig}>
        <EditorContent isSaving={isSaving} setIsSaving={setIsSaving} />
      </LexicalComposer>
    </div>
  );
}

function EditorContent({ isSaving, setIsSaving }: { 
  isSaving: boolean; 
  setIsSaving: (saving: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const content = editor.getEditorState().read(() => {
        return $getRoot().getTextContent();
      });
      
      // Don't save empty notes
      if (!content.trim()) {
        setIsSaving(false);
        return;
      }
      
      const result = await saveNote(content);
      
      if (result.success) {
        console.log("Note saved successfully:", result.noteId);
        
        // Clear the editor
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append($createParagraphNode());
        });
        
        // Invalidate and refetch notes query
        await queryClient.invalidateQueries({ queryKey: ["notes"] });
      } else {
        console.error("Failed to save note:", result.error);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[400px] overflow-y-auto max-h-[400px] p-4 focus:outline-none text-stone-800" />
        }
        placeholder={
          <div className="absolute top-4 left-4 text-stone-400 pointer-events-none">
            Start writing your note...
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <FloatingToolbar />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="absolute bottom-4 right-4 w-12 h-12 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        title="Save note"
      >
        {isSaving ? (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
        )}
      </button>
    </div>
  );
}
