import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { medicos } from "@/app/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await db.select().from(medicos).where(eq(medicos.idMedico, Number(id)));
    
    if (!data.length) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("🔥 ERROR GET ID MEDICOS:", error);
    return NextResponse.json({ error: "Error de servidor", detalle: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const actualizado = await db.update(medicos)
      .set({
        nombreCompleto: body.nombreCompleto,
        especialidad: body.especialidad,
        hospitalClinica: body.hospitalClinica,
        direccion: body.direccion,
        urlFoto: body.urlFoto,
        activo: body.activo ?? true,
      })
      .where(eq(medicos.idMedico, Number(id)))
      .returning();

    if (!actualizado.length) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    console.error("🔥 ERROR PUT MEDICOS:", error);
    return NextResponse.json({ error: "Error al actualizar", detalle: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.update(medicos).set({ activo: false }).where(eq(medicos.idMedico, Number(id)));
    return NextResponse.json({ message: "Médico ocultado correctamente" });
  } catch (error: any) {
    console.error("🔥 ERROR DELETE MEDICOS:", error);
    return NextResponse.json({ error: "Error al eliminar", detalle: error.message }, { status: 500 });
  }
}