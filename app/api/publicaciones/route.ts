import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { publicaciones, medicos } from "@/app/lib/schema";
import { desc, eq, and, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");
  const isAdmin = searchParams.get("admin") === "true";

  try {
    // 🛡️ Filtro de visibilidad: Solo activos si no es admin
    const filtro = isAdmin ? [] : [eq(publicaciones.activo, true)];

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(publicaciones)
      .where(and(...filtro));

    // app/api/publicaciones/route.ts

    // ... dentro del GET ...
    const data = await db
      .select({
        idPublicacion: publicaciones.idPublicacion,
        tituloNoticia: publicaciones.tituloNoticia,
        resumenBajada: publicaciones.resumenBajada,
        contenidoCompleto: publicaciones.contenidoCompleto, // 👈 Asegúrate de traerlo
        fechaPublicacion: publicaciones.fechaPublicacion,
        urlImagen: publicaciones.urlImagen,
        etiquetas: publicaciones.etiquetas,
        activo: publicaciones.activo,
        idAutor: publicaciones.idAutor, // 👈 CRÍTICO: Traer el ID numérico
        nombreAutor: medicos.nombreCompleto,
      })
      .from(publicaciones)
      .leftJoin(medicos, eq(publicaciones.idAutor, medicos.idMedico))
      // ... resto del código
      .where(and(...filtro))
      .orderBy(desc(publicaciones.fechaPublicacion))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data, total: totalCount[0].count });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener lista" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 🛡️ Sincronización exacta con los NOT NULL del schema
    const nueva = await db
      .insert(publicaciones)
      .values({
        tituloNoticia: body.titulo,
        resumenBajada: body.bajada,
        contenidoCompleto: body.contenido,
        idAutor: Number(body.idAutor),
        fechaPublicacion: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        urlImagen: body.urlImagen || "/logo.png",
        etiquetas: body.etiquetas || "",
        activo: true,
      })
      .returning();

    return NextResponse.json(nueva[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear", detalle: error.message },
      { status: 500 },
    );
  }
}
