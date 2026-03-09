import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { cursos } from "@/app/lib/schema";
import { eq } from "drizzle-orm";

// PUT: Actualizar curso (Incluye activar/desactivar)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idCurso = Number(id);

    if (isNaN(idCurso)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const idInstructor = body.idInstructor && Number(body.idInstructor) !== 0 
      ? Number(body.idInstructor) 
      : null;

    const actualizado = await db
      .update(cursos)
      .set({
        tituloCurso: body.tituloCurso,
        descripcion: body.descripcion,
        idInstructor: idInstructor,
        categoria: body.categoria,
        fechaInicio: body.fechaInicio,
        fechaFin: body.fechaFin,
        horario: body.horario,
        modalidad: body.modalidad,
        dirigidoA: body.dirigidoA,
        cupoMaximo: body.cupoMaximo ? Number(body.cupoMaximo) : null,
        ubicacion: body.ubicacion,
        costo: body.costo ? body.costo.toString() : "0.00",
        urlImagenPortada: body.urlImagenPortada,
        activo: body.activo !== undefined ? body.activo : true,
      })
      .where(eq(cursos.idCurso, idCurso))
      .returning();

    if (!actualizado.length) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar curso" }, { status: 500 });
  }
}

// DELETE: Borrado Lógico (Ocultar)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // En lugar de borrar, cambiamos activo a false
    const ocultado = await db
      .update(cursos)
      .set({ activo: false })
      .where(eq(cursos.idCurso, Number(id)))
      .returning();

    if (!ocultado.length) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Curso ocultado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al ocultar curso" }, { status: 500 });
  }
}