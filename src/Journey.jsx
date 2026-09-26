import { useEffect, useRef, useState } from 'react';
import { route } from './journey.js';
import { categories } from './graph-data.js';

const W = 1000, H = 200, DWELL = 5200;
const colors = { ...Object.fromEntries(Object.entries(categories).map(([id, c]) => [id, c.color])), next: '#87e0c0' };
// Stops sit on a gentle wave; the road is a Catmull-Rom curve through them.
const points = route.map((_, i) => [50 + i * (900 / (route.length - 1)), 100 + (i % 2 ? -1 : 1) * (27 + 7 * Math.sin(i * 1.7))]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function segment(i) {
  const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
  return [p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2];
}
const curves = (from, to) => Array.from({ length: to - from }, (_, k) => { const [, a, b, d] = segment(from + k); return `C${a} ${b} ${d}`; }).join(' ');
const road = (from, to) => `M${points[from]} ${curves(from, to)}`;
// The built road enters from the left edge and ends at the last stop before "Next".
const built = `M0 ${points[0][1] + 18} Q25 ${points[0][1] + 4} ${points[0]} ${curves(0, points.length - 2)}`;
// Splits the current segment at u (de Casteljau) for the travelled path and the car's heading.
function travel(pos) {
  const i = Math.min(Math.floor(pos), points.length - 2), u = pos - i;
  const [p0, p1, p2, p3] = segment(i);
  const a = lerp(p0, p1, u), b = lerp(p1, p2, u), m = lerp(p2, p3, u), d = lerp(a, b, u), e = lerp(b, m, u), f = lerp(d, e, u);
  const [dx, dy] = u > 0.001 ? [e[0] - d[0], e[1] - d[1]] : [p1[0] - p0[0], p1[1] - p0[1]];
  const path = (i > 0 ? road(0, i) : `M${points[0]}`) + ` C${a} ${d} ${f}`;
  return { path, at: f, angle: Math.atan2(dy, dx) * 180 / Math.PI };
}
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Journey({ onOpen }) {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(0);
  const [driving, setDriving] = useState(() => !reducedMotion());
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const section = useRef(null), tabs = useRef([]), posRef = useRef(0);
  const stop = route[active], last = route.length - 1;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  // Leave it be and it drives itself; any manual choice hands over the wheel.
  useEffect(() => {
    if (!driving || hold || !inView) return;
    const timer = setTimeout(() => setActive(a => (a + 1) % route.length), DWELL);
    return () => clearTimeout(timer);
  }, [driving, hold, inView, active]);
  useEffect(() => {
    const from = posRef.current, distance = Math.abs(active - from);
    if (reducedMotion() || distance === 0 || (from === last && active === 0)) { posRef.current = active; setPos(active); return; }
    const duration = 650 + 260 * Math.sqrt(distance);
    let frame, start;
    const step = time => {
      start ??= time;
      const t = Math.min(1, (time - start) / duration), eased = t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      posRef.current = from + (active - from) * eased;
      setPos(posRef.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, last]);

  function take(index, focus) {
    setDriving(false);
    setActive(index);
    if (focus) tabs.current[index]?.focus();
  }
  function handleKey(event) {
    const next = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    take((next + route.length) % route.length, true);
  }
  function toggleDrive() {
    if (!driving && active === last) setActive(0);
    setDriving(d => !d);
  }
  const car = travel(Math.min(pos, last));
  const place = ([x, y]) => ({ left: `${x / W * 100}%`, top: `${y / H * 100}%` });

  return <section id="route" ref={section} className="route" aria-labelledby="route-heading">
    <div className="route-head"><div><p className="dev-eyebrow">01 / THE ROUTE SO FAR</p><h2 id="route-heading">Seven years, two countries,<br />and a semester in a third.</h2></div>
      <p>From a solo game to production backends and research labs. Point at a stop, take the wheel, or leave it be and it drives the route itself — the arrow keys work too.</p></div>
    <div className="route-shell" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false); }}>
      <div className="route-map">
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="route-trail" x1="0" x2={W} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#b49de8" /><stop offset=".5" stopColor="#7caef4" /><stop offset="1" stopColor="#87e0c0" /></linearGradient>
            <filter id="route-glow" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path className="road-edge" d={built} />
          <path className="road-surface" d={built} />
          <path className="road-line" d={road(0, last - 1)} />
          <path className="road-ahead" d={road(last - 1, last)} />
          <path className="road-trail" d={car.path} filter="url(#route-glow)" />
        </svg>
        <span className="route-car" style={{ ...place(car.at), '--heading': `${car.angle}deg` }} aria-hidden="true"><i /></span>
        <div className="route-stops" role="tablist" aria-label="Career route" onKeyDown={handleKey}>
          {route.map((s, i) => <button key={i} ref={el => { tabs.current[i] = el; }} id={`route-tab-${i}`} role="tab" aria-selected={i === active} aria-controls="route-panel" tabIndex={i === active ? 0 : -1}
            className={`route-stop ${points[i][1] < 100 ? 'up' : 'down'} ${i <= pos + .01 ? 'passed' : ''}`} style={{ ...place(points[i]), '--stop-color': colors[s.category] }} onClick={() => take(i)}>
            <span className="route-dot" /><span className="route-label"><b>{s.year}</b><span>{s.label}</span></span>
          </button>)}
        </div>
      </div>
      <div id="route-panel" role="tabpanel" aria-labelledby={`route-tab-${active}`} className="route-card" style={{ '--stop-color': colors[stop.category] }}>
        <div className={`route-year ${stop.year.length > 4 ? 'long' : ''}`} key={`y${active}`}>{stop.year}</div>
        <div className="route-story" key={`s${active}`}>
          <p className="route-meta"><span>{String(active + 1).padStart(2, '0')} / {String(route.length).padStart(2, '0')}</span>{stop.place}</p>
          <h3>{stop.title}</h3>
          <p>{stop.text}</p>
          {stop.node ? <button className="route-open" onClick={() => { setDriving(false); onOpen(stop.node); }}>Read the full story <span aria-hidden="true">↘</span></button>
            : <a className="route-open" href="#contact">Get in touch <span aria-hidden="true">↘</span></a>}
        </div>
      </div>
      <div className="route-controls">
        <div className="route-timer">{driving && !hold && inView && <i key={active} style={{ animationDuration: `${DWELL}ms` }} />}</div>
        <p>{driving ? 'Driving the route · hover to hold' : 'You have the wheel'}</p>
        <div>
          <button aria-label="Previous stop" onClick={() => take((active + last) % route.length)}>‹</button>
          <button aria-pressed={driving} onClick={toggleDrive}>{driving ? 'Ⅱ Pause route' : '▷ Drive the route'}</button>
          <button aria-label="Next stop" onClick={() => take((active + 1) % route.length)}>›</button>
        </div>
      </div>
    </div>
  </section>;
}
