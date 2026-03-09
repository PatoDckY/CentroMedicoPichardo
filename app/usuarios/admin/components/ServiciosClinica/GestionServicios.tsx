"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, PlusCircle, Edit, EyeOff, Eye, 
  Loader2, Hash, Layout, Briefcase, Trash2, AlertCircle, Image as ImageIcon 
} from 'lucide-react';

// Modales
import ServicioModal from './modals/ServicioModal';
import TipoServicioModal from './modals/TipoServicioModal';

// Estilos (Asegúrate de que herede las clases globales de admin-data-table)
import '../../styles/Servicios/GestionServicios.css'; 

export default function GestionServicios() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  // Estados de Modales
  const [isTypeModalOpen, setTypeModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState<any>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'vertical' | 'horizontal'>('vertical');

  // --- 1. CARGAR DATOS ---
  const cargarServicios = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/servicios?admin=true');
      if (!res.ok) throw new Error("No se pudo conectar con la base de datos.");
      const data = await res.json();
      setServicios(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarServicios(); }, []);

  // --- 2. FILTRADO ---
  const serviciosFiltrados = useMemo(() => {
    return servicios.filter(s => 
      s.tituloServicio.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [servicios, busqueda]);

  // --- 3. CRUD ---
  const handleSave = async (datos: any) => {
    const esEdicion = !!datos.idServicio;
    const url = esEdicion ? `/api/servicios/${datos.idServicio}` : '/api/servicios';
    
    const res = await fetch(url, {
      method: esEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (res.ok) {
      await cargarServicios();
      setFormModalOpen(false);
    }
  };

  const handleToggleEstado = async (s: any) => {
    await fetch(`/api/servicios/${s.idServicio}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...s, activo: !s.activo })
    });
    cargarServicios();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Deseas eliminar permanentemente este servicio?")) {
      await fetch(`/api/servicios/${id}`, { method: 'DELETE' });
      cargarServicios();
    }
  };

  if (loading) return (
    <div className="admin-loading-full">
      <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      <p>Organizando servicios médicos...</p>
    </div>
  );

  return (
    <div className="admin-cursos-container"> {/* Clase global para el contenedor */}
      
      {/* CABECERA */}
      <header className="admin-header-main">
        <div className="header-left">
          <h1>Servicios y Especialidades</h1>
          <div className="stats-badges">
            <span className="badge-stat">Total: {servicios.length}</span>
            <span className="badge-stat success">Activos: {servicios.filter(s => s.activo).length}</span>
          </div>
        </div>
        <button className="btn-add-main" onClick={() => { setServicioAEditar(null); setTypeModalOpen(true); }}>
          <PlusCircle size={20} /> Nuevo Servicio
        </button>
      </header>

      {/* FILTROS */}
      <div className="admin-filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            placeholder="Buscar por nombre del servicio..." 
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
              <th style={{ width: '100px' }}>Imagen</th>
              <th>Información del Servicio</th>
              <th>Tipo de Diseño</th>
              <th style={{ width: '120px' }}>Estado</th>
              <th style={{ width: '130px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.map((s) => (
              <tr key={s.idServicio} className={!s.activo ? 'row-inactive' : ''}>
                <td className="text-center font-bold">{s.idServicio}</td>
                <td>
                  <img 
                    src={s.urlImage || "/default-service.jpg"} 
                    className="img-thumb" 
                    alt="srv" 
                    style={{ borderRadius: '8px' }} // Servicios suelen ir mejor en cuadrado/rectángulo
                  />
                </td>
                <td>
                  <div className="cell-title">{s.tituloServicio}</div>
                  <div className="cell-subtitle"><Briefcase size={12}/> {s.ubicacion || 'Centro Médico'}</div>
                </td>
                <td>
                  <span className={`pill-diseno ${s.disenoTipo}`}>
                    {s.disenoTipo === 'vertical' ? <Layout size={12}/> : <ImageIcon size={12}/>}
                    {s.disenoTipo.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`pill-status ${s.activo ? 'active' : 'hidden'}`}>
                    {s.activo ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td>
                  <div className="actions-flex">
                    <button className="btn-icon edit" onClick={() => { setServicioAEditar(s); setFormModalOpen(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon toggle" onClick={() => handleToggleEstado(s)}>
                      {s.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(s.idServicio)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALES */}
      <TipoServicioModal 
        isOpen={isTypeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        onSelect={(t: any) => { setTipoSeleccionado(t); setTypeModalOpen(false); setTimeout(() => setFormModalOpen(true), 100); }}
      />

      {isFormModalOpen && (
        <ServicioModal 
          isOpen={isFormModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={handleSave}
          servicio={servicioAEditar}
          tipoPreseleccionado={tipoSeleccionado}
        />
      )}
    </div>
  );
}