"use server";

import { db } from "~/server/db";
import { notes } from "~/server/db/schema";

export async function saveNote(content: string) {
  try {
    const result = await db.insert(notes).values({
      content,
    }).returning();
    
    return { success: true, noteId: result[0]?.id };
  } catch (error) {
    console.error("Failed to save note:", error);
    return { success: false, error: "Failed to save note" };
  }
}