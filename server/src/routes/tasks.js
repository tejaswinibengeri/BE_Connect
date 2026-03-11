import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

const CreateSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(2000).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
});

const UpdateSchema = z.object({
  title: z.string().trim().min(1).max(140).optional(),
  description: z.string().trim().max(2000).optional(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

tasksRouter.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
  return res.json({
    tasks: tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description ?? "",
      completed: !!t.completed,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      createdAt: t.createdAt?.toISOString?.() ?? null,
      updatedAt: t.updatedAt?.toISOString?.() ?? null,
    })),
  });
});

tasksRouter.post("/", async (req, res) => {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const task = await Task.create({
    userId: new mongoose.Types.ObjectId(req.user.id),
    title: parsed.data.title,
    description: parsed.data.description ?? "",
    completed: parsed.data.completed ?? false,
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
  });

  return res.status(201).json({
    task: {
      id: task._id.toString(),
      title: task.title,
      description: task.description ?? "",
      completed: !!task.completed,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    },
  });
});

tasksRouter.put("/:id", async (req, res) => {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", issues: parsed.error.issues });

  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid task id" });

  const update = {};
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (parsed.data.description !== undefined) update.description = parsed.data.description;
  if (parsed.data.completed !== undefined) update.completed = parsed.data.completed;
  if (parsed.data.dueDate !== undefined) update.dueDate = parsed.data.dueDate === null ? null : new Date(parsed.data.dueDate);

  const task = await Task.findOneAndUpdate({ _id: id, userId: req.user.id }, update, { new: true });
  if (!task) return res.status(404).json({ message: "Task not found" });

  return res.json({
    task: {
      id: task._id.toString(),
      title: task.title,
      description: task.description ?? "",
      completed: !!task.completed,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    },
  });
});

tasksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid task id" });

  const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.status(204).send();
});

