import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { medicos } from "@/app/lib/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    // 🛡️ Preparamos la consulta base
    const query = db.select().from(medicos).orderBy(asc(medicos.nombreCompleto));

    // Si NO es admin, aplicamos el filtro de activos
    if (!isAdmin) {
      query.where(eq(medicos.activo, true));
    }

    const data = await query;
    return NextResponse.json(data);
  } catch (error: any) {
    // 🚩 IMPORTANTE: Mira tu terminal, aquí saldrá el error real (ej: "column activo does not exist")
    console.error("🔥 ERROR GET MEDICOS:", error);
    return NextResponse.json({ error: "Error al obtener el directorio", detalle: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoMedico = await db.insert(medicos).values({
      nombreCompleto: body.nombreCompleto,
      especialidad: body.especialidad,
      hospitalClinica: body.hospitalClinica || "Centro Médico Pichardo",
      direccion: body.direccion,
      urlFoto: body.urlFoto || "/default-doctor.jpg",
      activo: true,
    }).returning();

    return NextResponse.json(nuevoMedico[0], { status: 201 });
  } catch (error: any) {
    console.error("🔥 ERROR POST MEDICOS:", error);
    return NextResponse.json({ error: "No se pudo registrar", detalle: error.message }, { status: 500 });
  }
}