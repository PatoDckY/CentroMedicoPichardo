"use client";
import React, { useState } from 'react';
import { X, Save, FileText, User, Tag, Image as ImageIcon, AlignLeft } from 'lucide-react';
import '../../../styles/blog/NoticiaModal.css';

interface CrearNoticiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevaNoticia: any) => Promise<void>;
}

export default function CrearNoticiaModal({ isOpen, onClose, onSave }: CrearNoticiaModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    bajada: '',
    contenido: '',
    idAutor: '',
    imagenSrc: '',
    etiquetasInput: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ Validación preventiva
    if (!formData.idAutor || isNaN(Number(formData.idAutor))) {
      alert("Por favor, ingresa un ID de autor válido.");
      return;
    }

    setLoading(true);

    const payload = {
      titulo: formData.titulo,
      bajada: formData.bajada,
      contenido: formData.contenido,
      idAutor: Number(formData.idAutor),
      urlImagen: formData.imagenSrc || "/logo.png",
      etiquetas: formData.etiquetasInput,
      activo: true 
    };

    try {
      await onSave(payload);
      setFormData({ titulo: '', bajada: '', contenido: '', idAutor: '', imagenSrc: '', etiquetasInput: '' });
      onClose();
    } catch (error) {
      console.error("Error al publicar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noticia-modal-overlay">
      <div className="noticia-modal-container">
        <div className="noticia-modal-header">
          <h2 className="noticia-modal-title"><FileText size={22}/> Redactar Nueva Publicación</h2>
          <button className="btn-close-noticia" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="noticia-modal-form">
          <div className="form-group">
            <label>Título de la Noticia</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: Importancia de la Vitamina D" required />
          </div>

          <div className="form-group">
            <label>Resumen Corto (Bajada)</label>
            <textarea name="bajada" value={formData.bajada} onChange={handleChange} placeholder="Breve descripción para el catálogo..." rows={2} required />
          </div>

          <div className="form-group">
            <label><AlignLeft size={16}/> Contenido Completo del Artículo</label>
            <textarea name="contenido" value={formData.contenido} onChange={handleChange} placeholder="Desarrolla toda la noticia aquí..." rows={8} required />
          </div>

          <div className="form-row-noticia">
            <div className="form-group">
              <label><User size={14}/> ID del Autor</label>
              <input type="number" name="idAutor" value={formData.idAutor} onChange={handleChange} placeholder="ID médico" required />
            </div>
            <div className="form-group">
              <label><Tag size={14}/> Etiquetas</label>
              <input name="etiquetasInput" value={formData.etiquetasInput} onChange={handleChange} placeholder="salud, nutrición" />
            </div>
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL Imagen de Portada</label>
            <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="noticia-modal-footer">
            <button type="button" className="btn-noticia-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-noticia-save" disabled={loading}>
              <Save size={18}/> {loading ? "Publicando..." : "Publicar Noticia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}