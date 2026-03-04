"use client";
import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  RefreshCw,
  Clock,
  History,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import styles from '@/app/usuarios/admin/styles/Respaldo/Respaldo.module.css';

interface BackupRecord {
  id: string;
  fecha: string;
  tamaño: string;
  tipo: 'completo' | 'parcial';
  estado: 'exitoso' | 'fallido';
  archivo?: string;
}

export default function RespaldoComponente() {
  const [generando, setGenerando] = useState(false);
  const [tipoBackup, setTipoBackup] = useState<'completo' | 'parcial'>('completo');
  const [historial, setHistorial] = useState<BackupRecord[]>([]);
  const [estadoBD, setEstadoBD] = useState<'conectado' | 'desconectado' | 'verificando'>('verificando');
  const [ultimoBackup, setUltimoBackup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    verificarConexion();
    cargarHistorial();
  }, []);

  const verificarConexion = async () => {
    setEstadoBD('verificando');
    try {
      const res = await fetch('/api/auth/health/db');
      if (res.ok) {
        setEstadoBD('conectado');
      } else {
        setEstadoBD('desconectado');
      }
    } catch {
      setEstadoBD('desconectado');
    }
  };

  const cargarHistorial = async () => {
    try {
      const res = await fetch('/api/backups');
      if (!res.ok) throw new Error('Error al cargar historial');
      const data = await res.json();
      setHistorial(data.backups);
      if (data.backups.length > 0) {
        setUltimoBackup(data.backups[0].fecha);
      }
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  };

  const generarBackup = async () => {
    setGenerando(true);
    setError(null);
    setProgreso(0);

    const intervalo = setInterval(() => {
      setProgreso(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      // 1. CORREGIDO: usar /api/backups en lugar de /api/backups/generar
      const res = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: tipoBackup })
      });

      clearInterval(intervalo);

      if (!res.ok) {
        let errorMsg = 'Error al generar backup';
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } else {
          errorMsg = await res.text();
        }
        throw new Error(errorMsg);
      }

      // 2. Verificar si la respuesta es un archivo (blob)
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Caso inesperado: el backend devolvió JSON (probable error)
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        // Debe ser un archivo SQL
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        // Intentar obtener el nombre del archivo de la cabecera Content-Disposition
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = `backup-${new Date().toISOString().slice(0, 10)}.sql`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match) filename = match[1];
        }

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        // 3. Recargar historial para incluir el nuevo backup
        await cargarHistorial();
        setProgreso(100);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      clearInterval(intervalo);
      setGenerando(false);
      setProgreso(0);
    }
  };

  const descargarBackup = async (id: string) => {
    try {
      const res = await fetch(`/api/backups/${id}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || `Error ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${id}.sql`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Error al descargar: ${err.message}`);
    }
  };

  const eliminarBackup = async (id: string) => {
    if (!confirm('¿Eliminar este respaldo permanentemente?')) return;
    try {
      const res = await fetch(`/api/backups/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || `Error ${res.status}`);
      }
      // Si la respuesta es exitosa, actualizamos el estado local
      setHistorial(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <ShieldCheck size={32} />
          Panel de Seguridad y Respaldo
        </h1>
        <p className={styles.subtitle}>Sistema de gestión para Centro Médico Pichardo</p>
      </header>

      <div className={styles.grid}>
        {/* Tarjeta estado BD */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBg} ${styles.iconBlue}`}>
              <Database size={28} />
            </div>
            <h2>Base de Datos</h2>
          </div>
          <div className={styles.statusIndicator}>
            {estadoBD === 'verificando' && (
              <><RefreshCw className={styles.spin} size={16} /> Verificando...</>
            )}
            {estadoBD === 'conectado' && (
              <><span className={styles.dotGreen}></span> Neon - Conectado</>
            )}
            {estadoBD === 'desconectado' && (
              <><span className={styles.dotRed}></span> Desconectado</>
            )}
          </div>
          <div className={styles.cardBody}>
            <p><span>Último respaldo:</span> <strong>{ultimoBackup || 'Nunca'}</strong></p>
            <p><span>Respaldos totales:</span> <strong>{historial.length}</strong></p>
          </div>
          <button onClick={verificarConexion} className={styles.refreshSmall} title="Reconectar">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Tarjeta generación */}
        <div className={`${styles.card} ${styles.cardWide}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBg} ${styles.iconGreen}`}>
              <FileText size={28} />
            </div>
            <h2>Generar nuevo respaldo</h2>
          </div>

          <div className={styles.backupOptions}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="tipo"
                value="completo"
                checked={tipoBackup === 'completo'}
                onChange={(e) => setTipoBackup(e.target.value as 'completo')}
              />
              <span>Completo (toda la BD)</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="tipo"
                value="parcial"
                checked={tipoBackup === 'parcial'}
                onChange={(e) => setTipoBackup(e.target.value as 'parcial')}
              />
              <span>Parcial (solo estructura + datos esenciales)</span>
            </label>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <XCircle size={18} /> {error}
            </div>
          )}

          {generando && (
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progreso}%` }}></div>
            </div>
          )}

          <button
            onClick={generarBackup}
            disabled={generando || estadoBD !== 'conectado'}
            className={`${styles.btn} ${styles.btnPrimary} ${generando ? styles.btnLoading : ''}`}
          >
            {generando ? (
              <><RefreshCw className={styles.spin} size={18} /> Generando... {progreso}%</>
            ) : (
              <><Download size={18} /> Iniciar respaldo {tipoBackup}</>
            )}
          </button>
        </div>

        {/* Tarjeta programación */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBg} ${styles.iconPurple}`}>
              <Clock size={28} />
            </div>
            <h2>Respaldos automáticos</h2>
          </div>
          <p className={styles.nextBackup}>Próximo: Diario 10:30 PM</p>
          <button className={styles.btnConfig} onClick={() => alert('Funcionalidad en desarrollo')}>
            <Calendar size={16} /> Configurar
          </button>
        </div>

        {/* Historial */}
        <div className={`${styles.card} ${styles.cardFull}`}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconBg} ${styles.iconOrange}`}>
              <History size={28} />
            </div>
            <h2>Historial de respaldos</h2>
          </div>

          {historial.length === 0 ? (
            <p className={styles.emptyHistory}>No hay respaldos registrados</p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Tamaño</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map(item => (
                    <tr key={item.id}>
                      <td>{item.fecha}</td>
                      <td>
                        <span className={`${styles.badge} ${item.tipo === 'completo' ? styles.badgeBlue : styles.badgeGray}`}>
                          {item.tipo}
                        </span>
                      </td>
                      <td>{item.tamaño}</td>
                      <td>
                        {item.estado === 'exitoso' ? (
                          <span className={styles.success}><CheckCircle2 size={16} /> Exitoso</span>
                        ) : (
                          <span className={styles.danger}><XCircle size={16} /> Fallido</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button onClick={() => descargarBackup(item.id)} className={styles.actionBtn} title="Descargar">
                            <Download size={16} />
                          </button>
                          <button onClick={() => eliminarBackup(item.id)} className={styles.actionBtn} title="Eliminar">
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={() => window.location.reload()} className={styles.btnRefresh}>
          <RefreshCw size={14} /> Refrescar estado
        </button>
      </div>
    </div>
  );
}