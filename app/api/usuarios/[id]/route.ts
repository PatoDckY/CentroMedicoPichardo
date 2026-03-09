import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { usuarios } from "@/app/lib/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 🛡️ Solo actualizamos el rol_id
    const actualizado = await db.update(usuarios)
      .set({ rolId: body.rolId })
      .where(eq(usuarios.id, Number(id)))
      .returning();

    return NextResponse.json(actualizado[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}