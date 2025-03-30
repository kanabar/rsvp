import { rsvps, type Rsvp, type InsertRsvp } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getRsvps(): Promise<Rsvp[]>;
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getRsvpByEmail(email: string): Promise<Rsvp | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private rsvps: Map<number, Rsvp>;
  currentId: number;

  constructor() {
    this.rsvps = new Map();
    this.currentId = 1;
  }

  async getRsvps(): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values());
  }

  async getRsvpByEmail(email: string): Promise<Rsvp | undefined> {
    return Array.from(this.rsvps.values()).find(
      (rsvp) => rsvp.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = this.currentId++;
    const createdAt = new Date();
    const rsvp: Rsvp = { ...insertRsvp, id, createdAt };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }
}

export const storage = new MemStorage();
