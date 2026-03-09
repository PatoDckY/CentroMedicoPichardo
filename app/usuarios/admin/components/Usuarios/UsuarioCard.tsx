"use client";
import React from 'react';
import { Mail, Phone, UserCog, ShieldCheck, ShieldAlert } from 'lucide-react';
// 🕵️ El import ahora funcionará correctamente
import { Usuario } from './GestionUsuarios'; 
import '../../styles/Usuarios/UsuarioCard.css';

interface UsuarioCardProps {
  usuario: Usuario;
  onEdit: () => void;
}

export default function UsuarioCard({ usuario, onEdit }: UsuarioCardProps) {
  const getRoleClass = (rol: string) => {
    switch(rol) {
        case 'Admin': return 'badge-admin';
        case 'Medico': return 'badge-medico';
        default: return 'badge-cliente';
    }
  };

  return (
    <div className="usuario-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {usuario.nombre.charAt(0)}{usuario.apellidoPaterno.charAt(0)}
        </div>
        <span className={`role-badge ${getRoleClass(usuario.rolNombre)}`}>
            {usuario.rolNombre === 'Admin' ? <ShieldAlert size={12}/> : <ShieldCheck size={12}/>}
            {usuario.rolNombre || 'Sin Rol'}
        </span>
      </div>
      <div className="user-card-body">
        <h3 className="user-name">{usuario.nombre} {usuario.apellidoPaterno}</h3>
        <div className="info-row"><Mail size={14}/> <span>{usuario.correo}</span></div>
        <div className="info-row"><Phone size={14}/> <span>{usuario.telefono || 'N/A'}</span></div>
      </div>
      <div className="user-card-footer">
        <button className="btn-edit-role" onClick={onEdit}>
          <UserCog size={16} /> Cambiar Rol
        </button>
      </div>
    </div>
  );
}