import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { academiaInfantil } from "@/app/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idNum = Number(id);

    if (isNaN(idNum)) {
      return NextResponse.json(
        { error: "ID de URL inválido" },
        { status: 400 },
      );
    }

    // 🛡️ LIMPIEZA DE DATOS: Si el idAutor es 0 o está vacío, lo ponemos como null
    const idAutorLimpio =
      body.idAutor && Number(body.idAutor) !== 0 ? Number(body.idAutor) : null;

    const actualizada = await db
      .update(academiaInfantil)
      .set({
        tituloGuia: body.titulo,
        descripcionCorta: body.bajada,
        descripcionLarga: body.descripcionLarga,
        idAutor: idAutorLimpio, // 👈 Usamos el valor limpio
        urlImagen: body.imagenSrc,
        etiquetas: body.etiquetas,
        activo: body.activo !== undefined ? body.activo : true,
      })
      .where(eq(academiaInfantil.id_guia, idNum))
      .returning();

    if (!actualizada.length) {
      return NextResponse.json(
        { error: "No se encontró el registro" },
        { status: 404 },
      );
    }

    return NextResponse.json(actualizada[0]);
  } catch (error: any) {
    console.error("ERROR EN PUT ACADEMIA:", error.message);
    return NextResponse.json(
      { error: "Error interno al actualizar" },
      { status: 500 },
    );
  }
}

// 🛡️ BORRADO LÓGICO (SOFT DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Cambiamos el .delete por .update
    const resultado = await db
      .update(academiaInfantil)
      .set({ activo: false }) // 👈 Simplemente lo ocultamos
      .where(eq(academiaInfantil.id_guia, Number(id)))
      .returning();

    if (!resultado.length) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Registro ocultado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al ocultar" }, { status: 500 });
  }
}
