"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Hash, UserCog, Mail, ShieldCheck, ShieldAlert, Phone, AlertCircle } from 'lucide-react';
import EditarRolModal from './EditarRolModal';
import '../../styles/Usuarios/GestionUsuarios.css';

export type Usuario = {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  correo: string;
  telefono: string;
  rolId: number;
  rolNombre: string;
};

export default function GestionUsuarios() {
  const [data, setData] = useState<{ usuarios: Usuario[], roles: any[] }>({ 
    usuarios: [], 
    roles: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 🚀 Peticiones en paralelo para mayor velocidad
      const [resUsuarios, resRoles] = await Promise.all([
        fetch('/api/usuarios'),
        fetch('/api/roles')
      ]);

      if (!resUsuarios.ok || !resRoles.ok) throw new Error("Error al sincronizar con el servidor");

      const listaUsuarios = await resUsuarios.json();
      const listaRoles = await resRoles.json();

      setData({
        usuarios: Array.isArray(listaUsuarios) ? listaUsuarios : [],
        roles: Array.isArray(listaRoles) ? listaRoles : []
      });

    } catch (err: any) {
      console.error("🔥 Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    cargarDatos(); 
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const lista = data.usuarios || [];
    return lista.filter(u => 
      `${u.nombre} ${u.correo} ${u.apellidoPaterno}`.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [data.usuarios, busqueda]);

  const handleSaveRol = async (id: number, nuevoRolId: number) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolId: nuevoRolId })
      });

      if (res.ok) {
        await cargarDatos();
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  if (loading) return (
    <div className="admin-loading-full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
      <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      <p style={{ marginTop: '1rem', color: '#64748B' }}>Sincronizando base de datos...</p>
    </div>
  );

  return (
    <div className="admin-usuarios-container">
      <header className="admin-header-main">
        <div className="header-left">
          <h1>Control de Accesos</h1>
          <div className="stats-badges">
            <span className="badge-stat">Registrados: {data.usuarios.length}</span>
          </div>
        </div>
      </header>

      <div className="admin-filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            placeholder="Buscar por nombre o correo..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', padding: '1rem', background: '#fee2e2', borderRadius: '8px', marginBottom: '1rem' }}>
          <AlertCircle size={18} style={{ display: 'inline', marginRight: '8px' }}/>
          Error: {error}
        </div>
      )}

      <div className="table-responsive-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}><Hash size={14}/> ID</th>
              <th>Nombre Completo</th>
              <th>Contacto</th>
              <th>Rol de Sistema</th>
              <th style={{ width: '100px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td className="text-center font-bold">{u.id}</td>
                  <td>
                    <div className="cell-title">{u.nombre} {u.apellidoPaterno}</div>
                    <div className="cell-subtitle"><Mail size={12}/> {u.correo}</div>
                  </td>
                  <td><div className="cell-subtitle"><Phone size={12}/> {u.telefono || 'Sin teléfono'}</div></td>
                  <td>
                    <span className={`pill-rol ${(u.rolNombre || 'Sin asignar').toLowerCase()}`}>
                      {u.rolNombre === 'Admin' ? <ShieldAlert size={12}/> : <ShieldCheck size={12}/>}
                      {u.rolNombre || 'Sin asignar'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-flex">
                      <button className="btn-icon edit" onClick={() => { setUsuarioAEditar(u); setEditModalOpen(true); }}>
                        <UserCog size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditarRolModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        usuario={usuarioAEditar}
        roles={data.roles}
        onSave={handleSaveRol}
      />
    </div>
  );
}