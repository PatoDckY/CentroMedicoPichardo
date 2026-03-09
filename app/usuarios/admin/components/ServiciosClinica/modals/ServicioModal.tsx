"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Stethoscope, MapPin, FileText, Image as ImageIcon, Layout } from 'lucide-react';
import '../../../styles/Servicios/ServicioModal.css';

export default function ServicioModal({ isOpen, onClose, onSave, servicio, tipoPreseleccionado }: any) {
  const [formData, setFormData] = useState({
    tituloServicio: '',
    descripcion: '',
    ubicacion: '',
    urlImage: '',
    textoAlt: '',
    disenoTipo: 'vertical',
    activo: true
  });

  useEffect(() => {
    if (servicio && isOpen) {
      setFormData({
        tituloServicio: servicio.tituloServicio || '',
        descripcion: servicio.descripcion || '',
        ubicacion: servicio.ubicacion || '',
        urlImage: servicio.urlImage || '',
        textoAlt: servicio.textoAlt || '',
        disenoTipo: servicio.disenoTipo || 'vertical',
        activo: servicio.activo ?? true
      });
    } else {
      setFormData({ 
        tituloServicio: '', 
        descripcion: '', 
        ubicacion: 'Centro Médico Pichardo', 
        urlImage: '', 
        textoAlt: '',
        disenoTipo: tipoPreseleccionado || 'vertical',
        activo: true
      });
    }
  }, [servicio, isOpen, tipoPreseleccionado]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Enviamos los datos limpios a la función onSave del padre
    onSave({ 
      ...servicio, // Mantiene el idServicio si existe
      ...formData 
    });
  };

  return (
    <div className="service-modal-overlay">
      <div className="service-modal-container">
        <div className="service-modal-header">
          <h2 className="service-modal-title">
            <Stethoscope size={22}/> 
            {servicio ? 'Editar Servicio' : `Nuevo Servicio (${formData.disenoTipo})`}
          </h2>
          <button className="btn-close-service" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="service-modal-form">
          <div className="input-group">
            <label>Título del Servicio</label>
            <input 
              value={formData.tituloServicio} 
              onChange={e => setFormData({...formData, tituloServicio: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group">
            <label><FileText size={16}/> Descripción</label>
            <textarea 
              value={formData.descripcion} 
              onChange={e => setFormData({...formData, descripcion: e.target.value})} 
              rows={3} 
              required 
            />
          </div>

          <div className="form-row-service">
            <div className="input-group">
              <label><MapPin size={16}/> Ubicación</label>
              <input 
                value={formData.ubicacion} 
                onChange={e => setFormData({...formData, ubicacion: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label><Layout size={16}/> Diseño</label>
              <select 
                value={formData.disenoTipo} 
                onChange={e => setFormData({...formData, disenoTipo: e.target.value})}
              >
                <option value="vertical">Vertical (Grid)</option>
                <option value="horizontal">Horizontal (Banner)</option>
              </select>
            </div>
          </div>

          <div className="form-row-service">
            <div className="input-group">
               <label><ImageIcon size={16}/> URL Imagen</label>
               <input 
                 value={formData.urlImage} 
                 onChange={e => setFormData({...formData, urlImage: e.target.value})} 
                 placeholder="/images/servicio.jpg"
               />
            </div>
            <div className="input-group">
               <label>Texto Alt (SEO)</label>
               <input 
                 value={formData.textoAlt} 
                 onChange={e => setFormData({...formData, textoAlt: e.target.value})} 
               />
            </div>
          </div>

          <div className="service-modal-footer">
            <button type="button" className="btn-service-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-service-save"><Save size={18}/> Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}