import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as jose from 'jose'; 

export async function POST(req: Request) {
  try {
    const { correo, contrasena, codigoMfa } = await req.json();
    const ahora = new Date();

    // 1. BUSCAR USUARIO CON SU ROL (CORRECCIÓN AQUÍ) 🛠️
    // Usamos db.query en lugar de db.select para incluir la relación 'rol'
    const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.correo, correo),
        with: {
            rol: true // <--- ¡ESTO TRAE EL NOMBRE "admin"!
        }
    });

    // Protección contra enumeración
    if (!usuario) {
        await new Promise(r => setTimeout(r, 500)); 
        return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // 2. VERIFICAR BLOQUEO
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > ahora) {
        return NextResponse.json({ 
            message: "Cuenta bloqueada temporalmente. Intenta en 15 minutos." 
        }, { status: 423 });
    }

    // 3. VERIFICAR CONTRASEÑA
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
        const nuevosIntentos = (usuario.intentosFallidos || 0) + 1;
        let updateData: any = { intentosFallidos: nuevosIntentos };

        if (nuevosIntentos >= 3) {
            updateData.bloqueadoHasta = new Date(ahora.getTime() + 15 * 60 * 1000);
        }

        await db.update(usuarios)
            .set(updateData)
            .where(eq(usuarios.id, usuario.id));

        return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // 4. VERIFICAR MFA
    if (usuario.mfaHabilitado) {
        if (!codigoMfa) {
            return NextResponse.json({ message: "Se requiere código MFA", requireMfa: true }, { status: 403 });
        }
        // Aquí validarías el código...
    }

    // --- ÉXITO ---
    await db.update(usuarios)
        .set({ intentosFallidos: 0, bloqueadoHasta: null })
        .where(eq(usuarios.id, usuario.id));

// --- GENERAR TOKEN (Igual que antes) ---
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secreto_local');
    const token = await new jose.SignJWT({ 
        id: usuario.id, 
        rol: usuario.rolId, 
        version: usuario.versionToken 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    // 🚀 CAMBIO CLAVE: GUARDAR EN COOKIE HTTPONLY
    const cookieStore = await cookies();
    
    cookieStore.set('auth_token', token, {
        httpOnly: true, // 🔒 JavaScript no puede leerla (Anti-XSS)
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict', // 🔒 Protección contra CSRF
        maxAge: 15 * 60, // 15 minutos (segundos)
        path: '/',
    });

    // Retornamos el usuario (pero SIN el token en el cuerpo)
    const { contrasena: _, secretoMfa: __, ...usuarioSeguro } = usuario;
    
    return NextResponse.json({ 
        message: "Login exitoso", 
        usuario: usuarioSeguro 
    });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}