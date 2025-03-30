import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRsvpSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to submit RSVP
  app.post("/api/rsvp", async (req: Request, res: Response) => {
    try {
      // Validate the request body using Zod schema
      const validationResult = insertRsvpSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details
        });
      }
      
      const rsvpData = validationResult.data;
      
      // Check if email already exists
      const existingRsvp = await storage.getRsvpByEmail(rsvpData.email);
      if (existingRsvp) {
        return res.status(409).json({ 
          message: "You have already RSVP'd with this email address" 
        });
      }
      
      // Create the RSVP
      const newRsvp = await storage.createRsvp(rsvpData);
      
      return res.status(201).json({
        message: "RSVP submitted successfully",
        data: newRsvp
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      return res.status(500).json({ 
        message: "An error occurred while submitting your RSVP" 
      });
    }
  });

  // API route to get all RSVPs (could be used for admin purposes)
  app.get("/api/rsvps", async (_req: Request, res: Response) => {
    try {
      const rsvps = await storage.getRsvps();
      return res.status(200).json(rsvps);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
      return res.status(500).json({ 
        message: "An error occurred while fetching RSVPs" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
