import Link from "next/link";
import "./not-found.css"; // Importar el CSS

export default function NotFound() {
  return (
    <div className="medical-404">
      {/* Decoraciones de fondo */}
      <div className="medical-decoration decoration-1"></div>
      <div className="medical-decoration decoration-2"></div>

      <div className="medical-container">
        {/* Header */}
        <div className="medical-header animate-fadein">
          <div className="medical-logo">🩺</div>
          <div>
            <h1 className="medical-title">Centro Médico Pichardo</h1>
            <p className="medical-subtitle">Pediatría · Especialistas Certificados</p>
          </div>
        </div>

        <div className="medical-main">
          {/* Columna izquierda - Error 404 */}
          <div className="animate-fadein" style={{ animationDelay: "0.1s" }}>
            <div className="error-404">
              <h2 className="error-number">404</h2>
              <h3 className="error-title">Página No Encontrada</h3>
              <p className="error-description">
                La página que buscas no está disponible. En el Centro Médico Pichardo 
                nos aseguramos de que encuentres la información médica correcta.
              </p>
              <p className="error-description">
                Revisa la URL o navega por nuestras secciones principales.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <Link href="/usuarios/public/screens/HomePublico" className="btn-primary">
                🏠 Volver al Inicio
              </Link>
              <Link href="/usuarios/public/screens/Servicios" className="btn-secondary">
                👨‍⚕️ Nuestros Servicios
              </Link>
              <Link href="/usuarios/public/screens/QuienesSomos" className="btn-secondary">
                👨‍⚕️ ¿Quienes Somos?
              </Link>
            </div>
          </div>

          {/* Columna derecha - Información médica */}
          <div className="animate-fadein" style={{ animationDelay: "0.2s" }}>
            <div className="medical-card">
              <h4 className="card-title">Atención Pediátrica Integral</h4>
              <p className="card-subtitle">Cuidado especializado para los más pequeños</p>

              {/* Emergencia */}
              <div className="emergency-box">
                <h5 className="emergency-title">¿Necesitas ayuda inmediata?</h5>
                <p className="emergency-subtitle">Línea de emergencia pediátrica</p>
                <div className="emergency-phone">(55) 1234-5678</div>
                <Link href="/emergencia" className="emergency-link">
                  Ver protocolos
                </Link>
              </div>

              {/* Enlaces rápidos */}
              <div>
                <p className="specialty-name">También te puede interesar:</p>
                <div className="quick-links">
                  {[
                    { href: "/usuarios/public/screens/DirectorioMedico", label: "👨‍⚕️ Nuestros Pediatras" },
                    { href: "/usuarios/public/screens/Academia", label: "📋 Programas de Salud" },
                    { href: "/usuarios/public/screens/Blog", label: "📚 Blog de Salud" },
                    { href: "/usuarios/public/screens/QuienesSomos", label: "👨‍⚕️ ¿Quienes Somos?" }
                  ].map((link, index) => (
                    <Link key={index} href={link.href} className="quick-link">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}