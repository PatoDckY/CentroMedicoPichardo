import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Solo para desarrollo local
declare global {
  var postgresClient: ReturnType<typeof postgres> | undefined;
}

function getClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida');
  }

  // Configuración para Vercel/Serverless
  if (process.env.VERCEL_ENV) {
    return postgres(connectionString, {
      prepare: false,
      ssl: 'require',
      max: 10, // Límite de conexiones para serverless
      idle_timeout: 20, // Tiempo de espera corto
    });
  }

  // Configuración para desarrollo local (con reutilización de cliente)
  if (!global.postgresClient) {
    global.postgresClient = postgres(connectionString, {
      prepare: false,
      ssl: { rejectUnauthorized: false },
    });
  }
  
  return global.postgresClient;
}

export const db = drizzle(getClient(), { schema });