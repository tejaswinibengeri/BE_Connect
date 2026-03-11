import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { signAccessToken } from "../utils/jwt.js";

export const authRouter = Router();

const SignupSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(200),
});

const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

authRouter.post("/signup", async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { name, email, password } = parsed.data;
  const existing = await User.findOne({ email }).lean();
  if (existing) return res.status(409).json({ message: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = signAccessToken({ sub: user._id.toString() });
  return res.status(201).json({
    token,
    user: { id: user._id.toString(), name: user.name ?? "", email: user.email },
  });
});

authRouter.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signAccessToken({ sub: user._id.toString() });
  return res.json({
    token,
    user: { id: user._id.toString(), name: user.name ?? "", email: user.email },
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(401).json({ message: "Invalid token" });
  return res.json({ user: { id: user._id.toString(), name: user.name ?? "", email: user.email } });
});

