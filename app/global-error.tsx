'use client';

import { useEffect, useState } from 'react';
import { Frown, RefreshCw, Home, AlertTriangle } from 'lucide-react';
import './global-error.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    console.error('Error global crítico:', error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 800);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <html lang="es">
      <body className="global-error-page">
        {/* Fondo animado */}
        <div className="global-error-bg"></div>

        <div className="global-error-container">
          {/* Icono y título */}
          <div className="global-error-icon-container">
            <div className="global-error-icon-wrapper">
              <Frown size={48} />
            </div>
            <div className="global-critical-badge">
              <AlertTriangle size={14} className="inline mr-1" />
              Crítico
            </div>
          </div>

          <h1 className="global-error-title">
            Error Crítico
          </h1>

          <h2 className="global-error-subtitle">
            La aplicación encontró un error grave
          </h2>

          <p className="global-error-description">
            Ha ocurrido un error inesperado que afecta el funcionamiento de la aplicación. 
            Por favor, intenta recargar la página.
          </p>

          {/* Código de error */}
          {error.digest && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '1rem',
              padding: '1.25rem',
              margin: '2rem 0',
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#fca5a5',
                fontWeight: '600',
                display: 'block',
                marginBottom: '0.75rem',
              }}>
                Código de error:
              </span>
              <div style={{
                fontSize: '1.125rem',
                fontFamily: "'Monaco', 'Consolas', monospace",
                color: '#fecaca',
                wordBreak: 'break-all',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1rem',
                borderRadius: '0.75rem',
              }}>
                {error.digest}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="global-error-actions">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="global-error-btn-primary"
              style={{
                opacity: isResetting ? 0.7 : 1,
                cursor: isResetting ? 'not-allowed' : 'pointer',
              }}
            >
              {isResetting ? (
                'Procesando...'
              ) : (
                <>
                  <RefreshCw size={20} />
                  Recargar aplicación
                </>
              )}
            </button>

            <button
              onClick={handleGoHome}
              className="global-error-btn-secondary"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                padding: '1rem 2rem',
                borderRadius: '1rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <Home size={18} />
              Volver al inicio
            </button>
          </div>

          {/* Información de emergencia médica */}
          <div className="global-emergency-info">
            <div className="global-emergency-title">
              <AlertTriangle size={18} />
              Centro Médico Pichardo - Emergencias
            </div>
            <div style={{ fontSize: '0.9375rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
              Si necesitas atención médica urgente:
            </div>
            <div className="global-emergency-phone">
              📞 (55) 1234-5678
            </div>
          </div>

          {/* Footer */}
          <div className="global-error-footer">
            <div className="global-error-footer-logo">
              Centro Médico Pichardo
            </div>
            <div style={{ marginTop: '0.5rem', opacity: 0.7 }}>
              Sistema Médico Integral • Certificado ISO 9001:2015
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '1rem', opacity: 0.5 }}>
              © 2026 Centro Médico Pichardo
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}