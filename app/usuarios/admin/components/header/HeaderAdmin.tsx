// components/HeaderAdmin.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, X, ShieldCheck, LayoutDashboard, 
  Globe, Stethoscope, GraduationCap, FileText, Settings, 
  Users, Database
} from "lucide-react";
import ProfileMenuAdmin from "@/app/usuarios/client/components/Profile/ProfileMenu"; 
import "../../styles/header/HeaderAdmin.css"; 

export default function HeaderAdmin() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <>
      {/* --- 1. TOP BAR ADMIN --- */}
      <div className="top-bar-admin">
        <div className="top-bar-container">
          <div className="admin-badge">
            <ShieldCheck size={16} /> 
            <span>Modo Administrador</span>
          </div>
          <div className="top-bar-links">
            <Link href="/usuarios/public/screens/HomePublico" target="_blank">
               Ver Sitio en Vivo &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. HEADER PRINCIPAL --- */}
      <header className={`header-admin ${scrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          
          {/* LOGO */}
          <Link href="/usuarios/admin/screens/Dashboard" className="logo-area">
            <Image 
                src="/logo.png" 
                alt="Logo Admin" 
                width={45} 
                height={45} 
                className="logo-img"
            />
            <div className="logo-text-wrapper">
                <span className="logo-title">Panel de Control</span>
                <span className="logo-subtitle">Administración</span>
            </div>
          </Link>

          {/* NAVEGACIÓN DESKTOP (Reorganizada) */}
          <nav className="nav-desktop">
            
            <Link href="/usuarios/admin/screens/Dashboard" className="nav-link">
               <LayoutDashboard size={18} /> Dashboard
            </Link>

            <Link href="/usuarios/admin/screens/Respaldo" className="nav-link">
               <Database size={18} /> Respaldo
            </Link>

            {/* Gestión de Contenido (Home, Nosotros, Servicios) */}
            <Link href="/usuarios/admin/screens/Servicios" className="nav-link">
               <Globe size={18} /> Servicios
            </Link>
            
            {/* Cursos */}
            <Link href="/usuarios/admin/screens/Cursos" className="nav-link">
               <GraduationCap size={18} /> Cursos
            </Link>

            {/* Gestión de Médicos */}
            <Link href="/usuarios/admin/screens/Directorio" className="nav-link">
               <Stethoscope size={18} /> Directorio
            </Link>

            {/* Gestión Educativa */}
            <Link href="/usuarios/admin/screens/Academia" className="nav-link">
               <GraduationCap size={18} /> Academia
            </Link>

            {/* Gestión de Noticias */}
            <Link href="/usuarios/admin/screens/blog" className="nav-link">
               <FileText size={18} /> Blog
            </Link>

            <Link href="/usuarios/admin/screens/Usuarios" className="nav-link">
               <Users size={18} /> Usuarios
            </Link>

          </nav>

          {/* SECCIÓN DERECHA */}
          <div className="right-section">
            <div className="profile-wrapper">
                <ProfileMenuAdmin />
            </div>

            <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
                {menuAbierto ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>

        {/* --- 3. MENÚ MÓVIL --- */}
        <div className={`mobile-menu ${menuAbierto ? "open" : ""}`}>
          <nav className="nav-mobile">
            <div className="mobile-label">General</div>
            <Link href="/usuarios/admin/screens/Dashboard" onClick={toggleMenu}>
               <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link href="/usuarios/admin/screens/Configuracion" onClick={toggleMenu}>
               <Settings size={18} /> Configuración General
            </Link>

            <div className="mobile-divider"></div>
            
            <div className="mobile-label">Contenido</div>
            <Link href="/usuarios/admin/screens/GestionWeb" onClick={toggleMenu}>
               <Globe size={18} /> Home, Nosotros, Servicios
            </Link>
            <Link href="/usuarios/admin/screens/GestionDirectorio" onClick={toggleMenu}>
               <Stethoscope size={18} /> Directorio Médico
            </Link>
            <Link href="/usuarios/admin/screens/Academia" onClick={toggleMenu}>
               <GraduationCap size={18} /> Academia & Cursos
            </Link>
            <Link href="/usuarios/admin/screens/GestionBlog" onClick={toggleMenu}>
               <FileText size={18} /> Blog de Noticias
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}