'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, Phone, ShieldAlert } from 'lucide-react';
import './error.css'; // Importar el CSS

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    // Log error to monitoring service
    console.error('Error del servidor:', error);
    
    // También puedes enviar a un servicio de monitoreo aquí
    // sendToErrorMonitoring(error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    // Pequeña pausa para mostrar el estado de carga
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 800);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="error-500-page">
      {/* Fondos decorativos */}
      <div className="error-background"></div>
      <div className="error-decoration decoration-cross"></div>
      <div className="error-decoration decoration-pulse"></div>

      <div className="error-container">
        {/* Icono y título */}
        <div className="error-icon-container">
          <div className="error-icon">
            <ShieldAlert size={40} />
          </div>
          <div className="error-icon-badge">500</div>
        </div>

        <h1 className="error-title">
          <span className="error-title-500">500</span>
          Error del Servidor
        </h1>

        <h2 className="error-subtitle">
          <AlertTriangle size={20} className="inline mr-2" />
          Algo salió mal en nuestro sistema
        </h2>

        <p className="error-description">
          Estamos experimentando dificultades técnicas. Nuestro equipo ha sido notificado 
          y está trabajando para resolver el problema lo antes posible.
        </p>

        {/* Código de error (si existe) */}
        {error.digest && (
          <div className="error-code">
            <span className="error-code-label">Código de referencia:</span>
            <div className="error-code-value">{error.digest}</div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="error-actions">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className={`error-btn-primary ${isResetting ? 'error-btn-loading' : ''}`}
          >
            {isResetting ? (
              <>
                Procesando...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Reintentar carga
              </>
            )}
          </button>

          <button
            onClick={handleGoHome}
            className="error-btn-secondary"
          >
            <Home size={18} />
            Volver al inicio
          </button>
        </div>

        {/* Información de contacto médico */}
        <div className="error-contact">
          <div className="contact-title">
            Centro Médico Pichardo - Soporte
          </div>
          <div className="contact-info">
            Si el problema persiste, contacta a nuestro equipo de soporte:
          </div>
          <div className="contact-phone">
            <Phone size={16} className="inline mr-2" />
            (55) 1234-5678
          </div>
          <div className="contact-hours">
            Horario de soporte: Lunes a Viernes 7:00 AM - 8:00 PM
          </div>
        </div>

        {/* Información técnica (solo desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="error-tech-info">
            <button 
              onClick={() => setShowTechnical(!showTechnical)}
              className="error-tech-toggle"
            >
              {showTechnical ? 'Ocultar detalles' : 'Mostrar detalles técnicos'}
            </button>
            
            {showTechnical && (
              <>
                <div><strong>Mensaje:</strong> {error.message}</div>
                {error.stack && (
                  <div>
                    <strong>Stack trace:</strong>
                    <pre style={{ fontSize: '10px', marginTop: '8px' }}>
                      {error.stack}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="error-footer">
          <div className="error-footer-logo">Centro Médico Pichardo</div>
          <div>Pediatría Especializada · Certificación ISO 9001:2015</div>
          <div style={{ marginTop: '0.5rem' }}>
            <small>Error registrado: {new Date().toLocaleString()}</small>
          </div>
        </div>
      </div>
    </div>
  );
}