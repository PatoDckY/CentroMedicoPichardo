"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, UserX, RotateCcw, AlertCircle } from 'lucide-react';
import MedicoCard from './cards/MedicoCard';
import '../styles/DirectorioMedicos.css';

export default function DirectorioMedicos() {
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/medicos');
        if (!res.ok) throw new Error(`Error ${res.status}: Falló la conexión`);
        
        const data = await res.json();
        
        // 🛡️ MANEJO DE ESTRUCTURA FLEXIBLE
        // Buscamos la lista dentro de 'data', 'medicos' o el array directo
        const rawList = Array.isArray(data) ? data : (data.data || data.medicos || []);

        // 🔄 MAPEO "A PRUEBA DE BALAS"
        // Buscamos tanto camelCase como snake_case para no fallar
        const mapped = rawList.map((med: any) => ({
          id: med.idMedico || med.id_medico,
          nombre: med.nombreCompleto || med.nombre_completo || "Especialista",
          especialidad: med.especialidad || "Pediatría",
          hospital: med.hospitalClinica || med.hospital_clinica || "Centro Médico Pichardo",
          direccion: med.direccion || "Dirección no disponible",
          imagenSrc: med.urlFoto || med.url_foto || "/default-doctor.jpg",
          linkVerMas: `/directorio/${med.idMedico || med.id_medico}`
        }));

        setMedicos(mapped);
      } catch (err: any) {
        console.error("Error en Directorio Front:", err);
        setError("No pudimos cargar la lista de médicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicos();
  }, []);

  // Filtrado por nombre o especialidad
  const filteredMedicos = useMemo(() => {
    return medicos.filter(med => 
      (med.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (med.especialidad?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, medicos]);

  if (loading) return (
    <div className="state-container">
      <Loader2 className="animate-spin" size={48} color="#0a3d62" />
      <p>Cargando especialistas...</p>
    </div>
  );

  return (
    <div className="directorio-page-container">
      <header className="directorio-header">
        <div className="header-overlay"></div>
        <div className="header-content-public">
          <h1 className="header-title">Directorio Médico</h1>
          <p className="header-tagline">Atención profesional para tu familia.</p>
        </div>
      </header>

      <div className="search-bar-wrapper">
        <div className="search-card">
          <div className="input-with-icon">
            <Search className="icon-left" size={20} />
            <input
              type="text"
              placeholder="Busca por especialidad o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="directorio-main-content">
        {error ? (
          <div className="state-container error">
            <AlertCircle size={40} />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">Reintentar</button>
          </div>
        ) : (
          <>
            <div className="results-header">
              <span className="count-badge">
                {searchTerm ? `${filteredMedicos.length} resultados` : `${filteredMedicos.length} especialistas disponibles`}
              </span>
            </div>

            {filteredMedicos.length > 0 ? (
              <div className="medicos-grid">
                {filteredMedicos.map((medico) => (
                  <MedicoCard key={medico.id} {...medico} />
                ))}
              </div>
            ) : (
              <div className="state-container empty">
                <UserX size={64} />
                <h3>No se encontraron médicos</h3>
                <p>Intenta con otra búsqueda o limpia los filtros.</p>
                {searchTerm && <button onClick={() => setSearchTerm('')} className="clear-btn">Ver todos</button>}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}