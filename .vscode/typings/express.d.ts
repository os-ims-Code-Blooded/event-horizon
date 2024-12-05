import { Express } from "express";

declare global {
  namespace Express {
      interface User {
        id: number; 
        createdAt: string;
        google_id: string;
        email: string;
        name: string;
        score: number;
        selectedDeckId: number;
        wins: number;
        losses: number;
        lastLogin: string;
      }

      interface Request {
          user?: User;
      }
  }
}