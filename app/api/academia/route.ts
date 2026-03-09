import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { academiaInfantil, medicos } from "@/app/lib/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    // Filtro: Si no es admin, solo traemos lo que tenga activo = true
    const filtroActivo = isAdmin ? [] : [eq(academiaInfantil.activo, true)];

    const data = await db
      .select({
        id_guia: academiaInfantil.id_guia,
        titulo: academiaInfantil.tituloGuia,
        bajada: academiaInfantil.descripcionCorta,
        descripcionLarga: academiaInfantil.descripcionLarga,
        idAutor: academiaInfantil.idAutor,
        autor: medicos.nombreCompleto,
        fecha: academiaInfantil.fechaPublicacion,
        imagenSrc: academiaInfantil.urlImagen,
        etiquetas: academiaInfantil.etiquetas,
        activo: academiaInfantil.activo, // 👈 Importante para que el admin lo vea
      })
      .from(academiaInfantil)
      .leftJoin(medicos, eq(academiaInfantil.idAutor, medicos.idMedico))
      .where(and(...filtroActivo)) // 👈 Aplicamos el borrado lógico
      .orderBy(desc(academiaInfantil.fechaPublicacion));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error GET Academia" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nueva = await db
      .insert(academiaInfantil)
      .values({
        tituloGuia: body.titulo,
        descripcionCorta: body.bajada,
        descripcionLarga: body.descripcionLarga,
        idAutor: Number(body.idAutor),
        urlImagen: body.imagenSrc,
        etiquetas: body.etiquetas,
        fechaPublicacion: new Date().toISOString().split("T")[0],
        activo: true, // 👈 Nace activa por defecto
      })
      .returning();
    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error POST Academia" }, { status: 500 });
  }
}