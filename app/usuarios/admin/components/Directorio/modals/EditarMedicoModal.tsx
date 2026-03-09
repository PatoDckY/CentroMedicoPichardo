"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, User, Stethoscope, Building, MapPin, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import '../../../styles/Directorio/MedicoModals.css';

interface EditarMedicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicoActualizado: any) => Promise<void>;
  medico: any;
}

export default function EditarMedicoModal({ isOpen, onClose, onSave, medico }: EditarMedicoModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Sincronización de datos al abrir
  useEffect(() => {
    if (medico && isOpen) {
      setFormData({
        nombreCompleto: medico.nombreCompleto || '',
        especialidad: medico.especialidad || '',
        hospitalClinica: medico.hospitalClinica || '',
        direccion: medico.direccion || '',
        urlFoto: medico.urlFoto || '',
        activo: medico.activo ?? true
      });
    }
  }, [medico, isOpen]);

  if (!isOpen || !medico) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Importante: Incluir el idMedico para que el PUT funcione correctamente
      await onSave({ 
        idMedico: medico.idMedico, 
        ...formData 
      });
      onClose();
    } catch (error) {
      console.error("Error al actualizar médico:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title"><User size={22}/> Editar Perfil Médico</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* CONTROL DE VISIBILIDAD (Borrado Lógico) */}
          <div className="form-group status-toggle-wrapper">
            <label>Estado en el Directorio Público</label>
            <button 
              type="button" 
              className={`btn-toggle-status ${formData.activo ? 'active' : 'hidden'}`}
              onClick={() => setFormData({...formData, activo: !formData.activo})}
            >
              {formData.activo ? <Eye size={16}/> : <EyeOff size={16}/>}
              {formData.activo ? "Visible / Activo" : "Oculto / Inactivo"}
            </button>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Nombre Completo</label>
              <input 
                name="nombreCompleto" 
                value={formData.nombreCompleto} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group half">
              <label><Stethoscope size={14}/> Especialidad</label>
              <input 
                name="especialidad" 
                value={formData.especialidad} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label><Building size={14}/> Hospital / Clínica</label>
            <input 
              name="hospitalClinica" 
              value={formData.hospitalClinica} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label><MapPin size={14}/> Dirección</label>
            <textarea 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              rows={2} 
              required 
            />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL de la Foto</label>
            <input 
              name="urlFoto" 
              value={formData.urlFoto} 
              onChange={handleChange} 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              <Save size={18}/> {loading ? "Actualizando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}