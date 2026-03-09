"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, ImageIcon, Tag, User, AlignLeft, Edit3, Loader2, Eye, EyeOff } from 'lucide-react';
import '../../../styles/Academia/CrearPublicacionModal.css';

interface EditarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  guia: any;
}

export default function EditarPublicacionModal({ isOpen, onClose, onSave, guia }: EditarProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    bajada: '',
    descripcionLarga: '',
    imagenSrc: '',
    etiquetas: '',
    idAutor: '',
    activo: true
  });

  useEffect(() => {
    if (guia && isOpen) {
      setFormData({
        titulo: guia.titulo || '',
        bajada: guia.bajada || '',
        descripcionLarga: guia.descripcionLarga || '',
        imagenSrc: guia.imagenSrc || '',
        etiquetas: guia.etiquetas || '',
        idAutor: guia.idAutor || '',
        activo: guia.activo ?? true
      });
    }
  }, [guia, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Enviamos el ID original + los datos mapeados
      await onSave({ 
        id_guia: guia.id_guia, 
        ...formData 
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title"><Edit3 size={20} /> Editar Guía</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Estado de Visibilidad</label>
            <div className="status-toggle-container">
               <button 
                  type="button" 
                  className={`btn-status-toggle ${formData.activo ? 'active' : 'hidden'}`}
                  onClick={() => setFormData({...formData, activo: !formData.activo})}
               >
                  {formData.activo ? <Eye size={16}/> : <EyeOff size={16}/>}
                  {formData.activo ? "Visible en la Web" : "Oculto (Borrador)"}
               </button>
            </div>
          </div>

          <div className="form-group">
            <label>Título</label>
            <input 
              type="text" 
              value={formData.titulo} 
              onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción Corta</label>
            <textarea 
              value={formData.bajada} 
              onChange={(e) => setFormData({...formData, bajada: e.target.value})} 
              rows={2}
              required 
            />
          </div>

          <div className="form-group">
            <label><AlignLeft size={16}/> Contenido Completo</label>
            <textarea 
              value={formData.descripcionLarga} 
              onChange={(e) => setFormData({...formData, descripcionLarga: e.target.value})} 
              rows={8}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label><User size={16}/> ID Autor</label>
              <input 
                type="number" 
                value={formData.idAutor} 
                onChange={(e) => setFormData({...formData, idAutor: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group half">
              <label><Tag size={16}/> Etiquetas</label>
              <input 
                type="text" 
                value={formData.etiquetas} 
                onChange={(e) => setFormData({...formData, etiquetas: e.target.value})} 
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? " Guardando..." : " Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}