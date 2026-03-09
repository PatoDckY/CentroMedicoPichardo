"use client";
import React, { useState, useEffect } from 'react';
import NoticiaBreveCard from './cards/NoticiaBreveCard'; 
import BlogSidebarPediatria from './SideBars/BlogSidebarPediatria'; 
import { Loader2, Newspaper, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import '../styles/NoticiasFeed.css'; 

interface Publicacion {
  idPublicacion: number;
  tituloNoticia: string;
  resumenBajada: string;
  nombreAutor?: string;
  fechaPublicacion: string;
  urlImagen: string | null;
  etiquetas: string | null;
}

export default function NoticiasFeed() {
  const [noticias, setNoticias] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  
  const LIMITE = 5;

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const offset = (paginaActual - 1) * LIMITE;
        // 🛡️ Al no enviar ?admin=true, la API solo nos da las publicaciones activas
        const res = await fetch(`/api/publicaciones?limit=${LIMITE}&offset=${offset}`);
        
        if (!res.ok) throw new Error('No pudimos conectar con el servidor de noticias');
        
        const responseData = await res.json();
        
        // Sincronizamos con el formato { data, total } de nuestra API
        setNoticias(responseData.data || []);
        setTotalPaginas(Math.ceil((responseData.total || 0) / LIMITE));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        // Scroll suave al inicio al cambiar de página para mejorar la UX
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchNoticias();
  }, [paginaActual]);

  if (loading) {
    return (
      <div className="noticias-loading-state">
        <Loader2 className="animate-spin" size={40} color="#0a3d62" />
        <p>Sincronizando últimas noticias...</p>
      </div>
    );
  }

  return (
    <div className="noticias-feed-layout">
      <div className="noticias-content-area">
        <header className="blog-header">
          <h1 className="blog-category-main-title">Noticias y Consejos Pediátricos</h1>
          <p className="blog-description">Información confiable para el cuidado de los más pequeños.</p>
        </header>

        {error && (
          <div className="noticias-error-box">
            <AlertCircle size={20} /> {error}
          </div>
        )}
        
        <div className="noticias-grid-wrapper">
          {noticias.length > 0 ? (
            <>
              {noticias.map((noticia, index) => (
                <div 
                  key={noticia.idPublicacion} 
                  className={index === 0 && paginaActual === 1 ? "noticia-destacada" : "noticia-normal"}
                >
                  <NoticiaBreveCard
                    imagenSrc={noticia.urlImagen || "/logo.png"}
                    altTexto={noticia.tituloNoticia}
                    titulo={noticia.tituloNoticia}
                    bajada={noticia.resumenBajada}
                    autor={noticia.nombreAutor || "Especialista FixFlow"}
                    fecha={new Date(noticia.fechaPublicacion).toLocaleDateString('es-MX', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                    linkVerMas={`/blog/${noticia.idPublicacion}`}
                    etiquetas={noticia.etiquetas ? noticia.etiquetas.split(',') : []}
                  />
                </div>
              ))}

              {/* CONTROLES DE PAGINACIÓN */}
              {totalPaginas > 1 && (
                <div className="pagination-controls">
                  <button 
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual(prev => prev - 1)}
                    className="pagination-btn"
                  >
                    <ChevronLeft size={20} /> Anterior
                  </button>

                  <div className="pagination-info">
                    Página <span>{paginaActual}</span> de {totalPaginas}
                  </div>

                  <button 
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual(prev => prev + 1)}
                    className="pagination-btn"
                  >
                    Siguiente <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-blog-state">
              <Newspaper size={48} strokeWidth={1} />
              <h3>¡Ups! No hay noticias aquí</h3>
              <p>Parece que aún no hay publicaciones activas en esta sección.</p>
            </div>
          )}
        </div>
      </div>

      <aside className="noticias-sidebar-area">
        <BlogSidebarPediatria />
      </aside>
    </div>
  );
}