"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Stethoscope, GraduationCap, FileText, 
  Globe, Activity, ArrowRight, Bell, Loader2 
} from 'lucide-react';
import '../../styles/Dashboard/Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    medicos: 0,
    cursos: 0,
    blog: 0,
    servicios: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        
        setStats({
          usuarios: Number(data.usuarios) || 0,
          medicos: Number(data.medicos) || 0,
          cursos: Number(data.cursos) || 0,
          blog: Number(data.blog) || 0,
          servicios: Number(data.servicios) || 0
        });
      } catch (error) {
        console.error("❌ Error en la carga de datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const SECTIONS = [
    { title: "Gestión de Usuarios", desc: "Pacientes con cuenta activa.", icon: <Users size={32} />, path: "/usuarios/admin/screens/Usuarios", color: "blue", stat: `${stats.usuarios} Activos` },
    { title: "Directorio Médico", desc: "Especialistas disponibles hoy.", icon: <Stethoscope size={32} />, path: "/usuarios/admin/screens/Directorio", color: "green", stat: `${stats.medicos} Médicos` },
    { title: "Cursos y Talleres", desc: "Oferta educativa vigente.", icon: <GraduationCap size={32} />, path: "/usuarios/admin/screens/Cursos", color: "orange", stat: `${stats.cursos} Activos` },
    { title: "Blog de Noticias", desc: "Publicaciones visibles.", icon: <FileText size={32} />, path: "/usuarios/admin/screens/blog", color: "purple", stat: `${stats.blog} Entradas` },
    { title: "Servicios Clínicos", desc: "Catálogo de servicios actual.", icon: <Activity size={32} />, path: "/usuarios/admin/screens/Servicios", color: "red", stat: `${stats.servicios} Servicios` },
    { title: "Academia Infantil", desc: "Contenido para padres.", icon: <Globe size={32} />, path: "/usuarios/admin/screens/Academia", color: "teal", stat: "Gestionar" },
  ];

  if (loading) return (
    <div className="dashboard-loading-full">
      <Loader2 className="animate-spin" size={48} />
      <p>Sincronizando Centro Médico Pichardo...</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="welcome-text">
            <h1>¡Hola, Administrador! 👋</h1>
            <p className="welcome-subtitle">Panel de Control: **Recursos Activos**</p>
          </div>
          <div className="notifications-card">
            <Bell size={20} />
            <div className="notif-text">
                <strong>Base de Datos</strong>
                <br/><small>Filtrando contenido activo</small>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="shortcuts-grid">
          {SECTIONS.map((section, index) => (
            <Link href={section.path} key={index} className={`shortcut-card ${section.color}`}>
              <div className="shortcut-header">
                <div className="icon-wrapper">{section.icon}</div>
                <span className="shortcut-stat">{section.stat}</span>
              </div>
              <div className="shortcut-body">
                <h3>{section.title}</h3>
                <p>{section.desc}</p>
              </div>
              <div className="shortcut-footer">
                <span>Gestionar</span>
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}