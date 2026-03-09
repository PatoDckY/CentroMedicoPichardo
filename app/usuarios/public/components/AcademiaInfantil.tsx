"use client";
import React, { useEffect, useState, useMemo } from "react";
import NoticiaBreveCard from "./cards/NoticiaBreveCard";
import { ArrowRightCircle, BookOpen, Search, Loader2, AlertCircle } from "lucide-react";
import "../styles/AcademiaInfantil.css";

type GuiaAPI = {
  id_guia: number;
  titulo: string;
  bajada: string | null;
  autor: string | null;
  fecha: string | null;
  imagenSrc: string | null;
  etiquetas: string | null;
  activo: boolean;
};

export default function AcademiaInfantil() {
  const [guias, setGuias] = useState<GuiaAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchGuias = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/academia");
        if (!res.ok) throw new Error("Error al conectar con la API");
        
        const data = await res.json();
        
        // 🛠️ Basado en tu diagnóstico, recibimos un ARRAY directo
        setGuias(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGuias();
  }, []);

  // Función segura para procesar etiquetas
  const parseEtiquetas = (str: string | null) => {
    if (!str || str.trim() === "") return [];
    return str.split(',').map(t => t.trim()).filter(Boolean);
  };

  // Preparamos las noticias para las Cards
  const noticiasPreparadas = useMemo(() => {
    return guias.map(g => ({
      id: g.id_guia,
      imagenSrc: g.imagenSrc && g.imagenSrc !== "1" ? g.imagenSrc : "/logo.png",
      titulo: g.titulo || "Guía sin título",
      bajada: g.bajada || "Sin descripción disponible.",
      autor: g.autor || "Especialista",
      fecha: g.fecha ? new Date(g.fecha).toLocaleDateString('es-MX', { 
        day: '2-digit', month: 'long', year: 'numeric' 
      }) : "Reciente",
      etiquetas: parseEtiquetas(g.etiquetas)
    }));
  }, [guias]);

  // Filtrado por buscador
  const noticiasFiltradas = useMemo(() => {
    return noticiasPreparadas.filter(n => 
      n.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      n.autor.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [noticiasPreparadas, busqueda]);

  return (
    <div className="academia-page-container">
      <div className="academia-hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Tu aliado de confianza en la paternidad.</h1>
          <div className="main-search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar guías o autores..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        <div className="academia-cta-wrapper">
          <a href="/usuarios/public/screens/CatalogoCursos" className="btn-cursos-disponibles">
            <BookOpen size={24} /> Ver Cursos <ArrowRightCircle size={20} />
          </a>
        </div>
      </div>

      <div className="academia-layout-grid">
        <div className="academia-content-area">
          <h2 className="content-section-title">Biblioteca de Guías</h2>

          {loading && (
            <div className="loading-state">
              <Loader2 className="animate-spin" size={32} />
              <p>Cargando información...</p>
            </div>
          )}

          {error && (
            <div className="error-message-box">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="publicaciones-list">
            {!loading && noticiasFiltradas.length === 0 && (
              <p className="empty-message">No se encontraron guías disponibles.</p>
            )}
            
            {noticiasFiltradas.map((noticia) => (
              <NoticiaBreveCard 
                key={noticia.id}
                imagenSrc={noticia.imagenSrc}
                altTexto={noticia.titulo}
                titulo={noticia.titulo}
                bajada={noticia.bajada}
                autor={noticia.autor}
                fecha={noticia.fecha}
                linkVerMas={`/academia/${noticia.id}`}
                etiquetas={noticia.etiquetas}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}