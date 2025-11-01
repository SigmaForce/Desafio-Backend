import {
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const movies = pgTable("movies", {
  id: uuid().primaryKey().defaultRandom(),

  title: text().notNull(),
  originalTitle: text().notNull(),
  tagline: text().notNull(),
  synopsis: text().notNull(),
  language: text().notNull(),

  releaseDate: date().notNull(),
  durationMinutes: integer().notNull(),
  status: text().notNull(),

  budget: numeric({ precision: 12, scale: 2 }),
  revenue: numeric({ precision: 12, scale: 2 }),
  profit: numeric({ precision: 12, scale: 2 }),

  votes: integer().default(0),
  rating: numeric({ precision: 4, scale: 2 }),
  ageRating: integer().default(0),

  posterUrl: text().notNull(),
  backdropUrl: text().notNull(),
  trailerUrl: text().notNull(),

  genres: text().array(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
