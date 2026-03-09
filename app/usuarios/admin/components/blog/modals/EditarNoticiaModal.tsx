"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, FileText, User, Tag, Image as ImageIcon, AlignLeft, Eye, EyeOff } from 'lucide-react';
import '../../../styles/blog/NoticiaModal.css';

export default function EditarNoticiaModal({ isOpen, onClose, onSave, noticia }: any) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noticia && isOpen) {
      setFormData({
        ...noticia,
        titulo: noticia.tituloNoticia,
        bajada: noticia.resumenBajada,
        contenido: noticia.contenidoCompleto,
        idAutor: noticia.idAutor, // 👈 Sincronizamos el ID aquí
        imagenSrc: noticia.urlImagen,
        etiquetasInput: noticia.etiquetas || '',
        activo: noticia.activo ?? true
      });
    }
  }, [noticia, isOpen]);

  if (!isOpen || !formData.idPublicacion) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idAutor || isNaN(Number(formData.idAutor))) {
      alert("El ID del autor es obligatorio para guardar cambios.");
      return;
    }

    setLoading(true);

    const payload = {
      idPublicacion: formData.idPublicacion,
      titulo: formData.titulo,
      bajada: formData.bajada,
      contenido: formData.contenido,
      idAutor: Number(formData.idAutor),
      urlImagen: formData.urlImagen,
      etiquetas: formData.etiquetas,
      activo: formData.activo,
      fechaPublicacion: formData.fechaPublicacion // Mantener la original
    };

    try {
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noticia-modal-overlay">
      <div className="noticia-modal-container">
        <div className="noticia-modal-header">
          <h2 className="noticia-modal-title"><FileText size={22} /> Editar Publicación</h2>
          <button className="btn-close-noticia" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="noticia-modal-form">
          <div className="form-group">
            <label>Estado en la Web</label>
            <button
              type="button"
              className={`btn-toggle-status ${formData.activo ? 'active' : 'hidden'}`}
              onClick={() => setFormData({ ...formData, activo: !formData.activo })}
            >
              {formData.activo ? <Eye size={16} /> : <EyeOff size={16} />}
              {formData.activo ? "Visible al Público" : "Oculto (Borrador)"}
            </button>
          </div>

          <div className="form-group">
            <label>Título</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Resumen (Bajada)</label>
            <textarea name="bajada" value={formData.bajada} onChange={handleChange} rows={2} required />
          </div>

          <div className="form-group">
            <label><AlignLeft size={16} /> Contenido Completo</label>
            <textarea name="contenido" value={formData.contenido} onChange={handleChange} rows={10} required />
          </div>

          <div className="form-row-noticia">
            <div className="form-group">
              <label><User size={14} /> ID Autor</label>
              <input type="number" name="idAutor" value={formData.idAutor} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><Tag size={14} /> Etiquetas</label>
              <input name="etiquetas" value={formData.etiquetas} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label><ImageIcon size={14} /> URL Imagen</label>
            <input name="urlImagen" value={formData.urlImagen} onChange={handleChange} />
          </div>

          <div className="noticia-modal-footer">
            <button type="button" className="btn-noticia-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-noticia-save" disabled={loading}>
              <Save size={18} /> {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}