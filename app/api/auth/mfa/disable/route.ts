import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { userId, contrasena } = await req.json();

    if (!userId || !contrasena) {
        return NextResponse.json({ message: "Faltan datos." }, { status: 400 });
    }

    // 1. Buscar usuario para obtener su contraseña encriptada
    const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.id, userId)
    });

    if (!usuario) {
        return NextResponse.json({ message: "Usuario no encontrado." }, { status: 404 });
    }

    // 2. VERIFICAR LA CONTRASEÑA (Medida de seguridad crítica)
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
        return NextResponse.json({ message: "Contraseña incorrecta. No se realizaron cambios." }, { status: 401 });
    }

    // 3. DESACTIVAR MFA
    // Borramos el secreto y ponemos el flag en false
    await db.update(usuarios)
        .set({ 
            mfaHabilitado: false,
            secretoMfa: null // Opcional: Borrar el secreto para obligar a reconfigurar desde cero si vuelve a activar
        })
        .where(eq(usuarios.id, userId));

    return NextResponse.json({ message: "Autenticación de 2 factores DESACTIVADA." });

  } catch (error) {
    console.error("Error desactivando MFA:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}