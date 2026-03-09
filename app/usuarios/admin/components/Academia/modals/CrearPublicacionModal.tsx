"use client";
import React, { useState } from 'react';
import { X, Save, ImageIcon, Tag, User, AlignLeft, FileText, Loader2 } from 'lucide-react';
import '../../../styles/Academia/CrearPublicacionModal.css';

interface CrearProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function CrearPublicacionModal({ isOpen, onClose, onSave }: CrearProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    bajada: '',
    descripcionLarga: '',
    imagenSrc: '',
    etiquetas: '',
    idAutor: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🛡️ Mapeo de nombres para que coincidan con el Schema/API
      const dataParaAPI = {
        titulo: formData.titulo,
        bajada: formData.bajada,
        descripcionLarga: formData.descripcionLarga,
        imagenSrc: formData.imagenSrc,
        etiquetas: formData.etiquetas,
        idAutor: formData.idAutor,
        activo: true // Las nuevas guías nacen activas
      };

      await onSave(dataParaAPI);
      setFormData({ titulo: '', bajada: '', descripcionLarga: '', imagenSrc: '', etiquetas: '', idAutor: '' });
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
          <h2 className="modal-title"><FileText size={20} /> Nueva Guía Educativa</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Título de la Guía</label>
            <input 
              type="text" 
              value={formData.titulo} 
              onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
              placeholder="Ej: Higiene Bucal en Niños"
              required 
            />
          </div>

          <div className="form-group">
            <label>Resumen Corto (Para la tarjeta)</label>
            <textarea 
              value={formData.bajada} 
              onChange={(e) => setFormData({...formData, bajada: e.target.value})} 
              placeholder="Breve introducción..."
              rows={2}
              required 
            />
          </div>

          <div className="form-group">
            <label><AlignLeft size={16}/> Contenido Completo</label>
            <textarea 
              value={formData.descripcionLarga} 
              onChange={(e) => setFormData({...formData, descripcionLarga: e.target.value})} 
              placeholder="Desarrolla todo el tema aquí..."
              rows={6}
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
                placeholder="salud, prevención" 
              />
            </div>
          </div>

          <div className="form-group">
            <label><ImageIcon size={16}/> URL de Imagen</label>
            <input 
              type="text" 
              value={formData.imagenSrc} 
              onChange={(e) => setFormData({...formData, imagenSrc: e.target.value})} 
              placeholder="/imagen.jpg" 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? " Guardando..." : " Publicar Guía"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}