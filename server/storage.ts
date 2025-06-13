import { 
  users, 
  blogPosts, 
  quiltDesigns, 
  fabricCalculations,
  type User, 
  type InsertUser,
  type BlogPost,
  type InsertBlogPost,
  type QuiltDesign,
  type InsertQuiltDesign,
  type FabricCalculation,
  type InsertFabricCalculation
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  searchBlogPosts(query: string, category?: string): Promise<BlogPost[]>;

  // Quilt design methods
  getAllQuiltDesigns(): Promise<QuiltDesign[]>;
  getQuiltDesign(id: number): Promise<QuiltDesign | undefined>;
  createQuiltDesign(design: InsertQuiltDesign): Promise<QuiltDesign>;
  updateQuiltDesign(id: number, design: Partial<InsertQuiltDesign>): Promise<QuiltDesign | undefined>;
  deleteQuiltDesign(id: number): Promise<boolean>;

  // Fabric calculation methods
  getAllFabricCalculations(): Promise<FabricCalculation[]>;
  getFabricCalculation(id: number): Promise<FabricCalculation | undefined>;
  createFabricCalculation(calculation: InsertFabricCalculation): Promise<FabricCalculation>;
  getTotalYardsCalculated(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...insertPost,
        publishedAt: new Date(),
      })
      .returning();
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount! > 0;
  }

  async searchBlogPosts(query: string, category?: string): Promise<BlogPost[]> {
    let queryBuilder = db.select().from(blogPosts);
    
    if (category) {
      queryBuilder = queryBuilder.where(eq(blogPosts.category, category));
    }
    
    const posts = await queryBuilder;
    
    if (query) {
      return posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return posts;
  }

  async getAllQuiltDesigns(): Promise<QuiltDesign[]> {
    return await db.select().from(quiltDesigns);
  }

  async getQuiltDesign(id: number): Promise<QuiltDesign | undefined> {
    const [design] = await db.select().from(quiltDesigns).where(eq(quiltDesigns.id, id));
    return design || undefined;
  }

  async createQuiltDesign(insertDesign: InsertQuiltDesign): Promise<QuiltDesign> {
    const [design] = await db
      .insert(quiltDesigns)
      .values({
        ...insertDesign,
        createdAt: new Date(),
      })
      .returning();
    return design;
  }

  async updateQuiltDesign(id: number, updateData: Partial<InsertQuiltDesign>): Promise<QuiltDesign | undefined> {
    const [design] = await db
      .update(quiltDesigns)
      .set(updateData)
      .where(eq(quiltDesigns.id, id))
      .returning();
    return design || undefined;
  }

  async deleteQuiltDesign(id: number): Promise<boolean> {
    const result = await db.delete(quiltDesigns).where(eq(quiltDesigns.id, id));
    return result.rowCount! > 0;
  }

  async getAllFabricCalculations(): Promise<FabricCalculation[]> {
    return await db.select().from(fabricCalculations);
  }

  async getFabricCalculation(id: number): Promise<FabricCalculation | undefined> {
    const [calculation] = await db.select().from(fabricCalculations).where(eq(fabricCalculations.id, id));
    return calculation || undefined;
  }

  async createFabricCalculation(insertCalculation: InsertFabricCalculation): Promise<FabricCalculation> {
    const [calculation] = await db
      .insert(fabricCalculations)
      .values({
        ...insertCalculation,
        createdAt: new Date(),
      })
      .returning();
    return calculation;
  }

  async getTotalYardsCalculated(): Promise<number> {
    // Get all fabric calculations and sum them in JavaScript since they contain fractions
    const calculations = await db.select().from(fabricCalculations);
    
    let total = 0;
    for (const calc of calculations) {
      const yards = this.parseYardsToDecimal(calc.totalYards);
      total += yards;
    }
    
    return Math.round(total * 10) / 10; // Round to 1 decimal place
  }

  private parseYardsToDecimal(yardsString: string): number {
    // Handle formats like "4 5/8", "3.5", "2 1/4", etc.
    const cleaned = yardsString.replace(/[^\d\s\/\.]/g, '').trim();
    
    // If it's just a decimal number
    if (/^\d+\.?\d*$/.test(cleaned)) {
      return parseFloat(cleaned);
    }
    
    // If it contains a fraction
    const parts = cleaned.split(/\s+/);
    let result = 0;
    
    for (const part of parts) {
      if (part.includes('/')) {
        const [numerator, denominator] = part.split('/').map(Number);
        if (denominator !== 0) {
          result += numerator / denominator;
        }
      } else {
        result += parseFloat(part) || 0;
      }
    }
    
    return result;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private quiltDesigns: Map<number, QuiltDesign>;
  private fabricCalculations: Map<number, FabricCalculation>;
  private currentUserId: number;
  private currentBlogPostId: number;
  private currentQuiltDesignId: number;
  private currentFabricCalculationId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.quiltDesigns = new Map();
    this.fabricCalculations = new Map();
    this.currentUserId = 1;
    this.currentBlogPostId = 1;
    this.currentQuiltDesignId = 1;
    this.currentFabricCalculationId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed blog posts
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Mastering the Log Cabin Block",
        excerpt: "Learn the fundamentals of creating perfect log cabin blocks with precise measurements and professional finishing techniques.",
        content: "The log cabin block is one of the most versatile and beloved patterns in quilting...",
        category: "tutorial",
        author: "Sarah Miller",
        authorInitials: "SM",
        published: true,
      },
      {
        title: "Essential Tools for Precision Cutting",
        excerpt: "Discover the must-have tools every quilter needs for accurate fabric cutting and why precision matters in your quilting projects.",
        content: "Accurate cutting is the foundation of beautiful quilting...",
        category: "tips",
        author: "Emily Johnson",
        authorInitials: "EJ",
        published: true,
      },
      {
        title: "Modern Quilting Trends for 2024",
        excerpt: "Explore the latest color palettes, patterns, and techniques that are defining modern quilting this year.",
        content: "Modern quilting continues to evolve with exciting new trends...",
        category: "inspiration",
        author: "Rachel Kim",
        authorInitials: "RK",
        published: true,
      },
      {
        title: "Color Theory for Quilters",
        excerpt: "Understanding color relationships can transform your quilting from good to extraordinary. Learn the basics of color theory.",
        content: "Color is one of the most powerful tools in a quilter's arsenal...",
        category: "tutorial",
        author: "Maria Garcia",
        authorInitials: "MG",
        published: true,
      },
      {
        title: "Flying Geese Pattern Variations",
        excerpt: "Explore creative ways to use the classic flying geese block in modern quilt designs.",
        content: "The flying geese block is a timeless pattern that offers endless possibilities...",
        category: "patterns",
        author: "Jennifer Chen",
        authorInitials: "JC",
        published: true,
      },
      {
        title: "Quilting for Beginners: Your First Project",
        excerpt: "Step-by-step guide to creating your very first quilt, from fabric selection to final binding.",
        content: "Starting your quilting journey can feel overwhelming, but with the right guidance...",
        category: "tutorial",
        author: "Lisa Anderson",
        authorInitials: "LA",
        published: true,
      },
    ];

    samplePosts.forEach(post => {
      this.createBlogPost(post);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const post: BlogPost = {
      ...insertPost,
      id,
      publishedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updateData,
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async searchBlogPosts(query: string, category?: string): Promise<BlogPost[]> {
    const allPosts = await this.getAllBlogPosts();
    const lowerQuery = query.toLowerCase();
    
    return allPosts.filter(post => {
      const matchesQuery = !query || 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery);
      
      const matchesCategory = !category || post.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  // Quilt design methods
  async getAllQuiltDesigns(): Promise<QuiltDesign[]> {
    return Array.from(this.quiltDesigns.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getQuiltDesign(id: number): Promise<QuiltDesign | undefined> {
    return this.quiltDesigns.get(id);
  }

  async createQuiltDesign(insertDesign: InsertQuiltDesign): Promise<QuiltDesign> {
    const id = this.currentQuiltDesignId++;
    const design: QuiltDesign = {
      ...insertDesign,
      id,
      createdAt: new Date(),
    };
    this.quiltDesigns.set(id, design);
    return design;
  }

  async updateQuiltDesign(id: number, updateData: Partial<InsertQuiltDesign>): Promise<QuiltDesign | undefined> {
    const existingDesign = this.quiltDesigns.get(id);
    if (!existingDesign) return undefined;

    const updatedDesign: QuiltDesign = {
      ...existingDesign,
      ...updateData,
    };
    this.quiltDesigns.set(id, updatedDesign);
    return updatedDesign;
  }

  async deleteQuiltDesign(id: number): Promise<boolean> {
    return this.quiltDesigns.delete(id);
  }

  // Fabric calculation methods
  async getAllFabricCalculations(): Promise<FabricCalculation[]> {
    return Array.from(this.fabricCalculations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getFabricCalculation(id: number): Promise<FabricCalculation | undefined> {
    return this.fabricCalculations.get(id);
  }

  async createFabricCalculation(insertCalculation: InsertFabricCalculation): Promise<FabricCalculation> {
    const id = this.currentFabricCalculationId++;
    const calculation: FabricCalculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
    };
    this.fabricCalculations.set(id, calculation);
    return calculation;
  }
}

export const storage = new DatabaseStorage();
