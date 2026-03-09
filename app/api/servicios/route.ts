import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { servicios } from "@/app/lib/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    let query = db.select().from(servicios).orderBy(asc(servicios.tituloServicio));

    // Si no es admin, filtramos solo los activos
    if (!isAdmin) {
      // @ts-ignore
      query = query.where(eq(servicios.activo, true));
    }

    const data = await query;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error API Servicios:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevo = await db.insert(servicios).values({
      tituloServicio: body.tituloServicio,
      descripcion: body.descripcion,
      ubicacion: body.ubicacion,
      urlImage: body.urlImage || "/default-service.jpg",
      textoAlt: body.textoAlt || body.tituloServicio,
      disenoTipo: body.disenoTipo || "vertical",
      activo: true,
    }).returning();

    return NextResponse.json(nuevo[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}