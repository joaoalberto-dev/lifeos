"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { getNotes } from "~/app/actions";

type Note = {
  id: number;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export type NotesListRef = {
  refreshNotes: () => void;
};

const NotesList = forwardRef<NotesListRef>((props, ref) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    const result = await getNotes();
    if (result.success) {
      setNotes(result.notes);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshNotes: () => {
      fetchNotes();
    },
  }));

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-[30px] h-1 bg-stone-300 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {notes.length === 0 ? (
        <p className="text-stone-500 text-xs">No notes yet</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="group py-2 relative cursor-pointer">
            <div className="w-[30px] h-0.5 bg-stone-400 rounded transition-all duration-200 group-hover:w-[50px]" />
            <div className="absolute left-0 top-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-stone-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
              {formatDate(note.updatedAt || note.createdAt)}
            </div>
          </div>
        ))
      )}
    </div>
  );
});

NotesList.displayName = 'NotesList';

export default NotesList;
