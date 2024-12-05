import express, { Request, Response } from 'express';

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

interface AuthRequest extends Request {
  user?: User
}

export { User, AuthRequest };