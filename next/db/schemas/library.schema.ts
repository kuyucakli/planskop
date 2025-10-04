import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

const CATEGORY_VALUES = ["article", "book", "video"] as const;

const libraryCategoryEnum = pgEnum("category", CATEGORY_VALUES);

type LibraryCategory = (typeof CATEGORY_VALUES)[number];

const libraryTbl = pgTable("library", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  description: text("description"),
  link: text("link"),
  category: libraryCategoryEnum("category").notNull(),
});

export {
  libraryTbl,
  type LibraryCategory,
  CATEGORY_VALUES,
  libraryCategoryEnum,
};
