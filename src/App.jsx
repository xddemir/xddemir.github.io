import { Fragment, useEffect, useRef, useState } from 'react';
import { links, translations } from './content.js';

const sections = ['projects', 'about', 'experience', 'contact'];
const companies = ['Rush Automated Systems', 'RPTU Campus Games', 'DFKI · Interactive Machine Learning', 'NTT DATA'];
const ui = {
  en: { filters: ['All work', 'Research & XR', 'Backend', 'Games & simulation'], filterLabel: 'Filter projects', results: 'projects shown', career: 'Explore a chapter', readProject: 'See the project', chapter: 'CAREER EXPLORER', method: 'Choose an interaction method', studyNote: 'A comparison of the study inputs, not a live eye-tracking demo.', portraitFallback: 'Dogukan Demir', name: 'Hi, I’m Dogukan.', line: 'Software engineer.<br><em>Curious by design.</em>', index: 'PORTFOLIO / 2026', selected: 'SELECTED EXPERIENCE' },
  de: { filters: ['Alle Projekte', 'Forschung & XR', 'Backend', 'Spiele & Simulation'], filterLabel: 'Projekte filtern', results: 'Projekte angezeigt', career: 'Eine Station erkunden', readProject: 'Zum Projekt', chapter: 'BERUFLICHE STATIONEN', method: 'Interaktionsmethode wählen', studyNote: 'Vergleich der Studieneingaben, keine Live-Demo mit Eye-Tracking.', portraitFallback: 'Dogukan Demir', name: 'Hallo, ich bin Dogukan.', line: 'Softwareentwickler.<br><em>Neugier als Antrieb.</em>', index: 'PORTFOLIO / 2026', selected: 'AUSGEWÄHLTE ERFAHRUNG' },
  tr: { filters: ['Tüm projeler', 'Araştırma ve XR', 'Backend', 'Oyun ve simülasyon'], filterLabel: 'Projeleri filtrele', results: 'proje gösteriliyor', career: 'Bir dönemi keşfet', readProject: 'Projeyi incele', chapter: 'KARİYER YOLCULUĞUM', method: 'Etkileşim yöntemi seçin', studyNote: 'Araştırmadaki girdilerin karşılaştırmasıdır; canlı göz takibi demosu değildir.', portraitFallback: 'Doğukan Demir', name: 'Merhaba, ben Doğukan.', line: 'Yazılım mühendisi.<br><em>Merakla üretiyorum.</em>', index: 'PORTFOLYO / 2026', selected: 'SEÇİLMİŞ DENEYİMLER' },
};

// Content allows only line breaks and emphasis; no HTML is injected into the DOM.
function Text({ value = '' }) {
  return value.split(/(<br\s*\/?>|<em>.*?<\/em>)/g).map((part, i) =>
    /^<br/.test(part) ? <br key={i} /> : part.startsWith('<em>') ? <em key={i}>{part.slice(4, -5)}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}
function Icon({ name }) {
  const shapes = {
    github: <path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a5 5 0 0 0-1.4-3.5A4.6 4.6 0 0 0 18.5 2S17.2 1.7 15 3a13 13 0 0 0-6 0C6.8 1.7 5.5 2 5.5 2a4.6 4.6 0 0 0-.1 3.5A5 5 0 0 0 4 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4" />,
    linkedin: <><rect x="3" y="8" width="4" height="13" rx="1" /><circle cx="5" cy="3" r="2" /><path d="M11 21V8h4v2c1-3 6-3 6 2v9m-6 0v-7" /></>,
    youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
    email: <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 6 10 7L22 6" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}
function SocialLinks({ t }) {
  return <div className="socials">{[['github', 'GitHub'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube'], ['email', t.emailLabel]].map(([key, label]) => <a key={key} href={links[key]}><Icon name={key} /><span>{label}</span><span className="arrow" aria-hidden="true">↗</span></a>)}</div>;
}
function Tags({ items }) { return <div className="tags">{items.map(item => <span key={item}>{item}</span>)}</div>; }

function Header({ lang, t, active }) {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return <header className="site-header wrap">
    <a className="brand" href="#top"><span className="brand-monogram">dd.</span> Dogukan Demir</a>
    <nav aria-label={t.navigation}>{sections.map((id, i) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{t.nav[i]}</a>)}</nav>
    <div className="language-switch" role="group" aria-label={t.language}>{Object.entries(translations).map(([code, language]) => <a key={code} href={`${code === 'en' ? '/index.html' : `/${code}/index.html`}${hash}`} lang={code} hrefLang={code} aria-label={language.name} aria-current={code === lang ? 'page' : undefined}>{code.toUpperCase()}</a>)}</div>
  </header>;
}
function Hero({ t, labels }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <section className="hero wrap">
    <div className="hero-copy"><p className="eyebrow">{labels.index}<span className="edition-rule" /></p><p className="greeting">{labels.name}</p><h1><Text value={labels.line} /></h1><p className="hero-intro">{t.intro}</p><p className="hero-sub">{t.intro2}</p><div className="hero-actions"><a className="button" href="#projects">{t.explore}<span aria-hidden="true">↘</span></a><a className="plain-link" href="#about">{t.nav[1]} ↗</a></div><div className="hero-socials"><SocialLinks t={t} /></div></div>
    <figure className="portrait"><div className="photo-frame">{imageFailed ? <div className="portrait-placeholder" role="img" aria-label={labels.portraitFallback}>DD.</div> : <img src="/images/me.jpg" alt={t.portrait} width="640" height="640" fetchPriority="high" onError={() => setImageFailed(true)} />}<span className="photo-stamp" aria-hidden="true">01</span></div><figcaption><div><strong>Dogukan Demir</strong><span>{t.title} · {t.location}</span></div><span className="portrait-star" aria-hidden="true">↗</span></figcaption><p className="photo-note">{t.degree}</p></figure>
  </section>;
}

function InteractionFigure({ t, labels }) {
  const [method, setMethod] = useState(0);
  return <div className="interaction">
    <p className="eyebrow">{t.comparison}</p>
    <div className="method-picker" role="group" aria-label={labels.method}>{[t.methodA, t.methodB].map((name, i) => <button key={name} onClick={() => setMethod(i)} aria-pressed={method === i}>{name}</button>)}</div>
    <div className="interaction-stage" aria-hidden="true"><span className="input-symbol">{method === 0 ? '◎' : '＋'}</span><span className="input-path" /><span className="target-cube">◇</span><span className="figure-grid" /></div>
    <div className="method-output" aria-live="polite"><span>01</span><strong>{method === 0 ? t.gaze : t.controller}</strong><span>02</span><strong>{t.confirm}</strong></div>
    <div className="study-meta"><strong>{t.participants}</strong><span>{t.measured}</span></div><p className="figure-note">{labels.studyNote}</p>
  </div>;
}
function ResearchProject({ t, labels }) {
  return <article id="master-xr" className="xr-feature feature" data-project="research">
    <div className="feature-copy"><span className="eyebrow">01 — {t.xrCategory}</span><h3>{t.xrTitle}</h3><p>{t.xrIntro}</p><div className="contributions">{[[t.sceneTitle, t.sceneText], [t.studyTitle, t.studyText]].map(([title, body], i) => <div key={title}><span aria-hidden="true">0{i + 1}</span><div><h4>{title}</h4><p>{body}</p></div></div>)}</div><p className="additional-contribution">{t.contribution}</p><Tags items={['Unity', 'C#', 'XR Interaction Toolkit', 'MASTER XR']} /></div>
    <div className="xr-side"><InteractionFigure t={t} labels={labels} /><div className="publications"><h4>{t.related}</h4><p>{t.attribution}</p><a href="https://www.dfki.de/en/web/research/projects-and-publications/publication/17190">GTK: An Open-Source Toolkit for Gaze-based Interaction in XR ↗</a><small>L. Kopácsi, M. Barz, D. Sonntag · IEEE VRW 2026</small><a href="https://www.dfki.de/en/web/research/projects-and-publications/publication/17191">GTK: A Gaze-Based Interaction Toolkit in XR ↗</a><small>L. Kopácsi, A. Mohamed Selim, M. Barz, D. Sonntag · IEEE VRW 2026</small><a className="toolkit-link" href={links.toolkit}>{t.toolkit} ↗</a></div></div>
  </article>;
}
function GameProject({ t }) {
  return <article id="dead-inside" className="game-feature feature" data-project="games"><div className="game-media"><video controls playsInline preload="metadata" poster="/images/dead-inside-trailer.png" aria-label={t.trailer}><source src="/videos/Dead%20Inside.mp4" type="video/mp4" /><a href="/videos/Dead%20Inside.mp4">{t.videoFallback}</a></video><div className="video-caption"><span>{t.trailer}</span><span>2023 / UNITY / C#</span></div></div><div className="game-copy"><p className="eyebrow">02 — {t.gameCategory}</p><h3>{t.gameTitle}</h3><h4>{t.gameSubtitle}</h4><p>{t.gameText}</p><ul>{t.gameBullets.map(text => <li key={text}>{text}</li>)}</ul><a className="button secondary" href={links.steam}>{t.steam}<span aria-hidden="true">↗</span></a></div></article>;
}
function ProjectGraphic({ kind }) {
  if (kind === 'metric') return <div className="card-visual metric"><span>700<small>ms</small></span><i aria-hidden="true">→</i><strong>150<small>ms</small></strong></div>;
  if (kind === 'edge') return <div className="card-visual network" aria-hidden="true"><span>Go API</span><i>↔</i><span>Raspberry Pi</span><i>↔</i><span>AWS</span></div>;
  if (kind === 'services') return <div className="card-visual services" aria-hidden="true"><span>{'{ .NET }'}</span><i>···</i><span>{'{ .NET }'}</span><i>···</i><span>{'{ .NET }'}</span></div>;
  return <div className="card-visual simulation" aria-hidden="true"><div className="field-lines" /><span>CARLA / PYTHON / UNREAL</span><div className="vehicle" /></div>;
}
function ProjectCard({ card, index }) {
  return <article id={`project-${index}`} className="project-card" data-project={index === 3 ? 'games' : 'backend'}><div className="card-top"><span>{card.type}</span><span>{card.number}</span></div><ProjectGraphic kind={card.visual} /><div className="card-content"><h3>{card.title}</h3><p className="card-subtitle">{card.subtitle}</p><p>{card.body}</p><p className="card-foot">{card.foot}</p><Tags items={card.tags} /></div></article>;
}
function Projects({ t, labels, filter, setFilter }) {
  const showResearch = filter === 0 || filter === 1;
  const showGame = filter === 0 || filter === 3;
  const cards = t.cards.map((card, index) => ({ card, index })).filter(({ index }) => filter === 0 || (filter === 2 && index < 3) || (filter === 3 && index === 3));
  return <section id="projects" className="work section wrap"><div className="section-heading"><div><p className="eyebrow">{t.workLabel}</p><h2><Text value={t.workTitle} /></h2></div><p>{t.workIntro}</p></div><div className="project-toolbar"><div className="project-filters" role="group" aria-label={labels.filterLabel}>{labels.filters.map((name, i) => <button key={name} onClick={() => setFilter(i)} aria-pressed={filter === i}>{name}</button>)}</div><span className="result-count" role="status">{Number(showResearch) + Number(showGame) + cards.length} {labels.results}</span></div>
    {showResearch && <ResearchProject t={t} labels={labels} />}{showGame && <GameProject t={t} />}{cards.length > 0 && <><p className="eyebrow more-label">{t.moreProjects}</p><div className="project-grid">{cards.map(({ card, index }) => <ProjectCard key={card.number} card={card} index={index} />)}</div></>}
  </section>;
}
function About({ t }) {
  return <section id="about" className="about section"><div className="wrap about-grid"><div><p className="eyebrow">{t.aboutLabel}</p><h2><Text value={t.aboutTitle} /></h2><div className="about-mark" aria-hidden="true">{'{'}<span>dd.</span>{'}'}</div></div><div className="about-copy"><h3>{t.aboutLead}</h3>{t.aboutText.map(p => <p key={p}>{p}</p>)}<div className="about-facts"><div><span className="eyebrow">{t.education}</span><p><strong>{t.masters}</strong><br />RPTU Kaiserslautern-Landau<br /><small>2023 — {t.present}</small></p><p><strong>{t.bachelor}</strong><br />Düzce University<br /><small>2019 — 2023</small></p></div><div><span className="eyebrow">{t.languages}</span><p><Text value={t.languageList} /></p></div></div></div></div></section>;
}
function CareerExplorer({ t, labels, revealProject }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);
  const projectIds = ['project-0', 'project-1', 'master-xr', 'project-2'];
  const body = [t.cards[0].body, t.cards[1].body, t.xrIntro, t.cards[2].body][selected];
  const stack = [t.cards[0].tags, t.cards[1].tags, ['Unity', 'C#', 'MASTER XR'], t.cards[2].tags][selected];
  function handleKey(event, index) {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % 4;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + 3) % 4;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 3;
    if (next !== undefined) { event.preventDefault(); setSelected(next); tabs.current[next]?.focus(); }
  }
  return <section id="experience" className="section wrap career-section"><div className="section-heading"><div><p className="eyebrow">{t.experienceLabel}</p><h2>{t.experienceTitle}</h2></div><p>{labels.career}</p></div><div className="career-explorer"><div className="career-tabs" role="tablist" aria-label={labels.chapter} aria-orientation="vertical">{companies.map((company, i) => <button key={company} ref={el => { tabs.current[i] = el; }} id={`career-tab-${i}`} role="tab" aria-selected={selected === i} aria-controls={`career-panel-${i}`} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => handleKey(e, i)}><span>{t.dates[i]}</span><strong>{company}</strong><span className="career-tab-arrow" aria-hidden="true">↗</span></button>)}</div><div id={`career-panel-${selected}`} role="tabpanel" aria-labelledby={`career-tab-${selected}`} tabIndex={0} className="career-panel"><p className="eyebrow">{labels.selected} / 0{selected + 1}</p><h3>{t.roles[selected]}</h3><p>{body}</p><Tags items={stack} /><button className="career-project-link" onClick={() => revealProject(projectIds[selected])}>{labels.readProject} <span aria-hidden="true">↗</span></button></div></div></section>;
}
function Contact({ t }) {
  return <section id="contact" className="contact section wrap"><p className="eyebrow">{t.contactLabel}</p><div className="contact-grid"><div><h2><Text value={t.contactTitle} /></h2><p>{t.contactText}</p><a className="email-address" href={links.email}>dogukan.demir991@gmail.com <span aria-hidden="true">↗</span></a></div><SocialLinks t={t} /></div></section>;
}
export default function App() {
  const lang = document.documentElement.lang in translations ? document.documentElement.lang : 'en';
  const t = translations[lang];
  const labels = ui[lang];
  const [filter, setFilter] = useState(0);
  const [active, setActive] = useState('');
  const [pendingProject, setPendingProject] = useState(null);
  useEffect(() => {
    document.title = `Dogukan Demir — ${t.title}`;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-10% 0px -65% 0px' });
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    target?.scrollIntoView({ behavior: 'instant' });
    return () => observer.disconnect();
  }, [t.title]);
  useEffect(() => {
    if (!pendingProject) return;
    const target = document.getElementById(pendingProject);
    if (target) {
      window.history.pushState(null, '', `#${pendingProject}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      setPendingProject(null);
    }
  }, [pendingProject, filter]);
  function revealProject(id) { setFilter(0); setPendingProject(id); }
  return <div id="top"><a className="skip" href="#main">{t.skip}</a><Header lang={lang} t={t} active={active} /><main id="main"><Hero t={t} labels={labels} /><div className="skills wrap"><span>{t.focus}</span><div>Go <i>/</i> C# & .NET <i>/</i> AWS & Azure <i>/</i> Unity <i>/</i> Python <i>/</i> Docker</div></div><Projects t={t} labels={labels} filter={filter} setFilter={setFilter} /><About t={t} /><CareerExplorer t={t} labels={labels} revealProject={revealProject} /><Contact t={t} /></main><footer className="wrap"><a className="brand" href="#top">Dogukan Demir<span> / {t.title}</span></a><p>© {new Date().getFullYear()}</p><a href="#top">{t.back} ↑</a></footer></div>;
}
