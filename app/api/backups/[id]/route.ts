import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { readFileSync, unlinkSync } from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/backups/[id] - Descargar archivo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`GET /api/backups/${id} - Solicitando descarga`);

    const result = await pool.query(
      'SELECT archivo_url FROM backups WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`GET /api/backups/${id} - Backup no encontrado en BD`);
      return NextResponse.json(
        { error: 'Backup no encontrado' },
        { status: 404 }
      );
    }

    let archivoUrl = result.rows[0].archivo_url;
    console.log(`GET /api/backups/${id} - archivo_url desde BD: "${archivoUrl}"`);

    // Eliminar barra inicial si existe
    if (archivoUrl.startsWith('/')) {
      archivoUrl = archivoUrl.substring(1);
    }

    const fullPath = path.join(process.cwd(), 'public', archivoUrl);
    console.log(`GET /api/backups/${id} - Ruta completa del archivo: ${fullPath}`);

    const fileContent = readFileSync(fullPath);
    console.log(`GET /api/backups/${id} - Archivo leído correctamente, tamaño: ${fileContent.length} bytes`);

    return new NextResponse(fileContent, {
      headers: {
        'Content-Disposition': `attachment; filename="backup-${id}.sql"`,
        'Content-Type': 'application/sql',
      },
    });
  } catch (error) {
    console.error('Error en GET /api/backups/[id]:', error);
    return NextResponse.json(
      { error: 'Error al descargar el archivo' },
      { status: 500 }
    );
  }
}

// DELETE /api/backups/[id] - Eliminar backup
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`DELETE /api/backups/${id} - Solicitando eliminación`);

    const result = await pool.query(
      'SELECT archivo_url FROM backups WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`DELETE /api/backups/${id} - Backup no encontrado en BD`);
      return NextResponse.json(
        { error: 'Backup no encontrado' },
        { status: 404 }
      );
    }

    let archivoUrl = result.rows[0].archivo_url;
    console.log(`DELETE /api/backups/${id} - archivo_url desde BD: "${archivoUrl}"`);

    if (archivoUrl.startsWith('/')) {
      archivoUrl = archivoUrl.substring(1);
    }

    const fullPath = path.join(process.cwd(), 'public', archivoUrl);
    console.log(`DELETE /api/backups/${id} - Ruta completa del archivo: ${fullPath}`);

    try {
      unlinkSync(fullPath);
      console.log(`DELETE /api/backups/${id} - Archivo eliminado correctamente`);
    } catch (e) {
      console.warn(`DELETE /api/backups/${id} - No se pudo eliminar el archivo:`, (e as Error).message);
    }

    await pool.query('DELETE FROM backups WHERE id = $1', [id]);
    console.log(`DELETE /api/backups/${id} - Registro eliminado de la BD`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/backups/[id]:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el backup' },
      { status: 500 }
    );
  }
}