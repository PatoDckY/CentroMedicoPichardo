import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { servicios } from "@/app/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const actualizado = await db.update(servicios)
      .set({
        tituloServicio: body.tituloServicio,
        descripcion: body.descripcion,
        ubicacion: body.ubicacion,
        urlImage: body.urlImage,
        textoAlt: body.textoAlt,
        disenoTipo: body.disenoTipo,
        activo: body.activo ?? true,
      })
      .where(eq(servicios.idServicio, Number(id)))
      .returning();

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Borrado lógico para FixFlow
    await db.update(servicios).set({ activo: false }).where(eq(servicios.idServicio, Number(id)));
    return NextResponse.json({ message: "Servicio desactivado" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}