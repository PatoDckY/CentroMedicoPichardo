"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Target, Eye, Handshake, Heart, Loader2 } from 'lucide-react';
import '../styles/QuienesSomos.css';

// Interfaz para TypeScript basada en tu esquema de base de datos
interface NosotrosData {
  mision: string;
  vision: string;
  valores: string[];
  nuestraHistoria: string;
  compromiso: string;
  urlImagen: string;
}

export default function QuienesSomos() {
  const [data, setData] = useState<NosotrosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNosotros = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/nosotros');
        if (!res.ok) throw new Error('Error al cargar la información');
        
        const result = await res.json();
        // Recordamos que el API devuelve el objeto directo resultado[0]
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNosotros();
  }, []);

  // Estado de carga profesional
  if (loading) {
    return (
      <div className="loading-container-nosotros">
        <Loader2 className="animate-spin" size={48} color="#0070f3" />
        <p>Cargando nuestra historia...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="error-container">
        <p>No se pudo cargar la sección. Por favor, intente más tarde.</p>
      </div>
    );
  }

  return (
    <div className="quienes-somos-container">
      
      {/* --- SECCIÓN HERO Y TÍTULO (Mantenemos el estilo visual) --- */}
      <header className="quienes-somos-header">
        <div className="header-content">
          <h1 className="main-title">
            Centro Médico Pichardo: <span className="highlight-text">Cuidado Pediátrico con Propósito</span>
          </h1>
          <p className="intro-text">
            Somos más que una clínica; somos el aliado de su familia en el viaje más importante: el crecimiento y bienestar de sus hijos.
          </p>
        </div>
      </header>
      
      {/* --- SECCIÓN DE COMPROMISO (Datos desde API) --- */}
      <section className="compromiso-mvv">
        <div className="compromiso-card">
          <Target size={36} className="mvv-icon mission-icon" />
          <h2 className="mvv-title">Misión</h2>
          <p className="mvv-description">{data.mision}</p>
        </div>

        <div className="compromiso-card">
          <Eye size={36} className="mvv-icon vision-icon" />
          <h2 className="mvv-title">Visión</h2>
          <p className="mvv-description">{data.vision}</p>
        </div>
        
        <div className="compromiso-card">
          <Handshake size={36} className="mvv-icon values-icon" />
          <h2 className="mvv-title">Valores</h2>
          <ul className="values-list">
            {data.valores.map((valor, index) => (
              <li key={index}>
                <Heart size={16} /> {valor}
              </li>
            ))}
          </ul>
        </div>
      </section>
      
      {/* --- SECCIÓN DE HISTORIA Y COMPROMISO (Combinado) --- */}
      <section className="historia-y-compromiso">
        
        <div className="historia-content">
          <h2 className="content-title">Nuestra Historia</h2>
          {/* Mostramos la historia cargada desde la DB */}
          <p>{data.nuestraHistoria}</p>
          
          <div className="compromiso-destacado-box">
             <h2 className="content-title">Nuestro Compromiso</h2>
             <p>{data.compromiso}</p>
             <p><strong>¡Su tranquilidad es nuestro motor!</strong></p>
          </div>
        </div>
        
        <div className="historia-image-wrapper">
          <Image 
            src={data.urlImagen || "/pediatric-illustration.png"} 
            alt="Ilustración de cuidado pediátrico"
            width={450}
            height={450}
            className="historia-image"
            priority // Carga prioritaria por ser parte del contenido principal
          />
        </div>
        
      </section>
      
    </div>
  );
}