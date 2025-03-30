import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  certification: text("certification").notNull(),
});

export const insertRsvpSchema = createInsertSchema(rsvps).pick({
  firstName: true,
  lastName: true,
  email: true,
  certification: true,
}).extend({
  email: z.string().email().refine((email) => email.endsWith('@bu.edu'), {
    message: "Email must be a Boston University email address (@bu.edu)",
  }),
});

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;
