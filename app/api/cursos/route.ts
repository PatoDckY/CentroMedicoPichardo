import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { cursos, medicos } from "@/app/lib/schema";
import { desc, eq, and } from "drizzle-orm";

// GET: Obtener cursos (Filtrado por activo para público, todo para admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    // Filtro: Si no es admin, solo traemos lo que tenga activo = true
    const filtroActivo = isAdmin ? [] : [eq(cursos.activo, true)];

    const data = await db
      .select({
        idCurso: cursos.idCurso,
        tituloCurso: cursos.tituloCurso,
        descripcion: cursos.descripcion,
        idInstructor: cursos.idInstructor,
        instructorNombre: medicos.nombreCompleto, // Traemos el nombre del médico
        categoria: cursos.categoria,
        fechaInicio: cursos.fechaInicio,
        fechaFin: cursos.fechaFin,
        horario: cursos.horario,
        modalidad: cursos.modalidad,
        dirigidoA: cursos.dirigidoA,
        cupoMaximo: cursos.cupoMaximo,
        ubicacion: cursos.ubicacion,
        costo: cursos.costo,
        urlImagenPortada: cursos.urlImagenPortada,
        activo: cursos.activo,
      })
      .from(cursos)
      .leftJoin(medicos, eq(cursos.idInstructor, medicos.idMedico))
      .where(and(...filtroActivo))
      .orderBy(desc(cursos.idCurso));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en GET Cursos:", error);
    return NextResponse.json({ error: "Error al obtener cursos" }, { status: 500 });
  }
}

// POST: Crear un nuevo curso
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Limpieza de IDs de instructor para evitar errores de Foreign Key
    const idInstructor = body.idInstructor && Number(body.idInstructor) !== 0 
      ? Number(body.idInstructor) 
      : null;

    const nuevo = await db.insert(cursos).values({
      tituloCurso: body.tituloCurso,
      descripcion: body.descripcion || null,
      idInstructor: idInstructor,
      categoria: body.categoria || "General",
      fechaInicio: body.fechaInicio || null,
      fechaFin: body.fechaFin || null,
      horario: body.horario || null,
      modalidad: body.modalidad || "Presencial",
      dirigidoA: body.dirigidoA || "Padres",
      cupoMaximo: body.cupoMaximo ? Number(body.cupoMaximo) : 20,
      ubicacion: body.ubicacion || null,
      costo: body.costo ? body.costo.toString() : "0.00",
      urlImagenPortada: body.urlImagenPortada || "/logo.png",
      activo: true, // Nace activo por defecto
    }).returning();

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al crear curso", details: error.message }, { status: 500 });
  }
}