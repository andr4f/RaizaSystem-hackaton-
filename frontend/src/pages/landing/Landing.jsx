import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout, MapPin, QrCode, Check, Users, Camera, Globe, ShoppingCart,
  Leaf, TrendingUp, ArrowRight, Award, Menu, X
} from 'lucide-react'

import imagenCafeTabi from "./assets/imagen-cafe-tabi.png"
import imagenCacaoFino from "./assets/imagen-cacao-fino.jpg"
import imagenBananoHarton from "./assets/banano-harton.webp"

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
import heroImg from './assets/imagen-hero.png'
import communityImg from './assets/imagen-login.png'
import LandingChatWidget from './components/LandingChatWidget'
import './Landing.css'

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cardOpen, setCardOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="lnd">

      {/* ── NAVBAR ── */}
      <header className="lnd-nav">
        <div className="lnd-nav__inner">
          <div className="lnd-nav__brand">
            <img src="/logo-nombre.svg" alt="RAIZA" className="lnd-nav__logo" />
          </div>
          <nav className={`lnd-nav__links${menuOpen ? ' lnd-nav__links--open' : ''}`}>
            <a href="#inicio" onClick={closeMenu}>Inicio</a>
            <a href="#como" onClick={closeMenu}>¿Cómo funciona?</a>
            <a href="#productos" onClick={closeMenu}>Productos</a>
            <a href="#roles" onClick={closeMenu}>Para quién</a>
            <a href="#nosotros" onClick={closeMenu}>Sobre nosotros</a>
            <a href="#blog" onClick={closeMenu}>Blog</a>
            <div className="lnd-nav__actions-mobile">
              <Link to="/login" className="lnd-btn--ghost" onClick={closeMenu}>Iniciar sesión</Link>
              <Link to="/register" className="lnd-btn--primary" onClick={closeMenu}>
                Comenzar ahora <ArrowRight size={14} />
              </Link>
            </div>
          </nav>
          <div className="lnd-nav__actions">
            <Link to="/login" className="lnd-btn--ghost">Iniciar sesión</Link>
            <Link to="/register" className="lnd-btn--primary">
              Comenzar ahora <ArrowRight size={14} />
            </Link>
          </div>
          <button
            className="lnd-nav__hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="lnd-hero"
        id="inicio"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="lnd-hero__overlay" />
        <div className="lnd-hero__inner">
          <div className="lnd-hero__content">
            <div className="lnd-hero__badge">
              <span>TRAZABILIDAD</span>
              <span className="lnd-hero__badge-dot">·</span>
              <span>CONFIANZA</span>
              <span className="lnd-hero__badge-dot">·</span>
              <span>TERRITORIO</span>
            </div>
            <h1 className="lnd-hero__title">
              Conectamos el campo<br />
              del <em>Magdalena</em><br />
              con el mundo
            </h1>
            <p className="lnd-hero__subtitle">
              RAÍZA usa IA y trazabilidad para dar confianza a cada producto,
              visibilizar a nuestros productores y abrir nuevas oportunidades
              en mercados globales.
            </p>
            <div className="lnd-hero__cta">
              <Link to="/register" className="lnd-btn--dark lnd-btn--lg">
                Comenzar ahora <ArrowRight size={16} />
              </Link>
              <a href="#como" className="lnd-btn--outline-white lnd-btn--lg">
                Conocer más
              </a>
            </div>
          </div>

          {/* Card visible en desktop */}
          <div className="lnd-hero__card lnd-hero__card--desktop">
            <div className="lnd-hero__card-header">
              <span className="lnd-hero__card-check-icon"><Check size={10} /></span>
              <span>Producto trazado</span>
            </div>
            <div className="lnd-hero__card-body">
              <div className="lnd-hero__card-info">
                <strong>Café Tabi Variedad Colombia</strong>
                <span>Finca La Esperanza</span>
                <div className="lnd-hero__card-location">
                  <MapPin size={11} />
                  <span>Sierra Nevada de Santa Marta</span>
                </div>
              </div>
              <div className="lnd-hero__card-qr">
                <QrCode size={60} />
              </div>
            </div>
            <a href="#" className="lnd-hero__card-link">
              Ver trazabilidad completa →
            </a>
          </div>

          {/* Botón QR flotante en móvil */}
          <button
            className="lnd-hero__qr-trigger"
            onClick={() => setCardOpen(true)}
            aria-label="Ver producto trazado"
          >
            <QrCode size={20} />
            <span>Ver producto trazado</span>
          </button>
        </div>
      </section>

      {/* ── MODAL CARD MÓVIL ── */}
      {cardOpen && (
        <div className="lnd-card-modal__backdrop" onClick={() => setCardOpen(false)}>
          <div className="lnd-card-modal__box" onClick={e => e.stopPropagation()}>
            <button className="lnd-card-modal__close" onClick={() => setCardOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
            <div className="lnd-hero__card-header">
              <span className="lnd-hero__card-check-icon"><Check size={10} /></span>
              <span>Producto trazado</span>
            </div>
            <div className="lnd-hero__card-body">
              <div className="lnd-hero__card-info">
                <strong>Café Tabi Variedad Colombia</strong>
                <span>Finca La Esperanza</span>
                <div className="lnd-hero__card-location">
                  <MapPin size={11} />
                  <span>Sierra Nevada de Santa Marta</span>
                </div>
              </div>
              <div className="lnd-hero__card-qr">
                <QrCode size={72} />
              </div>
            </div>
            <a href="#" className="lnd-hero__card-link">
              Ver trazabilidad completa →
            </a>
          </div>
        </div>
      )}

      {/* ── PARTNERS ── */}
      <section className="lnd-partners">
        <div className="lnd-partners__inner">
          <div className="lnd-partners__logos">
            <div className="lnd-partner">
              <Sprout size={22} className="lnd-partner__icon" />
              <span className="lnd-partner__name lnd-partner__name--bold">REMA</span>
            </div>
            <div className="lnd-partner">
              <Award size={20} className="lnd-partner__icon" />
              <span className="lnd-partner__name">Cámara de<br />Comercio</span>
            </div>
            <div className="lnd-partner">
              <span className="lnd-partner__mountain">Sierra<br />Nevada</span>
            </div>
            <div className="lnd-partner">
              <span className="lnd-partner__name lnd-partner__name--green lnd-partner__name--bold">Agrosavia</span>
            </div>
            <div className="lnd-partner">
              <span className="lnd-partner__name lnd-partner__name--bold">Fairtrade</span>
            </div>
          </div>
          <p className="lnd-partners__text">
            Más de 500 productores y aliados<br />construyendo un futuro sostenible.
          </p>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="lnd-products" id="productos">
        <div className="lnd-products__inner">
          <div className="lnd-products__left">
            <span className="lnd-label">LO MEJOR DE NUESTRO TERRITORIO</span>
            <h2 className="lnd-h2">
              Descubre lo mejor<br />de nuestro territorio
            </h2>
            <p className="lnd-products__desc">
              Productos auténticos, cultivados con conocimiento ancestral y buenas
              prácticas. Trazables, sostenibles y listos para conectar con el mundo.
            </p>
            <ul className="lnd-products__features">
              <li><Check size={15} /><span>Cultivos de altura y microclimas únicos</span></li>
              <li><Check size={15} /><span>Productores apasionados y comprometidos</span></li>
              <li><Check size={15} /><span>Calidad certificada y origen verificado</span></li>
              <li><Check size={15} /><span>Sostenibilidad que protege nuestro futuro</span></li>
            </ul>
            <a href="#" className="lnd-btn--primary-solid">
              Explorar productos <ArrowRight size={14} />
            </a>
          </div>

          <div className="lnd-products__grid">
            <div className="lnd-product-card">
              <img className="lnd-product-card__img img-card-product" src={imagenCafeTabi} alt="Café Tabi" />
              <div className="lnd-product-card__body">
                <span className="lnd-product-card__cat">CAFÉ</span>
                <h3>Café Tabi Variedad Colombia</h3>
                <p>Sierra Nevada de Santa Marta</p>
                <div className="lnd-product-card__badges">
                  <span className="lnd-badge lnd-badge--green">BIO</span>
                  <span className="lnd-badge lnd-badge--org">ORG</span>
                  <span className="lnd-badge lnd-badge--fair">FT</span>
                </div>
                <a href="#" className="lnd-product-card__link">Ver producto →</a>
              </div>
            </div>
            <div className="lnd-product-card">
              <img className="lnd-product-card__img img-card-product" src={imagenCacaoFino} alt="Cacao Fino" />
              <div className="lnd-product-card__body">
                <span className="lnd-product-card__cat">CACAO</span>
                <h3>Cacao Fino de Aroma</h3>
                <p>Sierra Nevada de Santa Marta</p>
                <div className="lnd-product-card__badges">
                  <span className="lnd-badge lnd-badge--green">BIO</span>
                  <span className="lnd-badge lnd-badge--org">ORG</span>
                  <span className="lnd-badge lnd-badge--fair">FT</span>
                </div>
                <a href="#" className="lnd-product-card__link">Ver producto →</a>
              </div>
            </div>
            <div className="lnd-product-card">
              <img className="lnd-product-card__img img-card-product" src={imagenBananoHarton} alt="Banano Hartón" />
              <div className="lnd-product-card__body">
                <span className="lnd-product-card__cat">BANANO</span>
                <h3>Banano Hartón Orgánico</h3>
                <p>Zona Bananera</p>
                <div className="lnd-product-card__badges">
                  <span className="lnd-badge lnd-badge--green">BIO</span>
                  <span className="lnd-badge lnd-badge--org">ORG</span>
                  <span className="lnd-badge lnd-badge--fair">FT</span>
                </div>
                <a href="#" className="lnd-product-card__link">Ver producto →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="lnd-stats">
        <div className="lnd-stats__inner">
          <div className="lnd-stat">
            <Users size={30} className="lnd-stat__icon" />
            <span className="lnd-stat__num">500+</span>
            <span className="lnd-stat__lbl">Productores y aliados</span>
          </div>
          <div className="lnd-stat">
            <Leaf size={30} className="lnd-stat__icon" />
            <span className="lnd-stat__num">1.200+</span>
            <span className="lnd-stat__lbl">Lotes trazados cada semana</span>
          </div>
          <div className="lnd-stat">
            <Globe size={30} className="lnd-stat__icon" />
            <span className="lnd-stat__num">25+</span>
            <span className="lnd-stat__lbl">Países alcanzados con nuestros productos</span>
          </div>
          <div className="lnd-stat">
            <Sprout size={30} className="lnd-stat__icon" />
            <span className="lnd-stat__num">100%</span>
            <span className="lnd-stat__lbl">Comprometidos con la sostenibilidad</span>
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <section className="lnd-roles" id="roles">
        <div className="lnd-roles__inner">
          <div className="lnd-roles__left">
            <span className="lnd-label lnd-label--light">PARA QUIÉN</span>
            <h2 className="lnd-h2 lnd-h2--white">
              Una plataforma para<br />
              todos los que hacen<br />
              parte del cambio
            </h2>
            <p className="lnd-roles__desc">
              Unimos tecnología, comunidad y propósito para<br />
              generar impacto real en el campo del Magdalena.
            </p>
            <a href="#" className="lnd-btn--outline-white lnd-btn--sm">
              Conocer más →
            </a>
          </div>
          <div className="lnd-roles__grid">
            <div className="lnd-role-card">
              <div className="lnd-role-card__icon"><Sprout size={22} /></div>
              <h3>Productores</h3>
              <p>Gestiona tus productos, certificaciones y conecta con nuevos mercados.</p>
            </div>
            <div className="lnd-role-card">
              <div className="lnd-role-card__icon"><Camera size={22} /></div>
              <h3>Operadores turísticos</h3>
              <p>Crea experiencias auténticas y conecta visitantes con el territorio.</p>
            </div>
            <div className="lnd-role-card">
              <div className="lnd-role-card__icon"><Globe size={22} /></div>
              <h3>Exportadores</h3>
              <p>Encuentra lotes verificados y oportunidades comerciales con confianza.</p>
            </div>
            <div className="lnd-role-card">
              <div className="lnd-role-card__icon"><ShoppingCart size={22} /></div>
              <h3>Compradores</h3>
              <p>Accede a productos trazables, certificados y de alta calidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lnd-how" id="como">
        <div className="lnd-how__inner">
          <div className="lnd-how__left">
            <span className="lnd-label">TECNOLOGÍA QUE GENERA CONFIANZA</span>
            <h2 className="lnd-h2">Trazabilidad que cuenta historias reales</h2>
            <p className="lnd-how__desc">
              Cada producto lleva un registro verificable de todo su origen.
              Nuestra tecnología combina IA, datos y blockchain para garantizar
              transparencia total desde el campo hasta tu mesa.
            </p>
          </div>
          <div className="lnd-how__steps">
            <div className="lnd-how-step">
              <div className="lnd-how-step__icon"><Leaf size={22} /></div>
              <span className="lnd-how-step__num">1. Origen</span>
              <p>El productor registra su producto y su historia.</p>
            </div>
            <div className="lnd-how__arrow" aria-hidden="true">· · · ·</div>
            <div className="lnd-how-step">
              <div className="lnd-how-step__icon"><QrCode size={22} /></div>
              <span className="lnd-how-step__num">2. Trazabilidad</span>
              <p>Se genera un QR único con información segura.</p>
            </div>
            <div className="lnd-how__arrow" aria-hidden="true">· · · ·</div>
            <div className="lnd-how-step">
              <div className="lnd-how-step__icon"><Users size={22} /></div>
              <span className="lnd-how-step__num">3. Conexión</span>
              <p>Se conecta con mercados, operadores y compradores.</p>
            </div>
            <div className="lnd-how__arrow" aria-hidden="true">· · · ·</div>
            <div className="lnd-how-step">
              <div className="lnd-how-step__icon"><TrendingUp size={22} /></div>
              <span className="lnd-how-step__num">4. Impacto</span>
              <p>Se generan oportunidades y desarrollo para el territorio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY CTA ── */}
      <section
        className="lnd-community"
        style={{ backgroundImage: `url(${communityImg})` }}
      >
        <div className="lnd-community__overlay" />
        <div className="lnd-community__inner">
          <span className="lnd-label lnd-label--light">COMUNIDAD RAÍZA</span>
          <h2 className="lnd-community__title">
            Juntos cultivamos confianza,<br />
            oportunidades y futuro
          </h2>
          <p className="lnd-community__desc">
            Sé parte de una comunidad que cree en lo auténtico,<br />
            en la colaboración y en el poder transformador del campo.
          </p>
          <Link to="/register" className="lnd-btn--primary lnd-btn--lg">
            Únete a RAÍZA →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lnd-footer">
        <div className="lnd-footer__inner">
          <div className="lnd-footer__brand-col">
            <div className="lnd-footer__brand">
              <img src="/logo-nombre.svg" alt="RAIZA" className="lnd-footer__logo" />
            </div>
            <p className="lnd-footer__tagline">
              Trazabilidad, confianza y territorio para conectar el agro
              del Magdalena con el mundo.
            </p>
            <div className="lnd-footer__social">
              <a href="#" aria-label="Instagram"><InstagramIcon /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#" aria-label="LinkedIn"><LinkedinIcon /></a>
            </div>
          </div>
          <div className="lnd-footer__col">
            <h4>Explorar</h4>
            <ul>
              <li><a href="#">Productos</a></li>
              <li><a href="#">¿Cómo funciona?</a></li>
              <li><a href="#">Trazabilidad</a></li>
              <li><a href="#">Certificaciones</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="lnd-footer__col">
            <h4>Para quién</h4>
            <ul>
              <li><a href="#">Productores</a></li>
              <li><a href="#">Operadores turísticos</a></li>
              <li><a href="#">Exportadores</a></li>
              <li><a href="#">Compradores</a></li>
            </ul>
          </div>
          <div className="lnd-footer__col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Aliados</a></li>
              <li><a href="#">Trabaja con nosotros</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
          <div className="lnd-footer__newsletter">
            <h4>Recibe novedades de RAÍZA</h4>
            <p>Historias, oportunidades y contenido del territorio en tu correo.</p>
            <div className="lnd-footer__newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" />
              <button type="button" aria-label="Suscribirse">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
        <div className="lnd-footer__bottom">
          <span>© 2025 RAÍZA. Todos los derechos reservados.</span>
          <div className="lnd-footer__legal">
            <a href="#">Política de privacidad</a>
            <a href="#">Términos y condiciones</a>
          </div>
        </div>
      </footer>

      <LandingChatWidget />
    </div>
  )
}

export default Landing
