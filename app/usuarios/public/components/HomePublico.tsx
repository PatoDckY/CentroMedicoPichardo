"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, BookOpen, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

// Importamos tus componentes Card
import MedicoCard from './cards/MedicoCard'; 
import NoticiaBreveCard from './cards/NoticiaBreveCard'; 
import ServicioCard from './cards/ServicioCard'; 
import CursoCard from './cards/CursoCard'; 

import '../styles/HomePublico.css'; 

export default function HomePublico() {
    const [data, setData] = useState<any>({
        servicios: [],
        cursos: [],
        medicoDestacado: null,
        noticiaDestacada: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarHome = async () => {
            try {
                setLoading(true);
                // 🚀 Consumimos tus APIs según la estructura de carpetas de tu imagen
                const [resServicios, resCursos, resMedicos, resBlog] = await Promise.all([
                    fetch('/api/servicios'),
                    fetch('/api/cursos'),
                    fetch('/api/medicos'),
                    fetch('/api/publicaciones') // Según tu captura se llama 'publicaciones'
                ]);

                const [servs, curs, meds, blog] = await Promise.all([
                    resServicios.json(), resCursos.json(), resMedicos.json(), resBlog.json()
                ]);

                setData({
                    // Mapeo para ServicioCard (imagen -> imagenSrc)
                    servicios: (Array.isArray(servs) ? servs : []).filter((s: any) => s.activo).slice(0, 3).map((s: any) => ({
                        ...s,
                        imagenSrc: s.imagen || "/pediatric-illustration.png",
                        titulo: s.nombre || s.titulo
                    })),

                    // Cursos: Los pasamos directo si coinciden con las props
                    cursos: (Array.isArray(curs) ? curs : []).filter((c: any) => c.activo).slice(0, 2),

                    // Médico Destacado: Buscamos a Pichardo o el primero activo
                    medicoDestacado: (() => {
                        const listaMeds = Array.isArray(meds) ? meds : [];
                        const pichardo = listaMeds.find((m: any) => m.nombre?.toUpperCase().includes("PICHARDO")) || listaMeds[0];
                        if (!pichardo) return null;
                        return {
                            ...pichardo,
                            imagenSrc: pichardo.imagen || "/Pichardo.jpg"
                        };
                    })(),

                    // Noticia: Mapeo para NoticiaBreveCard (imagen -> imagenSrc)
                    noticiaDestacada: (() => {
                        const listaNotas = Array.isArray(blog) ? blog : [];
                        const nota = listaNotas.filter((b: any) => b.activo)[0];
                        if (!nota) return null;
                        return {
                            ...nota,
                            imagenSrc: nota.imagen || "/logo.png",
                            bajada: nota.resumen || nota.contenido?.substring(0, 120) + "..."
                        };
                    })()
                });
            } catch (error) {
                console.error("❌ Error en HomePublico:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarHome();
    }, []);

    if (loading) return (
        <div className="home-loading">
            <Loader2 className="animate-spin" size={48} color="#0A3D62" />
            <p>Cargando información del Centro Médico Pichardo...</p>
        </div>
    );

    return (
        <div className="home-publico-container">
            {/* HERO BANNER */}
            <section className="hero-publico">
                <div className="hero-contenido">
                    <h1 className="hero-title">
                        Bienvenido al <span className="highlight-span">Centro Médico Pichardo</span>
                    </h1>
                    <p className="hero-text-large">
                        Atención pediátrica de excelencia liderada por el <strong>Dr. Francisco Javier Moreno Pichardo</strong>.
                    </p>
                    <div className="hero-cta-buttons">
                        <Link href="/usuarios/public/screens/DirectorioMedico" className="btn-hero-cta primary">
                            <Stethoscope size={20} /> Directorio Médico
                        </Link>
                        <Link href="/usuarios/public/screens/Academia" className="btn-hero-cta secondary">
                            <BookOpen size={20} /> Academia Infantil
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* SERVICIOS DESTACADOS */}
            <section className="seccion-destacada">
                <h2 className="section-title">Servicios para su Familia</h2>
                <div className="servicios-grid-home">
                    {data.servicios.map((s: any) => (
                        <ServicioCard key={s.id} {...s} />
                    ))}
                </div>
            </section>

            {/* CURSOS ACADEMIA */}
            <section className="seccion-destacada cursos-home-section">
                <div className="header-flex">
                    <h2 className="section-title left-aligned">Próximos Cursos</h2>
                    <Link href="/usuarios/public/screens/CatalogoCursos" className="btn-ver-catalogo">
                        Ver Todo <ArrowRight size={18}/>
                    </Link>
                </div>
                <div className="cursos-home-grid">
                    {data.cursos.map((curso: any) => (
                        <CursoCard key={curso.id} {...curso} />
                    ))}
                </div>
            </section>

            {/* MÉDICO DESTACADO */}
            {data.medicoDestacado && (
                <section className="seccion-destacada sobre-nosotros-medico">
                    <div className="sobre-nosotros-contenido">
                        <h2 className="section-title left-aligned">Nuestro Liderazgo</h2>
                        <p>Atención humana y profesional a cargo del <strong>{data.medicoDestacado.nombre}</strong>.</p>
                        <Link href="/usuarios/public/screens/QuienesSomos" className="link-ver-todo">
                            Conocer más &rarr;
                        </Link>
                    </div>
                    <div className="medico-destacado-wrapper">
                        <MedicoCard {...data.medicoDestacado} />
                    </div>
                </section>
            )}

            {/* NOTICIAS / BLOG */}
            <section className="seccion-destacada noticias-y-academia">
                 <div className="noticias-content-wrapper">
                    <h2 className="section-title left-aligned">Últimas Noticias</h2>
                    {data.noticiaDestacada && (
                        <NoticiaBreveCard {...data.noticiaDestacada} />
                    )}
                </div>
                <div className="academia-cta-home">
                    <h2 className="section-title white-text">Academia Infantil</h2>
                    <Link href="/usuarios/public/screens/Academia" className="btn-academia-home">
                        <UserPlus size={20} /> Inscribirse
                    </Link>
                </div>
            </section>
        </div>
    );
}