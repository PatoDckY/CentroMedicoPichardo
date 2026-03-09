"use client";
import React, { useState } from 'react';
import { X, Save, User, Stethoscope, Building, MapPin, Image as ImageIcon } from 'lucide-react';
import '../../../styles/Directorio/MedicoModals.css';

interface CrearMedicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoMedico: any) => Promise<void>;
}

export default function CrearMedicoModal({ isOpen, onClose, onSave }: CrearMedicoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    especialidad: '',
    hospitalClinica: 'Centro Médico Pichardo',
    direccion: '',
    urlFoto: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nuevoMedico = {
        ...formData,
        urlFoto: formData.urlFoto || "/default-doctor.jpg",
        activo: true // Registro nuevo entra activo por defecto
      };
      
      await onSave(nuevoMedico);
      setFormData({ 
        nombreCompleto: '', 
        especialidad: '', 
        hospitalClinica: 'Centro Médico Pichardo', 
        direccion: '', 
        urlFoto: '' 
      });
      onClose();
    } catch (error) {
      console.error("Error al crear médico:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title"><User size={22}/> Registrar Nuevo Médico</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group half">
              <label>Nombre Completo</label>
              <input 
                name="nombreCompleto" 
                value={formData.nombreCompleto} 
                onChange={handleChange} 
                placeholder="Ej: Dr. Juan Pérez" 
                required 
              />
            </div>
            <div className="form-group half">
              <label><Stethoscope size={14}/> Especialidad</label>
              <input 
                name="especialidad" 
                value={formData.especialidad} 
                onChange={handleChange} 
                placeholder="Ej: Pediatría" 
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
              placeholder="Calle, Número, Colonia..."
              required 
            />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL de la Foto (Opcional)</label>
            <input 
              name="urlFoto" 
              value={formData.urlFoto} 
              onChange={handleChange} 
              placeholder="https://..." 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={loading}>
              <Save size={18}/> {loading ? "Guardando..." : "Guardar Médico"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}