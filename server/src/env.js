import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().min(1).default("http://localhost:5194"),
});

export const env = EnvSchema.parse(process.env);

