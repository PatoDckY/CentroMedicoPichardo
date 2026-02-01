import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/app/lib/db'; // 👈 Tu conexión Drizzle
import { usuarios, roles } from '@/app/lib/schema'; // 👈 Tus tablas
import { eq } from 'drizzle-orm'; // Operador "igual"
import { otpMemoria } from '@/app/lib/otpStore'; // 👈 Nuestra memoria temporal

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Extraemos los datos INCLUYENDO el codigoVerificacion
    const { 
        codigoVerificacion, // <--- Nuevo campo obligatorio
        nombre, 
        apellidoPaterno, 
        apellidoMaterno, 
        edad, 
        sexo, 
        telefono, 
        correo, 
        contrasena 
    } = body;


    const passRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    
    if (!contrasena || contrasena.length < 8) {
        return NextResponse.json({ message: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }
    
    if (!passRegex.test(contrasena)) {
        return NextResponse.json({ message: "La contraseña es muy débil (faltan números o símbolos)." }, { status: 400 });
    }
    
    // Validar secuencias (123, abc)
    const secuencias = ["123", "234", "345", "456", "789", "abc", "qwe"];
    if (secuencias.some(s => contrasena.includes(s))) {
         return NextResponse.json({ message: "La contraseña contiene secuencias inseguras." }, { status: 400 });
    }

    const ROL_POR_DEFECTO = 1;

    // --- 🛡️ PASO 1: VALIDACIÓN PREVIA Y OTP ---

    if (!correo || !codigoVerificacion) {
        return NextResponse.json({ message: "Faltan datos (correo o código)" }, { status: 400 });
    }

    // A. Normalizar email para buscar en memoria
    const emailNormalizado = correo.trim().toLowerCase(); 

    // B. Buscar en memoria OTP
    const registroGuardado = otpMemoria.get(emailNormalizado);

    // C. Validaciones OTP
    if (!registroGuardado) {
        return NextResponse.json({ message: "El código no existe. Solicita uno nuevo." }, { status: 400 });
    }

    if (Date.now() > registroGuardado.expires) {
        otpMemoria.delete(emailNormalizado);
        return NextResponse.json({ message: "El código ha expirado." }, { status: 400 });
    }

    if (registroGuardado.code !== codigoVerificacion) {
        return NextResponse.json({ message: "Código incorrecto." }, { status: 400 });
    }

    // --- 💾 PASO 2: LÓGICA DE REGISTRO (TU CÓDIGO) ---

    // 2. Validar campos obligatorios del usuario
    if (!contrasena || !nombre) {
      return NextResponse.json(
        { message: 'Faltan datos obligatorios (nombre, contrasena)' }, 
        { status: 400 }
      );
    }

    // 3. Verificar si el usuario ya existe en la BD
    const usuariosEncontrados = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.correo, correo));

    if (usuariosEncontrados.length > 0) {
      return NextResponse.json(
        { message: 'El correo ya está registrado en el sistema' }, 
        { status: 409 }
      );
    }

    // 4. Verificar que el Rol 1 exista (Seguridad)
    const rolesEncontrados = await db
      .select()
      .from(roles)
      .where(eq(roles.id, ROL_POR_DEFECTO));

    if (rolesEncontrados.length === 0) {
      return NextResponse.json(
        { message: 'Error de configuración: El Rol "Cliente" (ID 1) no existe en la base de datos.' }, 
        { status: 500 }
      );
    }

    // 5. Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // 6. Crear usuario con Drizzle
    const nuevosUsuarios = await db.insert(usuarios).values({
        nombre,
        apellidoPaterno,
        apellidoMaterno: apellidoMaterno || null,
        edad: Number(edad),
        sexo,
        telefono,
        correo,
        contrasena: hashedPassword,
        rolId: ROL_POR_DEFECTO
    }).returning(); 

    // 7. Retornar éxito
    const usuarioCreado = nuevosUsuarios[0];
    
    // Limpiamos el código usado de la memoria
    otpMemoria.delete(emailNormalizado);

    // Quitamos la contraseña del objeto de respuesta
    const { contrasena: _, ...usuarioSinPass } = usuarioCreado;

    return NextResponse.json({
      mensaje: 'Usuario verificado y registrado exitosamente',
      usuario: usuarioSinPass
    }, { status: 201 });

  } catch (error) {
    console.error('Error al registrar:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}