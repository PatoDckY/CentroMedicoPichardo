"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';
import '../../styles/Usuarios/UsuarioModal.css';

export default function EditarRolModal({ isOpen, onClose, onSave, usuario, roles }: any) {
  const [rolIdSeleccionado, setRolIdSeleccionado] = useState<number | string>("");

  useEffect(() => {
    if (usuario && isOpen) {
      setRolIdSeleccionado(usuario.rolId || "");
    }
  }, [usuario, isOpen]);

  if (!isOpen || !usuario) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(usuario.id, Number(rolIdSeleccionado));
  };

  return (
    <div className="usuario-modal-overlay" onClick={onClose}>
      <div className="usuario-modal-container small" onClick={(e) => e.stopPropagation()}>
        <div className="usuario-modal-header">
          <h2 className="usuario-modal-title"><Shield size={20}/> Gestionar Permisos</h2>
          <button className="btn-close-usuario" onClick={onClose}><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="usuario-modal-form">
          <div className="form-info-box">
            <p>Estás editando el nivel de acceso para:</p>
            <strong>{usuario.nombre} {usuario.apellidoPaterno}</strong>
          </div>
            
          <div className="input-group">
            <label>Selecciona el nuevo Rol:</label>
            <select 
                className="role-select-large"
                value={rolIdSeleccionado} 
                onChange={(e) => setRolIdSeleccionado(e.target.value)}
                required
            >
              <option value="" disabled>-- Selecciona un rol --</option>
              {roles && roles.length > 0 ? (
                roles.map((rol: any) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay roles en la base de datos...</option>
              )}
            </select>
          </div>

          <div className="usuario-modal-footer">
              <button type="button" className="btn-usuario-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-usuario-save">
                  <Save size={18}/> Guardar Cambios
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}