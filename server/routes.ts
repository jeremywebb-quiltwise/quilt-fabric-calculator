import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertQuiltDesignSchema, insertFabricCalculationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { search, category } = req.query;
      
      let posts;
      if (search || category) {
        posts = await storage.searchBlogPosts(
          search as string || "",
          category as string || undefined
        );
      } else {
        posts = await storage.getAllBlogPosts();
      }
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog/posts", async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Quilt design routes
  app.get("/api/designs", async (req, res) => {
    try {
      const designs = await storage.getAllQuiltDesigns();
      res.json(designs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quilt designs" });
    }
  });

  app.get("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getQuiltDesign(id);
      
      if (!design) {
        return res.status(404).json({ message: "Quilt design not found" });
      }
      
      res.json(design);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quilt design" });
    }
  });

  app.post("/api/designs", async (req, res) => {
    try {
      const validatedData = insertQuiltDesignSchema.parse(req.body);
      const design = await storage.createQuiltDesign(validatedData);
      res.status(201).json(design);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create quilt design" });
      }
    }
  });

  app.put("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertQuiltDesignSchema.partial().parse(req.body);
      const design = await storage.updateQuiltDesign(id, validatedData);
      
      if (!design) {
        return res.status(404).json({ message: "Quilt design not found" });
      }
      
      res.json(design);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update quilt design" });
      }
    }
  });

  app.delete("/api/designs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteQuiltDesign(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Quilt design not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quilt design" });
    }
  });

  // Fabric calculation routes
  app.get("/api/calculations", async (req, res) => {
    try {
      const calculations = await storage.getAllFabricCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fabric calculations" });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const calculation = await storage.getFabricCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({ message: "Fabric calculation not found" });
      }
      
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fabric calculation" });
    }
  });

  app.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertFabricCalculationSchema.parse(req.body);
      const calculation = await storage.createFabricCalculation(validatedData);
      res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create fabric calculation" });
      }
    }
  });

  // Email signup for coming soon
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Valid email address required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Store email in storage (you can extend this to use a proper email service)
      // For now, just log it and return success
      console.log(`Waitlist signup: ${email}`);
      
      // If you have SendGrid configured, you could send a welcome email here
      // const sendgrid = require('@sendgrid/mail');
      // await sendgrid.send({
      //   to: email,
      //   from: 'noreply@quiltwise.com',
      //   subject: 'Welcome to Quiltwise Design Studio Waitlist!',
      //   text: 'Thanks for joining our waitlist. We\'ll notify you when the Design Studio launches!'
      // });

      res.json({ success: true, message: "Successfully joined waitlist" });
    } catch (error: any) {
      console.error("Error adding to waitlist:", error);
      res.status(500).json({ error: "Failed to join waitlist" });
    }
  });

  // Statistics endpoint for total yards calculated
  app.get("/api/stats/total-yards", async (req, res) => {
    try {
      const totalYards = await storage.getTotalYardsCalculated();
      res.json({ totalYards: Math.round(totalYards * 100) / 100 });
    } catch (error) {
      console.error("Error fetching total yards:", error);
      res.status(500).json({ error: "Failed to fetch total yards" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
