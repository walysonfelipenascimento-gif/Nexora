const sections = [
  { icon: "✦", title: "Criadores", description: "Apresente seu trabalho e encontre novas oportunidades." },
  { icon: "◈", title: "Marcas e negócios", description: "Conecte sua marca a pessoas e públicos relevantes." },
  { icon: "↗", title: "Oportunidades", description: "Descubra parcerias, campanhas e novas conexões." },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Nexora, página inicial">
          <span className="brand-mark">N</span>
          <span>NEXORA</span>
        </a>
        <a className="login-link" href="#acesso">Entrar ↗</a>
      </header>

      <section className="hero">
        <span className="eyebrow"><span className="status-dot" /> UM NOVO ESPAÇO DE CONEXÕES</span>
        <h1>Suas conexões.<br />Seu próximo <span className="gradient-text">nível.</span></h1>
        <p className="hero-copy">
          Pessoas, marcas e oportunidades reunidas em um só lugar.
          Descubra conexões que podem transformar suas ideias em projetos.
        </p>
        <div className="hero-actions" id="acesso">
          <a className="primary-button" href="#descobrir">Explorar a Nexora <span>→</span></a>
          <a className="secondary-button" href="#sobre">Conhecer a plataforma</a>
        </div>
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-symbol" aria-hidden="true">N</div>
      </section>

      <section className="discovery" id="descobrir">
        <div className="section-heading">
          <div>
            <span className="eyebrow">UM UNIVERSO DE POSSIBILIDADES</span>
            <h2>O que move você?</h2>
          </div>
          <span className="section-index">01 / 03</span>
        </div>
        <div className="feature-grid">
          {sections.map((section) => (
            <article className="feature-card" key={section.title}>
              <span className="feature-icon">{section.icon}</span>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer" id="sobre">
        <a className="brand footer-brand" href="/"><span className="brand-mark">N</span><span>NEXORA</span></a>
        <p>Conectando pessoas, marcas e oportunidades.</p>
        <span>Uma nova conexão começa aqui.</span>
      </footer>
    </main>
  );
        }
