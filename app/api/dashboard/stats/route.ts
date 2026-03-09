import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { usuarios, medicos, cursos, publicaciones, servicios } from "@/app/lib/schema";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    // 📊 Consultas paralelas filtrando por activo === true
    const [uCount, mCount, cCount, bCount, sCount] = await Promise.all([
      db.select({ count: sql<number>`cast(count(*) as integer)` })
        .from(usuarios)
        .where(eq(usuarios.activo, true)), // 👈 Filtro booleano corregido

      db.select({ count: sql<number>`cast(count(*) as integer)` })
        .from(medicos)
        .where(eq(medicos.activo, true)),

      db.select({ count: sql<number>`cast(count(*) as integer) `})
        .from(cursos)
        .where(eq(cursos.activo, true)),

      db.select({ count: sql<number>`cast(count(*) as integer)` })
        .from(publicaciones)
        .where(eq(publicaciones.activo, true)),

      db.select({ count: sql<number>`cast(count(*) as integer)` })
        .from(servicios)
        .where(eq(servicios.activo, true)),
    ]);

    return NextResponse.json({
      usuarios: uCount[0]?.count ?? 0,
      medicos: mCount[0]?.count ?? 0,
      cursos: cCount[0]?.count ?? 0,
      blog: bCount[0]?.count ?? 0,
      servicios: sCount[0]?.count ?? 0,
    });
  } catch (error: any) {
    console.error("🔥 Error en Dashboard API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}