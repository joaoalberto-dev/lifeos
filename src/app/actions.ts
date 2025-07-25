"use server";

import { desc, isNull } from "drizzle-orm";
import { db } from "~/server/db";
import { notes } from "~/server/db/schema";

export async function saveNote(content: string) {
  try {
    const result = await db
      .insert(notes)
      .values({
        content,
      })
      .returning();

    return { success: true, noteId: result[0]?.id };
  } catch (error) {
    console.error("Failed to save note:", error);
    return { success: false, error: "Failed to save note" };
  }
}

export async function getNotes() {
  try {
    const allNotes = await db
      .select()
      .from(notes)
      .where(isNull(notes.deletedAt))
      .orderBy(desc(notes.createdAt));

    return { success: true, notes: allNotes };
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return { success: false, error: "Failed to fetch notes", notes: [] };
  }
}
