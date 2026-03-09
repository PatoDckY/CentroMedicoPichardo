"use client";
import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import '../../../styles/Cursos/CursoModals.css';

interface CrearCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoCurso: any) => void;
}

export default function CrearCursoModal({ isOpen, onClose, onSave }: CrearCursoModalProps) {
  const [formData, setFormData] = useState({
    tituloCurso: '',
    descripcion: '',
    idInstructor: '', // Ahora es ID numérico
    categoria: 'Salud',
    fechaInicio: '',
    fechaFin: '',
    horario: '',
    modalidad: 'Presencial',
    dirigidoA: 'Padres',
    cupoMaximo: 20,
    costo: 0,
    ubicacion: '',
    urlImagenPortada: '' // Nombre real de la columna
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // El objeto se envía con los nombres que la API espera (Schema)
    const payload = {
      ...formData,
      idInstructor: Number(formData.idInstructor),
      cupoMaximo: Number(formData.cupoMaximo),
      costo: formData.costo.toString(), // Drizzle numeric requiere string
      urlImagenPortada: formData.urlImagenPortada || "/logo.png"
    };

    onSave(payload);
    
    // Limpiar
    setFormData({
      tituloCurso: '', descripcion: '', idInstructor: '', categoria: 'Salud',
      fechaInicio: '', fechaFin: '', horario: '', modalidad: 'Presencial',
      dirigidoA: 'Padres', cupoMaximo: 20, costo: 0, ubicacion: '', urlImagenPortada: ''
    });
  };

  return (
    <div className="course-modal-overlay">
      <div className="course-modal-container">
        <div className="course-modal-header">
          <h2 className="course-modal-title"><BookOpen size={24}/> Crear Nuevo Curso</h2>
          <button className="btn-close-course" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="course-modal-form">
          <div className="form-section-header">Información Básica</div>
          
          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Título del Curso</label>
              <input name="tituloCurso" value={formData.tituloCurso} onChange={handleChange} placeholder="Ej: Primeros Auxilios..." required />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="course-input-group">
              <label>ID Instructor (Médico)</label>
              <input type="number" name="idInstructor" value={formData.idInstructor} onChange={handleChange} placeholder="ID ej: 1" required />
            </div>
            <div className="course-input-group">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="Salud">Salud</option>
                <option value="Psicología">Psicología</option>
                <option value="Crianza">Crianza</option>
                <option value="Nutrición">Nutrición</option>
              </select>
            </div>
          </div>

          <div className="form-section-header">Logística y Fechas</div>

          <div className="form-grid-row cols-3">
            <div className="course-input-group">
              <label>Fecha Inicio</label>
              <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
            </div>
            <div className="course-input-group">
              <label>Fecha Fin</label>
              <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
            </div>
            <div className="course-input-group">
              <label>Horario</label>
              <input name="horario" value={formData.horario} onChange={handleChange} placeholder="09:00 - 13:00" required />
            </div>
          </div>

          <div className="form-grid-row cols-3">
            <div className="course-input-group">
              <label>Modalidad</label>
              <select name="modalidad" value={formData.modalidad} onChange={handleChange}>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div className="course-input-group">
              <label>Dirigido A</label>
              <select name="dirigidoA" value={formData.dirigidoA} onChange={handleChange}>
                <option value="Padres">Padres</option>
                <option value="Niños">Niños</option>
                <option value="Familia">Familia</option>
                <option value="Adolescentes">Adolescentes</option>
              </select>
            </div>
            <div className="course-input-group">
              <label>Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={formData.cupoMaximo} onChange={handleChange} />
            </div>
          </div>

          <div className="form-section-header">Detalles Finales</div>

          <div className="form-grid-row">
            <div className="course-input-group">
                <label>Ubicación (Sala/Zoom)</label>
                <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
            </div>
            <div className="course-input-group">
                <label>Costo</label>
                <input type="number" name="costo" value={formData.costo} onChange={handleChange} step="0.01" />
            </div>
          </div>

          <div className="course-input-group full-width">
            <label>URL Imagen de Portada</label>
            <input name="urlImagenPortada" value={formData.urlImagenPortada} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="course-modal-footer">
            <button type="button" className="btn-course-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-course-save">
              <Save size={18}/> Publicar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}