"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CursoCard from "./cards/CursoCard";
import "../styles/CatalogoCursos.css";

type Curso = {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPublicacion: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: "Online" | "Presencial" | "Híbrido";
  dirigidoA: "Padres" | "Niños" | "Familia" | "Adolescentes";
  estado: "Activo" | "Finalizado" | "Próximamente";
  imagenSrc?: string;
  costo: number | "Gratuito";
  ubicacion?: string;
  categoria: string;
  linkDetalle: string;
};

export default function CatalogoCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroAudiencia, setFiltroAudiencia] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Activos");

  const [paginaActual, setPaginaActual] = useState(1);
  const CURSOS_POR_PAGINA = 6;

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        // La API pública ya filtra por activo: true automáticamente
        const res = await fetch("/api/cursos");
        if (!res.ok) throw new Error("No se pudieron cargar los cursos");
        
        const data = await res.json();

        // 🛡️ MAPEO DE DATOS: Sincronizado con los nombres de tu Schema
        const cursosMapeados: Curso[] = data.map((c: any) => {
          const costoNum = Number(c.costo);
          
          return {
            id: c.idCurso,
            titulo: c.tituloCurso,
            descripcion: c.descripcion || "Sin descripción disponible",
            fechaInicio: c.fechaInicio,
            fechaFin: c.fechaFin,
            fechaPublicacion: c.fechaInicio, // Usamos inicio como referencia
            inscripcionesAbiertas: true,
            cupoMaximo: c.cupoMaximo || 20,
            cupoInscrito: 0,
            // ✅ Ahora usamos el nombre del médico que viene del JOIN
            instructor: c.nombreInstructor || "Especialista del Centro", 
            horario: c.horario || "Horario a convenir",
            modalidad: c.modalidad || "Presencial",
            dirigidoA: c.dirigidoA || "Familia",
            estado: "Activo",
            imagenSrc: c.urlImagenPortada || "/logo.png",
            costo: (costoNum === 0 || isNaN(costoNum)) ? "Gratuito" : costoNum,
            ubicacion: c.ubicacion || "Centro Médico Pichardo",
            categoria: c.categoria || "General",
            linkDetalle: `/usuarios/public/screens/Curso/${c.idCurso}`
          };
        });

        setCursos(cursosMapeados);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarCursos();
  }, []);

  // --- LÓGICA DE FILTRADO ---
  const cursosFiltrados = useMemo(() => {
    return cursos.filter((curso) => {
      const coincideTexto =
        curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.instructor.toLowerCase().includes(busqueda.toLowerCase());

      const coincideAudiencia =
        filtroAudiencia === "Todos" || curso.dirigidoA === filtroAudiencia;

      return coincideTexto && coincideAudiencia;
    });
  }, [busqueda, filtroAudiencia, cursos]);

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPaginas = Math.ceil(cursosFiltrados.length / CURSOS_POR_PAGINA);
  
  const cursosPaginados = useMemo(() => {
    const ultimoIndice = paginaActual * CURSOS_POR_PAGINA;
    const primerIndice = ultimoIndice - CURSOS_POR_PAGINA;
    return cursosFiltrados.slice(primerIndice, ultimoIndice);
  }, [cursosFiltrados, paginaActual]);

  const handlePaginaActual = (nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  if (loading) return (
    <div className="loading-container-public">
      <Loader2 className="animate-spin" size={40} />
      <p>Buscando talleres disponibles...</p>
    </div>
  );

  return (
    <div className="catalogo-container">
      {/* SECCIÓN HERO */}
      <div className="catalogo-hero">
        <div className="catalogo-hero-content">
          <h1 className="catalogo-title">Formación y Talleres</h1>
          <p className="catalogo-subtitle">
            Cuidado profesional y guías prácticas diseñadas por especialistas.
          </p>

          <div className="main-search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="¿Qué tema te interesa aprender?"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
            />
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="filters-bar-container">
        <div className="filters-bar">
          <div className="filter-group">
            <Filter size={18} />
            <span className="filter-label">Dirigido a:</span>
            <select
              value={filtroAudiencia}
              onChange={(e) => { setFiltroAudiencia(e.target.value); setPaginaActual(1); }}
              className="filter-select"
            >
              <option value="Todos">Toda la Audiencia</option>
              <option value="Padres">Padres</option>
              <option value="Niños">Niños</option>
              <option value="Adolescentes">Adolescentes</option>
              <option value="Familia">Familia Completa</option>
            </select>
          </div>

          <div className="results-count">
             Mostrando <strong>{cursosFiltrados.length}</strong> resultados
          </div>
        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      <div className="cursos-grid-section">
        {cursosPaginados.length > 0 ? (
          <>
            <div className="cursos-grid">
              {cursosPaginados.map((curso) => (
                <CursoCard key={curso.id} {...curso} />
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={() => handlePaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft size={20} /> Anterior
                </button>
                
                <span className="pagination-info">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button 
                  className="pagination-btn"
                  onClick={() => handlePaginaActual(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  Siguiente <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state-public">
            <BookOpen size={60} />
            <h3>No hay cursos disponibles</h3>
            <p>Intenta con otros términos de búsqueda o filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}