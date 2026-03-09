"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, Edit, EyeOff, Eye, Loader2, 
  Search, AlertCircle, Newspaper, Calendar, User, Hash 
} from 'lucide-react';

// Importación de modales (Asegúrate de que las rutas sean correctas en tu proyecto)
import CrearPublicacionModal from './modals/CrearPublicacionModal'; 
import EditarPublicacionModal from './modals/EditarPublicacionModal';

// Estilos
import '../../styles/Academia/GestionAcademia.css'; 

export default function GestionAcademia() {
  // --- ESTADOS ---
  const [guias, setGuias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados de Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [seleccionada, setSeleccionada] = useState<any>(null);

  // --- 1. CARGAR DATOS (Admin ve TODO: activos y ocultos) ---
  const cargarGuias = async () => {
    try {
      setLoading(true);
      setError(null);
      // Usamos el flag ?admin=true para que la API no filtre los desactivados
      const res = await fetch('/api/academia?admin=true');
      
      if (!res.ok) throw new Error('Error al conectar con el servidor');
      
      const data = await res.json();
      // Manejamos si la API responde con un array o con un objeto {data: []}
      const listaFinal = Array.isArray(data) ? data : (data.data || []);
      setGuias(listaFinal);
    } catch (e: any) {
      console.error("Error al cargar:", e);
      setError("No se pudo sincronizar la biblioteca de la academia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarGuias();
  }, []);

  // --- 2. FILTRADO POR BÚSQUEDA ---
  const guiasFiltradas = useMemo(() => {
    return guias.filter(g => 
      (g.titulo || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (g.autor || "").toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [guias, busqueda]);

  // --- 3. ACCIONES (POST / PUT / SOFT-DELETE) ---

  const handleSave = async (nueva: any) => {
    const res = await fetch('/api/academia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nueva)
    });
    if (res.ok) {
      await cargarGuias();
      setIsCreateOpen(false);
    }
  };

  const handleUpdate = async (editada: any) => {
    try {
      const res = await fetch(`/api/academia/${editada.id_guia}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editada)
      });
      if (res.ok) {
        await cargarGuias();
        setIsEditOpen(false);
        setSeleccionada(null);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleToggleEstado = async (guia: any) => {
    const nuevoEstado = !guia.activo;
    const confirmacion = nuevoEstado 
      ? "¿Deseas publicar esta guía? Será visible para todos." 
      : "¿Deseas ocultar esta guía? Solo tú podrás verla.";

    if (window.confirm(confirmacion)) {
      try {
        const res = await fetch(`/api/academia/${guia.id_guia}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...guia, activo: nuevoEstado })
        });
        if (res.ok) {
          // Actualización local rápida para feedback visual
          setGuias(prev => prev.map(g => g.id_guia === guia.id_guia ? { ...g, activo: nuevoEstado } : g));
        }
      } catch (error) {
        console.error("Error al cambiar estado:", error);
      }
    }
  };

  // --- RENDERIZADO ---
  if (loading) return (
    <div className="admin-loading-full">
      <Loader2 className="animate-spin" size={48} color="#0a3d62" />
      <p>Organizando biblioteca médica...</p>
    </div>
  );

  return (
    <div className="admin-academia-container">
      
      {/* CABECERA */}
      <header className="admin-header-main">
        <div className="header-left">
          <h1 className="admin-title">Panel de Academia Infantil</h1>
          <div className="stats-pills">
            <span className="pill">Total: {guias.length}</span>
            <span className="pill online">Públicos: {guias.filter(g => g.activo).length}</span>
            <span className="pill offline">Ocultos: {guias.filter(g => !g.activo).length}</span>
          </div>
        </div>
        <button className="btn-add-main" onClick={() => setIsCreateOpen(true)}>
          <PlusCircle size={20} /> Nueva Guía Educativa
        </button>
      </header>

      {/* BARRA DE HERRAMIENTAS */}
      <div className="admin-filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por título o autor..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="admin-error-alert"><AlertCircle size={20} /> {error}</div>}

      {/* TABLA DE DATOS */}
      <div className="table-responsive-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th className="col-id"><Hash size={14}/> ID</th>
              <th className="col-img">Portada</th>
              <th className="col-info">Título y Resumen</th>
              <th className="col-autor"><User size={14}/> Autor</th>
              <th className="col-fecha"><Calendar size={14}/> Fecha</th>
              <th className="col-estado">Estado</th>
              <th className="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {guiasFiltradas.length > 0 ? (
              guiasFiltradas.map((guia) => (
                <tr key={guia.id_guia} className={!guia.activo ? 'row-inactive' : ''}>
                  <td className="text-center font-bold">{guia.id_guia}</td>
                  <td>
                    <img 
                      src={(!guia.imagenSrc || guia.imagenSrc === "1") ? "/logo.png" : guia.imagenSrc} 
                      alt="Miniatura" 
                      className="table-img-thumb" 
                    />
                  </td>
                  <td>
                    <div className="cell-title">{guia.titulo || "Sin título"}</div>
                    <div className="cell-subtitle">{guia.bajada || "Sin descripción corta registrada."}</div>
                  </td>
                  <td>{guia.autor || "Especialista"}</td>
                  <td>{guia.fecha ? new Date(guia.fecha).toLocaleDateString() : "S/F"}</td>
                  <td>
                    <span className={`pill-status ${guia.activo ? 'active' : 'hidden'}`}>
                      {guia.activo ? 'Público' : 'Oculto'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-flex">
                      <button 
                        className="btn-icon edit" 
                        title="Editar"
                        onClick={() => { setSeleccionada(guia); setIsEditOpen(true); }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={`btn-icon toggle ${guia.activo ? 'to-hide' : 'to-show'}`} 
                        title={guia.activo ? "Ocultar de la web" : "Publicar ahora"}
                        onClick={() => handleToggleEstado(guia)}
                      >
                        {guia.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="empty-table-msg">
                  <Newspaper size={40} />
                  <p>No se encontraron registros en la biblioteca.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALES */}
      <CrearPublicacionModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSave={handleSave} 
      />

      {seleccionada && (
        <EditarPublicacionModal 
          isOpen={isEditOpen} 
          onClose={() => { setIsEditOpen(false); setSeleccionada(null); }} 
          onSave={handleUpdate} 
          guia={seleccionada} 
        />
      )}

    </div>
  );
}