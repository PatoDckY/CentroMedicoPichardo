"use client";
import React, { useState, useEffect, useMemo } from 'react';
import ServicioCard from './cards/ServicioCard'; 
import ServicioCardHorizontal from './cards/ServicioCardHorizontal';
import { Loader2, AlertCircle, LayoutGrid } from 'lucide-react';
import '../styles/SeccionServicios.css'; 

// 1. Interfaz fiel a tu Schema de Postgres (Drizzle)
interface ServicioAPI {
  idServicio: number;
  tituloServicio: string;
  descripcion: string | null;
  ubicacion: string | null;
  urlImage: string | null; // 👈 Sincronizado con schema
  textoAlt: string | null;  // 👈 Sincronizado con schema
  disenoTipo: string; 
}

interface ServicioFormateado {
  id: number;
  imagenSrc: string;
  altTexto: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  linkVerMas: string;
  disenoTipo: string; 
}

export default function SeccionServicios() {
  const [servicios, setServicios] = useState<ServicioFormateado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true);
        // 🛡️ Solo traemos los activos (el route.ts público ya debe filtrar esto)
        const res = await fetch('/api/servicios'); 
        
        if (!res.ok) throw new Error('No pudimos conectar con el catálogo de servicios');
        
        const data: ServicioAPI[] = await res.json();

        // 🔄 MAPEADO DINÁMICO: Traducimos del Schema al Componente
        const transformados = data.map((s) => ({
          id: s.idServicio,
          // Usamos la imagen de la DB, si no hay, ponemos una de respaldo
          imagenSrc: s.urlImage || "/images/servicios-placeholder.jpg",
          altTexto: s.textoAlt || s.tituloServicio,
          titulo: s.tituloServicio,
          descripcion: s.descripcion || "Consulta con nuestros especialistas los detalles de este servicio.",
          ubicacion: s.ubicacion || "Centro Médico Pichardo",
          linkVerMas: `/servicios/${s.idServicio}`,
          disenoTipo: s.disenoTipo || 'vertical',
        }));

        setServicios(transformados);
      } catch (err: any) {
        console.error("Error cargando servicios:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarServicios();
  }, []);

  // Memorizamos la división para evitar cálculos innecesarios en cada render
  const { verticales, horizontales } = useMemo(() => {
    return {
      verticales: servicios.filter(s => s.disenoTipo === 'vertical'),
      horizontales: servicios.filter(s => s.disenoTipo === 'horizontal')
    };
  }, [servicios]);

  if (loading) return (
    <div className="servicios-loading">
      <Loader2 className="animate-spin" size={48} color="#0A3D62" />
      <p>Sincronizando catálogo de atención...</p>
    </div>
  );

  if (error) return (
    <div className="servicios-error-container">
      <AlertCircle size={40} color="#EF4444" />
      <p>Ocurrió un detalle: {error}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">Reintentar conexión</button>
    </div>
  );

  return (
    <section className="seccion-servicios-container">
      <div className="servicios-header-text">
        <h2 className="servicios-titulo">Atención Médica Integral</h2>
        <p className="servicios-subtitulo">Soluciones especializadas para el crecimiento sano de tus hijos.</p>
      </div>
      
      {/* --- SECCIÓN VERTICAL (Grid Principal) --- */}
      {verticales.length > 0 && (
        <div className="servicios-grid vertical-grid">
          {verticales.map((servicio) => (
            <ServicioCard
              key={servicio.id}
              {...servicio} // Pasa imagenSrc, altTexto, titulo, etc.
            />
          ))}
        </div>
      )}
      
      {/* --- SECCIÓN HORIZONTAL (Destacados/Banner) --- */}
      {horizontales.length > 0 && (
        <div className="servicios-grid horizontal-grid">
          {horizontales.map((servicio) => (
            <ServicioCardHorizontal
              key={servicio.id}
              {...servicio}
            />
          ))}
        </div>
      )}
      
      {servicios.length === 0 && (
        <div className="empty-state">
          <LayoutGrid size={48} opacity={0.3} />
          <p>Estamos actualizando nuestros servicios. Vuelve pronto.</p>
        </div>
      )}

      <div className="servicios-footer">
        <button className="btn-ver-todos">
          Explorar todo el catálogo
        </button>
      </div>
    </section>
  );
}