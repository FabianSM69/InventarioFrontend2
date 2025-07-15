import React from 'react';
import '../home.css';
import useOnScreen from '../hooks/useOnScreen';

export default function Home() {
  // Hooks de visibilidad
  const [refHero,      heroVisible]     = useOnScreen('-100px');
  const [refNovedades, novVisible]      = useOnScreen('-100px');
  const [refFAQ,       faqVisible]      = useOnScreen('-100px');
  const [refContacto,  contactVisible]  = useOnScreen('-100px');

  // Configuración del navbar
  const sections = [
    { id: 'hero',      label: 'Inicio',     ref: refHero,      visible: heroVisible },
    { id: 'novedades', label: 'Novedades',  ref: refNovedades, visible: novVisible },
    { id: 'faq',       label: 'Preguntas',  ref: refFAQ,      visible: faqVisible },
    { id: 'contacto',  label: 'Contacto',   ref: refContacto, visible: contactVisible },
  ];

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-nav">
        <ul>
          {sections.map(s => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={s.visible ? 'active' : ''}>
                {s.label}
              </a>
            </li>
          ))}
          <li style={{ marginLeft: 'auto' }}>
            <a href="/login" className="btn ingreso">Ingresar</a>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section
        id="hero"
        ref={refHero}
        className={`home-section card animate-on-scroll ${heroVisible ? 'visible' : ''}`}
      >
        <h1>InvenStock</h1>
        <p>Administra tu inventario de forma fácil y efectiva</p>
      </section>

      {/* Novedades */}
      <section
        id="novedades"
        ref={refNovedades}
        className={`home-section card animate-on-scroll ${novVisible ? 'visible' : ''}`}
      >
        <h2>Novedades</h2>
        <ul>
          <li>v2.1: Nuevo gráfico de rotación de stock</li>
          <li>v2.0: Soporte multiusuario y roles avanzados</li>
          <li>v1.5: Mejoras de rendimiento en listados</li>
        </ul>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        ref={refFAQ}
        className={`home-section card animate-on-scroll ${faqVisible ? 'visible' : ''}`}
      >
        <h2>Preguntas Frecuentes</h2>
        <details>
          <summary>¿Cómo agrego un producto?</summary>
          <p>Ve a “Registrar Producto” en tu panel de control, completa los datos y guarda.</p>
        </details>
        <details>
          <summary>¿Puedo asignar roles a otros usuarios?</summary>
          <p>Sí, con el rol SuperAdmin puedes gestionar roles desde “Perfil → Administrar usuarios”.</p>
        </details>
      </section>

      {/* Contacto */}
      <section
        id="contacto"
        ref={refContacto}
        className={`home-section card animate-on-scroll ${contactVisible ? 'visible' : ''}`}
      >
        <h2>Contáctanos</h2>
        <form className="contact-form">
          <input type="text" name="name" placeholder="Tu nombre" required />
          <input type="email" name="email" placeholder="Tu correo" required />
          <textarea name="message" placeholder="¿En qué podemos ayudarte?" required />
          <button type="submit" className="btn envio">Enviar mensaje</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        © {new Date().getFullYear()} InvenStock. Todos los derechos reservados.
      </footer>
    </div>
  );
}
