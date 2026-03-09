import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { publicaciones } from "@/app/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await db
      .select()
      .from(publicaciones)
      .where(eq(publicaciones.idPublicacion, Number(id)));
    if (!data.length)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error GET ID" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const idNum = Number(id);

    // 🕵️ DEBUG: Mira tu terminal de VS Code al presionar "Guardar"
    console.log(">>> INTENTO DE UPDATE ID:", idNum);
    console.log(">>> DATOS RECIBIDOS:", body);

    // 🛡️ VALIDACIÓN DE DATOS OBLIGATORIOS (notNull en tu Schema)
    // Extraemos los valores buscando ambos formatos (el de la DB y el del Modal)
    const updateData = {
      tituloNoticia: body.tituloNoticia || body.titulo,
      resumenBajada: body.resumenBajada || body.bajada,
      contenidoCompleto: body.contenidoCompleto || body.contenido,
      idAutor: Number(body.idAutor),
      urlImagen: body.urlImagen || body.imagenSrc || "/logo.png",
      etiquetas: body.etiquetas || "",
      activo: body.activo !== undefined ? body.activo : true,
      // Mantenemos la fecha original o la del body para no violar el notNull
      fechaPublicacion:
        body.fechaPublicacion || new Date().toISOString().split("T")[0],
    };

    // Verificamos si algún campo obligatorio quedó como NaN o undefined
    if (isNaN(updateData.idAutor)) {
      console.error("❌ ERROR: idAutor no es un número válido");
      return NextResponse.json({ error: "idAutor inválido" }, { status: 400 });
    }

    const actualizada = await db
      .update(publicaciones)
      .set(updateData) // Enviamos el objeto mapeado
      .where(eq(publicaciones.idPublicacion, idNum))
      .returning();

    if (!actualizada.length) {
      console.error("❌ ERROR: No se encontró la fila con ID", idNum);
      return NextResponse.json(
        { error: "No se encontró el registro" },
        { status: 404 },
      );
    }

    console.log("✅ EXITOSO: Registro actualizado");
    return NextResponse.json(actualizada[0]);
  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO EN API:", error.message);
    return NextResponse.json(
      {
        error: "Error interno",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // Borrado lógico: Cambiar activo a false
    await db
      .update(publicaciones)
      .set({ activo: false })
      .where(eq(publicaciones.idPublicacion, Number(id)));
    return NextResponse.json({ message: "Ocultado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error en DELETE" }, { status: 500 });
  }
}
