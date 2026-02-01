import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';

// Cargar variables según el entorno
dotenv.config({ 
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'
});

export default defineConfig({
  schema: "./app/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});