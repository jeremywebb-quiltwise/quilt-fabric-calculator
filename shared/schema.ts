import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorInitials: text("author_initials").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  published: boolean("published").notNull().default(true),
});

export const quiltDesigns = pgTable("quilt_designs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gridData: text("grid_data").notNull(), // JSON string of grid state
  gridSize: integer("grid_size").notNull().default(8),
  createdAt: timestamp("created_at").notNull(),
});

export const fabricCalculations = pgTable("fabric_calculations", {
  id: serial("id").primaryKey(),
  quiltWidth: integer("quilt_width").notNull(),
  quiltHeight: integer("quilt_height").notNull(),
  blockSize: integer("block_size").notNull(),
  seamAllowance: text("seam_allowance").notNull(),
  fabricWidth: integer("fabric_width").notNull(),
  pattern: text("pattern").notNull(),
  results: text("results").notNull(), // JSON string of calculation results
  totalYards: text("total_yards").notNull(), // Total fabric yards calculated
  createdAt: timestamp("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export const insertQuiltDesignSchema = createInsertSchema(quiltDesigns).omit({
  id: true,
  createdAt: true,
});

export const insertFabricCalculationSchema = createInsertSchema(fabricCalculations).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type QuiltDesign = typeof quiltDesigns.$inferSelect;
export type InsertQuiltDesign = z.infer<typeof insertQuiltDesignSchema>;

export type FabricCalculation = typeof fabricCalculations.$inferSelect;
export type InsertFabricCalculation = z.infer<typeof insertFabricCalculationSchema>;
