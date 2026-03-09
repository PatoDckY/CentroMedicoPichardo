"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, PlusCircle, Edit, EyeOff, Eye,
  Loader2, Newspaper, AlertCircle, Hash, User, Calendar
} from 'lucide-react';

import CrearNoticiaModal from './modals/CrearNoticiaModal';
import EditarNoticiaModal from './modals/EditarNoticiaModal';
import '../../styles/blog/GestionNoticias.css';

export default function GestionNoticias() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState<any>(null);

  // --- 1. CARGAR DATOS ---
  const cargarPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/publicaciones?admin=true&limit=100');
      if (!res.ok) throw new Error("Error al obtener noticias");
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err) {
      setError("No se pudo sincronizar el blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarPosts(); }, []);

  // --- 2. FILTRADO ---
  const postsFiltrados = useMemo(() => {
    return posts.filter(p =>
      (p.tituloNoticia || "").toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, posts]);

  // --- 3. ACCIONES ---
  const handleToggleEstado = async (post: any) => {
    const nuevoEstado = !post.activo;

    // 🕵️ Debug preventivo para Chavez
    console.log("Cambiando estado de post:", post.idPublicacion, "Autor ID:", post.idAutor);

    const res = await fetch(`/api/publicaciones/${post.idPublicacion}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...post,
        // 🛡️ Aseguramos que idAutor viaje con el nombre que el Schema espera
        idAutor: post.idAutor,
        activo: nuevoEstado
      })
    });

    if (res.ok) {
      await cargarPosts();
    } else {
      const error = await res.json();
      console.error("Fallo al ocultar:", error);
    }
  };

  if (loading) return <div className="admin-loading-full"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="admin-blog-container">

      <header className="admin-header-main">
        <div className="header-left">
          <h1>Panel de Control de Blog</h1>
          <div className="stats-badges">
            <span className="badge-stat">Artículos: {posts.length}</span>
            <span className="badge-stat success">Activos: {posts.filter(p => p.activo).length}</span>
          </div>
        </div>
        <button className="btn-add-main" onClick={() => setCreateOpen(true)}>
          <PlusCircle size={20} /> Redactar Noticia
        </button>
      </header>

      <div className="admin-filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}><Hash size={14} /> ID</th>
              <th style={{ width: '100px' }}>Imagen</th>
              <th>Título y Resumen</th>
              <th style={{ width: '200px' }}><User size={14} /> Autor</th>
              <th style={{ width: '150px' }}><Calendar size={14} /> Fecha</th>
              <th style={{ width: '120px' }}>Estado</th>
              <th style={{ width: '100px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {postsFiltrados.map((p) => (
              <tr key={p.idPublicacion} className={!p.activo ? 'row-inactive' : ''}>
                <td className="text-center font-bold">{p.idPublicacion}</td>
                <td><img src={p.urlImagen || "/logo.png"} className="img-thumb" alt="Post" /></td>
                <td>
                  <div className="cell-title">{p.tituloNoticia}</div>
                  <div className="cell-subtitle">{p.resumenBajada?.substring(0, 80)}...</div>
                </td>
                <td>{p.nombreAutor || `ID: ${p.idAutor}`}</td>
                <td>{p.fechaPublicacion ? new Date(p.fechaPublicacion).toLocaleDateString() : 'S/F'}</td>
                <td>
                  <span className={`pill-status ${p.activo ? 'active' : 'hidden'}`}>
                    {p.activo ? 'Público' : 'Oculto'}
                  </span>
                </td>
                <td>
                  <div className="actions-flex">
                    <button className="btn-icon edit" onClick={() => { setSeleccionado(p); setEditOpen(true); }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon toggle" onClick={() => handleToggleEstado(p)}>
                      {p.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CrearNoticiaModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSave={async (nuevo: any) => {
          const res = await fetch('/api/publicaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
          });
          if (res.ok) cargarPosts();
        }}
      />

      {seleccionado && (
        <EditarNoticiaModal
          isOpen={isEditOpen}
          onClose={() => { setEditOpen(false); setSeleccionado(null); }}
          onSave={async (editado: any) => {
            const res = await fetch(`/api/publicaciones/${editado.idPublicacion}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editado)
            });
            if (res.ok) cargarPosts();
          }}
          noticia={seleccionado}
        />
      )}
    </div>
  );
}