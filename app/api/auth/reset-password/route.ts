import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, nuevaContrasena } = await req.json();

    if (!token || !nuevaContrasena) {
        return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
    }

    // 1. Buscar usuario con ese token Y que la fecha de expiración sea MAYOR a ahora
    // Nota: gt() significa "greater than" (mayor que)
    const usuarioConToken = await db
        .select()
        .from(usuarios)
        .where(and(
            eq(usuarios.resetToken, token),
            gt(usuarios.resetTokenExpiry, new Date()) 
        ));

    if (usuarioConToken.length === 0) {
        return NextResponse.json({ message: "El enlace es inválido o ha expirado." }, { status: 400 });
    }

    const usuario = usuarioConToken[0];

    // 2. Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

    // 3. Actualizar usuario y BORRAR el token (para que no se pueda reusar)
    await db.update(usuarios)
        .set({ 
            contrasena: hashedPassword,
            resetToken: null,       // Borramos el token usado
            resetTokenExpiry: null 
        })
        .where(eq(usuarios.id, usuario.id));

    return NextResponse.json({ message: "Contraseña actualizada correctamente." });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al restablecer" }, { status: 500 });
  }
}