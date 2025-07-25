import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

// @see https://orm.drizzle.team/docs/goodies#multi-project-schema
export const createTable = pgTableCreator((name) => `lifeos_${name}`);

export const notes = createTable("note", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  content: d.text(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: d.timestamp({ withTimezone: true }),
}));
