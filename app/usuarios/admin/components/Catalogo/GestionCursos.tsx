"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, PlusCircle, Edit, EyeOff, Eye, 
  Loader2, BookOpen, AlertCircle, Hash, User, Calendar 
} from 'lucide-react';

// ✅ Asegúrate de que las rutas a tus modales sean correctas
import CrearCursoModal from './modals/CrearCursoModal';
import EditarCursoModal from './modals/EditarCursoModal';

// Estilos unificados para el Dashboard
import '../../styles/Cursos/GestionCursos.css';

export default function GestionCursos() {
  // --- ESTADOS ---
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados de Modales
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  // --- 1. CARGAR DATOS (Admin Mode: ve todo) ---
  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🛡️ Flag ?admin=true para saltar el filtro de 'solo activos'
      const res = await fetch('/api/cursos?admin=true'); 
      if (!res.ok) throw new Error("Error de conexión con la base de datos");
      
      const data = await res.json();
      // Validamos que sea un array (o que venga dentro de un objeto .data)
      const listaLimpia = Array.isArray(data) ? data : (data.data || []);
      setCursos(listaLimpia);
    } catch (err: any) {
      console.error("Error GET Cursos:", err);
      setError("No se pudo sincronizar la oferta educativa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarCursos(); 
  }, []);

  // --- 2. FILTRADO EN TIEMPO REAL ---
  const cursosFiltrados = useMemo(() => {
    return cursos.filter(c => 
      (c.tituloCurso || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.nombreInstructor || "").toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, cursos]);

  // --- 3. ACCIONES DE GESTIÓN ---

  // Alternar Visibilidad (Borrado Lógico)
  const handleToggleEstado = async (curso: any) => {
    const nuevoEstado = !curso.activo;
    const msg = nuevoEstado ? "¿Publicar este curso ahora?" : "¿Ocultar este curso del catálogo público?";
    
    if (window.confirm(msg)) {
      try {
        const res = await fetch(`/api/cursos/${curso.idCurso}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...curso, activo: nuevoEstado })
        });
        
        if (res.ok) {
          // Actualización optimista para feedback instantáneo
          setCursos(prev => prev.map(c => c.idCurso === curso.idCurso ? { ...c, activo: nuevoEstado } : c));
        }
      } catch (err) {
        alert("Error al cambiar la visibilidad.");
      }
    }
  };

  // --- RENDERIZADO DE INTERFAZ ---
  if (loading) return (
    <div className="admin-loading-full">
      <Loader2 className="animate-spin" size={48} color="#0a3d62" />
      <p>Cargando talleres y cursos...</p>
    </div>
  );

  return (
    <div className="admin-cursos-container">
      
      {/* CABECERA CON ESTADÍSTICAS */}
      <header className="admin-header-main">
        <div className="header-left">
          <h1>Gestión de Oferta Educativa</h1>
          <div className="stats-badges">
            <span className="badge-stat">Registros: {cursos.length}</span>
            <span className="badge-stat success">Activos: {cursos.filter(c => c.activo).length}</span>
          </div>
        </div>
        <button className="btn-add-main" onClick={() => setCreateOpen(true)}>
          <PlusCircle size={20} /> Crear Nuevo Curso
        </button>
      </header>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="admin-filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text"
            placeholder="Buscar por nombre de curso o instructor..." 
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
              <th style={{ width: '100px' }}>Portada</th>
              <th>Información del Curso</th>
              <th style={{ width: '200px' }}><User size={14}/> Instructor</th>
              <th style={{ width: '150px' }}><Calendar size={14}/> Fecha Inicio</th>
              <th style={{ width: '120px' }}>Estado</th>
              <th style={{ width: '100px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursosFiltrados.length > 0 ? (
              cursosFiltrados.map((c) => (
                <tr key={c.idCurso} className={!c.activo ? 'row-inactive' : ''}>
                  <td className="text-center font-bold">{c.idCurso}</td>
                  <td>
                    <img 
                      src={c.urlImagenPortada || "/logo.png"} 
                      alt="Mini" 
                      className="img-thumb" 
                    />
                  </td>
                  <td>
                    <div className="cell-title">{c.tituloCurso || "Sin título"}</div>
                    <div className="cell-subtitle">
                      {c.categoria} • {c.modalidad} • ${c.costo || '0.00'}
                    </div>
                  </td>
                  <td>{c.nombreInstructor || `ID Médico: ${c.idInstructor}`}</td>
                  <td>{c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString() : 'Pendiente'}</td>
                  <td>
                    <span className={`pill-status ${c.activo ? 'active' : 'hidden'}`}>
                      {c.activo ? 'Público' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-flex">
                      <button 
                        className="btn-icon edit" 
                        title="Editar"
                        onClick={() => { setSeleccionado(c); setEditOpen(true); }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={`btn-icon toggle ${c.activo ? 'to-hide' : 'to-show'}`} 
                        title={c.activo ? "Ocultar de la web" : "Publicar curso"}
                        onClick={() => handleToggleEstado(c)}
                      >
                        {c.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="empty-table-msg">
                  <BookOpen size={40} />
                  <p>No se encontraron resultados que coincidan con la búsqueda.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- RENDERIZADO DE MODALES --- */}

      <CrearCursoModal 
        isOpen={isCreateOpen} 
        onClose={() => setCreateOpen(false)} 
        onSave={async (nuevo: any) => {
          const res = await fetch('/api/cursos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
          });
          if (res.ok) await cargarCursos();
        }} 
      />

      {seleccionado && (
        <EditarCursoModal 
          isOpen={isEditOpen} 
          onClose={() => { setEditOpen(false); setSeleccionado(null); }} 
          onSave={async (editado: any) => {
            const res = await fetch(`/api/cursos/${editado.idCurso}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editado)
            });
            if (res.ok) await cargarCursos();
          }} 
          curso={seleccionado} 
        />
      )}
    </div>
  );
}