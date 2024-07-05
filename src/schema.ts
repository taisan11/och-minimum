import { not, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const th = sqliteTable('th', {
  thid: text('thid').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  postnum: integer('postnum').notNull(),
  created: text('created').notNull(),
  updated: text('updated').notNull(),
});

export const res = sqliteTable('res', {
    resid: text('resid').primaryKey(),
    thid: text('thid').notNull(),
    resnum: integer('resnum').notNull(),
    name: text('name').notNull(),
    message: text('message').notNull(),
})
