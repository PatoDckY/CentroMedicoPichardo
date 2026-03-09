"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, PlusCircle, Edit, EyeOff, Eye, 
  Loader2, Hash, User, Stethoscope, AlertCircle, Trash2 
} from 'lucide-react';

// ✅ Componentes de Modales
import CrearMedicoModal from './modals/CrearMedicoModal'; 
import EditarMedicoModal from './modals/EditarMedicoModal';

// ✅ Estilos Unificados
import '../../styles/Directorio/GestionDirectorio.css'; 

// 1. TIPO SINCRONIZADO CON EL SCHEMA
type Medico = {
  idMedico: number;
  nombreCompleto: string;
  especialidad: string;
  hospitalClinica: string;
  direccion: string | null;
  urlFoto: string | null;
  activo: boolean; // 👈 Campo clave para visibilidad
};

export default function GestionDirectorio() {
  // --- ESTADOS ---
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados de Modales
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Medico | null>(null);

  // --- 1. CARGAR DATOS (Modo Admin para ver ocultos) ---
  const cargarMedicos = async () => {
    try {
      setLoading(true);
      setError(null);
      // 🛡️ Flag ?admin=true para saltar el filtro de 'solo activos'
      const res = await fetch('/api/medicos?admin=true');
      if (!res.ok) throw new Error("No se pudo sincronizar el directorio.");
      const data = await res.json();
      
      // Manejo de la respuesta si viene en formato { data: [] } o []
      const lista = Array.isArray(data) ? data : (data.data || []);
      setMedicos(lista);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarMedicos(); }, []);

  // --- 2. FILTRADO ---
  const medicosFiltrados = useMemo(() => {
    return medicos.filter(m => 
      m.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.especialidad.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [medicos, busqueda]);

  // --- 3. FUNCIONES CRUD ---

  // Alternar Visibilidad (PUT)
  const handleToggleEstado = async (medico: Medico) => {
    const nuevoEstado = !medico.activo;
    try {
      const res = await fetch(`/api/medicos/${medico.idMedico}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...medico, activo: nuevoEstado }),
      });
      if (res.ok) await cargarMedicos();
    } catch (err) {
      console.error("Error al cambiar visibilidad:", err);
    }
  };

  // Eliminar (DELETE Físico - Opcional)
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar permanentemente a este médico? Esto podría afectar sus publicaciones en el blog.")) {
      try {
        const res = await fetch(`/api/medicos/${id}`, { method: 'DELETE' });
        if (res.ok) await cargarMedicos();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  if (loading) return (
    <div className="admin-loading-full">
      <Loader2 className="animate-spin" size={48} color="#0a3d62" />
      <p>Sincronizando facultad médica...</p>
    </div>
  );

  return (
    <div className="admin-cursos-container"> {/* Reutilizamos contenedor global */}
      
      {/* CABECERA CON STATS */}
      <header className="admin-header-main">
        <div className="header-left">
          <h1>Gestión de Facultad Médica</h1>
          <div className="stats-badges">
            <span className="badge-stat">Total: {medicos.length}</span>
            <span className="badge-stat success">Activos: {medicos.filter(m => m.activo).length}</span>
          </div>
        </div>
        <button className="btn-add-main" onClick={() => setCreateOpen(true)}>
          <PlusCircle size={20} /> Registrar Nuevo Médico
        </button>
      </header>

      {/* FILTROS */}
      <div className="admin-filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            placeholder="Buscar por nombre o especialidad..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="admin-error-alert"><AlertCircle size={20} /> {error}</div>}

      {/* TABLA DE GESTIÓN */}
      <div className="table-responsive-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}><Hash size={14}/> ID</th>
              <th style={{ width: '100px' }}>Foto</th>
              <th>Información del Médico</th>
              <th>Hospital / Clínica</th>
              <th style={{ width: '120px' }}>Estado</th>
              <th style={{ width: '120px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicosFiltrados.length > 0 ? (
              medicosFiltrados.map((m) => (
                <tr key={m.idMedico} className={!m.activo ? 'row-inactive' : ''}>
                  <td className="text-center font-bold">{m.idMedico}</td>
                  <td>
                    <img 
                      src={m.urlFoto || "/default-doctor.jpg"} 
                      className="img-thumb" 
                      alt="dr" 
                    />
                  </td>
                  <td>
                    <div className="cell-title">{m.nombreCompleto}</div>
                    <div className="cell-subtitle"><Stethoscope size={12}/> {m.especialidad}</div>
                  </td>
                  <td>{m.hospitalClinica || "Centro Médico Pichardo"}</td>
                  <td>
                    <span className={`pill-status ${m.activo ? 'active' : 'hidden'}`}>
                      {m.activo ? 'Visible' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-flex">
                      <button 
                        className="btn-icon edit" 
                        title="Editar"
                        onClick={() => { setSeleccionado(m); setEditOpen(true); }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon toggle" 
                        title={m.activo ? "Ocultar del directorio" : "Mostrar en el directorio"}
                        onClick={() => handleToggleEstado(m)}
                      >
                        {m.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button 
                        className="btn-icon delete" 
                        title="Eliminar permanentemente"
                        onClick={() => handleDelete(m.idMedico)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-table-msg">
                   <User size={40} />
                   <p>No se encontraron médicos registrados.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODALES --- */}

      <CrearMedicoModal 
        isOpen={isCreateOpen} 
        onClose={() => setCreateOpen(false)} 
        onSave={async (nuevo: any) => {
          const res = await fetch('/api/medicos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
          });
          if (res.ok) await cargarMedicos();
        }} 
      />

      {seleccionado && (
        <EditarMedicoModal 
          isOpen={isEditOpen} 
          onClose={() => { setEditOpen(false); setSeleccionado(null); }} 
          onSave={async (editado: any) => {
            const res = await fetch(`/api/medicos/${editado.idMedico}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editado)
            });
            if (res.ok) await cargarMedicos();
          }} 
          medico={seleccionado} 
        />
      )}
    </div>
  );
}