"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, Eye, EyeOff, Info, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import '../../../styles/Cursos/CursoModals.css';

interface EditarCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cursoActualizado: any) => void;
  curso: any;
}

export default function EditarCursoModal({ isOpen, onClose, onSave, curso }: EditarCursoModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // 🔄 Sincronizar datos cuando se abre el modal
  useEffect(() => {
    if (curso && isOpen) {
      setFormData({
        ...curso,
        // Aseguramos formatos correctos para los inputs
        costo: curso.costo ? Number(curso.costo) : 0,
        idInstructor: curso.idInstructor || '',
        activo: curso.activo ?? true
      });
    }
  }, [curso, isOpen]);

  if (!isOpen || !formData.idCurso) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Preparamos el payload con los tipos de datos correctos
    const payload = {
      ...formData,
      idInstructor: formData.idInstructor === '' ? null : Number(formData.idInstructor),
      cupoMaximo: Number(formData.cupoMaximo),
      costo: formData.costo.toString() // Para que el API lo reciba como numeric (string)
    };

    try {
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-modal-overlay">
      <div className="course-modal-container">
        <div className="course-modal-header">
          <h2 className="course-modal-title"><BookOpen size={24}/> Editar Curso</h2>
          <button className="btn-close-course" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="course-modal-form">
          
          {/* VISIBILIDAD */}
          <div className="form-group-visibility">
            <label>Estado del curso en la web:</label>
            <button 
              type="button" 
              className={`btn-toggle-status ${formData.activo ? 'active' : 'hidden'}`}
              onClick={() => setFormData({...formData, activo: !formData.activo})}
            >
              {formData.activo ? <Eye size={16}/> : <EyeOff size={16}/>}
              {formData.activo ? "Público (Visible)" : "Oculto (Borrador)"}
            </button>
          </div>

          <div className="form-section-header"><Info size={16}/> Información Principal</div>
          
          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Título del Curso</label>
              <input name="tituloCurso" value={formData.tituloCurso} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required />
            </div>
          </div>

          <div className="form-grid-row cols-2">
            <div className="course-input-group">
              <label>ID Instructor (Médico)</label>
              <input type="number" name="idInstructor" value={formData.idInstructor} onChange={handleChange} required />
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

          <div className="form-section-header"><Calendar size={16}/> Logística y Horarios</div>

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
              <input name="horario" value={formData.horario} onChange={handleChange} placeholder="Ej: 10:00 AM" required />
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
              <label><Users size={14}/> Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={formData.cupoMaximo} onChange={handleChange} />
            </div>
          </div>

          <div className="form-section-header"><MapPin size={16}/> Ubicación y Costo</div>

          <div className="form-grid-row cols-2">
            <div className="course-input-group">
              <label>Ubicación (Sala o Link)</label>
              <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
            </div>
            <div className="course-input-group">
              <label><DollarSign size={14}/> Costo</label>
              <input type="number" name="costo" value={formData.costo} onChange={handleChange} step="0.01" />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>URL Imagen de Portada</label>
              <input name="urlImagenPortada" value={formData.urlImagenPortada} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="course-modal-footer">
            <button type="button" className="btn-course-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-course-save" disabled={loading}>
              <Save size={18}/> {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}