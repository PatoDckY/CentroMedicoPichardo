import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { nosotros } from "@/app/lib/schema";

export async function GET() {
  try {
    // Consultamos la tabla 'nosotros'
    const resultado = await db.select().from(nosotros).limit(1);

    // Si no hay datos, enviamos un error 404
    if (resultado.length === 0) {
      return NextResponse.json({ error: "No se encontró información de la sección" }, { status: 404 });
    }

    // Retornamos solo el primer objeto (resultado[0])
    return NextResponse.json(resultado[0]);
  } catch (error) {
    console.error("Error en API Nosotros:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los datos" },
      { status: 500 }
    );
  }
}