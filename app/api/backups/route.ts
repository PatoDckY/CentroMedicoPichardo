import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/backups - Listar historial de respaldos
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, fecha, tipo, tamaño, estado
       FROM backups
       ORDER BY fecha DESC`
    );

    const backups = result.rows.map(row => ({
      id: row.id.toString(),
      fecha: row.fecha.toISOString(),
      tipo: row.tipo,
      tamaño: row.tamaño || 'N/A',
      estado: row.estado,
    }));

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Error en GET /api/backups:', error);
    return NextResponse.json(
      { error: 'Error al obtener historial' },
      { status: 500 }
    );
  }
}

// POST /api/backups - Generar nuevo respaldo
export async function POST(request: Request) {
  try {
    const { tipo } = await request.json();
    if (!tipo || (tipo !== 'completo' && tipo !== 'parcial')) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    console.log('Generando backup con pg_dump...');

    let pgDumpArgs = ['--clean', '--if-exists', '--no-owner', '--no-privileges'];

    if (tipo === 'parcial') {
      const client = await pool.connect();
      const res = await client.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('logs', 'auditoria', 'sesiones')`
      );
      client.release();
      res.rows.forEach(row => {
        pgDumpArgs.push('--exclude-table', row.tablename);
      });
    }

    const command = `pg_dump ${pgDumpArgs.join(' ')} "${process.env.DATABASE_URL}"`;
    console.log('Ejecutando:', command);

    const { stdout, stderr } = await execAsync(command, { maxBuffer: 50 * 1024 * 1024 });
    if (stderr) console.warn('pg_dump stderr:', stderr);

    const sqlDump = stdout;

    const backupDir = path.join(process.cwd(), 'public', 'backups');
    mkdirSync(backupDir, { recursive: true });
    const timestamp = Date.now();
    const fileName = `backup-${timestamp}.sql`;
    const filePath = path.join(backupDir, fileName);
    writeFileSync(filePath, sqlDump, 'utf8');

    const tamañoKB = (Buffer.byteLength(sqlDump, 'utf8') / 1024).toFixed(2) + ' KB';

    const insertRes = await pool.query(
      `INSERT INTO backups (tipo, tamaño, archivo_url) VALUES ($1, $2, $3) RETURNING id`,
      [tipo, tamañoKB, `backups/${fileName}`]
    );
    const backupId = insertRes.rows[0].id;

    console.log(`Backup ID ${backupId} guardado en ${filePath}`);

    return new NextResponse(Buffer.from(sqlDump, 'utf-8'), {
      headers: {
        'Content-Disposition': `attachment; filename="backup-${backupId}.sql"`,
        'Content-Type': 'application/sql',
      },
    });
  } catch (error) {
    console.error('Error en POST /api/backups:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al generar backup' },
      { status: 500 }
    );
  }
}