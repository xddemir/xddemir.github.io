import { useEffect, useRef, useState } from 'react';

// Interactive figures for the project stories. Each caption says what is measured and
// what is only illustrative; none of them replays real production or study data.
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a, b, t) => a + (b - a) * t;

function Figure({ label, caption, controls, children }) {
  return <figure className="story-figure">
    <div className="figure-head"><span className="dev-eyebrow">{label}</span>{controls && <div className="figure-controls">{controls}</div>}</div>
    <div className="figure-body">{children}</div>
    <figcaption>{caption}</figcaption>
  </figure>;
}
function Toggle({ label, options, value, onChange }) {
  return <div className="figure-toggle" role="group" aria-label={label}>
    {options.map(([id, text]) => <button key={id} aria-pressed={value === id} onClick={() => onChange(id)}>{text}</button>)}
  </div>;
}
// Eases a number toward its target, so shapes and their connectors move together.
function useTween(target, duration = 650) {
  const [value, setValue] = useState(target), current = useRef(target);
  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    if (reducedMotion()) { current.current = target; setValue(target); return; }
    let frame, start;
    const step = time => {
      start ??= time;
      const t = Math.min(1, (time - start) / duration), eased = 1 - (1 - t) ** 3;
      current.current = lerp(from, target, eased);
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

/* RUSH: where each stage of the voice pipeline runs. */
const KIOSK_Y = 66, CLOUD_Y = 186;
const voiceStages = [['Microphone', 'kiosk', 'kiosk', 'audio'], ['Speech → text', 'cloud', 'kiosk', 'text'], ['Language model', 'cloud', 'cloud', 'text'], ['Text → speech', 'cloud', 'kiosk', 'audio'], ['Speaker', 'kiosk', 'kiosk']];
function VoiceFigure() {
  const [mode, setMode] = useState('hybrid');
  const k = useTween(mode === 'hybrid' ? 1 : 0);
  const at = i => [70 + i * 145, lerp(voiceStages[i][1] === 'kiosk' ? KIOSK_Y : CLOUD_Y, voiceStages[i][2] === 'kiosk' ? KIOSK_Y : CLOUD_Y, k)];
  const lane = i => voiceStages[i][mode === 'hybrid' ? 2 : 1];
  const links = voiceStages.slice(0, -1).map((s, i) => {
    const [x1, y1] = at(i), [x2, y2] = at(i + 1), a = x1 + 54, b = x2 - 54;
    return { d: `M${a} ${y1} C${(a + b) / 2} ${y1} ${(a + b) / 2} ${y2} ${b} ${y2}`, mid: [(a + b) / 2, (y1 + y2) / 2], payload: s[3], crosses: lane(i) !== lane(i + 1), up: lane(i) === 'kiosk' };
  });
  const crossings = links.filter(l => l.crosses);
  return <Figure label="FIGURE · WHERE THE VOICE RUNS" controls={<Toggle label="Pipeline design" value={mode} onChange={setMode} options={[['cloud', 'Full cloud'], ['hybrid', 'Hybrid · shipped']]} />}
    caption="Where each stage runs in the two designs. In the full-cloud version, audio crosses the network twice per turn; in the hybrid that shipped, only text does. The figure shows placement, not measured timings.">
    <svg className="voice-figure" viewBox="0 0 720 250" role="img" aria-label={`${mode === 'hybrid' ? 'Hybrid' : 'Full cloud'} pipeline: ${crossings.map(l => l.payload).join(' and ')} cross the network.`}>
      <rect className="lane" x="4" y="18" width="712" height="96" rx="8" /><rect className="lane cloud" x="4" y="138" width="712" height="96" rx="8" />
      <text className="lane-label" x="16" y="34">AT THE KIOSK · RASPBERRY PI 5</text><text className="lane-label" x="16" y="228">IN THE CLOUD · AWS</text>
      <line className="network" x1="4" x2="716" y1="126" y2="126" /><text className="network-label" x="708" y="122" textAnchor="end">NETWORK</text>
      {links.map((l, i) => <g key={i} className={l.crosses ? `link crosses ${l.payload}` : 'link'}>
        <path d={l.d} />
        {l.crosses && k % 1 === 0 && <g transform={`translate(${l.mid[0]} ${l.mid[1]})`}><rect x="-31" y="-11" width="62" height="22" rx="11" /><text y="4" textAnchor="middle">{l.payload} {l.up ? '↑' : '↓'}</text></g>}
      </g>)}
      {voiceStages.map((s, i) => { const [x, y] = at(i); return <g key={s[0]} className={`stage ${lane(i)}`} transform={`translate(${x} ${y})`}><rect x="-54" y="-20" width="108" height="40" rx="7" /><text y="4" textAnchor="middle">{s[0]}</text></g>; })}
      {!reducedMotion() && k % 1 === 0 && <circle className="packet" r="4"><animateMotion key={mode} dur="3.4s" repeatCount="indefinite" path={links.map((l, i) => i ? l.d.replace(/^M/, 'L') : l.d).join(' ')} /></circle>}
    </svg>
    <p className="figure-readout">Crosses the network each turn: <strong>{crossings.map(l => `${l.payload} ${l.up ? '↑' : '↓'}`).join(' · ')}</strong></p>
  </Figure>;
}

/* Campus Games: registration response time before and after the SSO refactor. */
function LatencyFigure() {
  const [burst, setBurst] = useState(0);
  const rows = [['Before', 700, 'old SSO integration'], ['After', 150, 'refactored sign-on path']];
  const motion = !reducedMotion();
  return <Figure label="FIGURE · REGISTRATION RESPONSE TIME" controls={motion && <button className="figure-button" onClick={() => setBurst(b => b + 1)}>↻ Send a burst</button>}
    caption="Registration response time before and after the SSO refactor, drawn to the same scale. The timings are the reported response times; the moving requests are illustrative and slowed down four times so you can follow them.">
    <div className="latency-figure">
      {rows.map(([name, ms, note]) => <div className={`latency-row ${name.toLowerCase()}`} key={name}>
        <div className="latency-name"><strong>{name}</strong><span>{note}</span></div>
        <div className="latency-track"><span className="latency-bar" style={{ width: `${ms / 8}%` }} />
          {motion && burst > 0 && Array.from({ length: 6 }, (_, i) => <i key={`${burst}-${i}`} style={{ '--end': `${ms / 8}%`, animationDuration: `${ms * 4}ms`, animationDelay: `${i * 220}ms` }} />)}
        </div>
        <div className="latency-value">≈{ms}<small> ms</small></div>
      </div>)}
      <div className="latency-axis" aria-hidden="true">{[0, 200, 400, 600, 800].map(v => <span key={v} style={{ left: `${v / 8}%` }}>{v}</span>)}</div>
      <p className="figure-readout"><strong>≈79% less time</strong> per registration, and no more timeouts at peak onboarding.</p>
    </div>
  </Figure>;
}

/* DFKI: the two input methods the study compared. */
const parts = [[150, 118, 'gear'], [255, 92, 'cube'], [360, 122, 'hex'], [465, 94, 'cone'], [570, 118, 'plate']];
const EYE = [300, 262], HAND = [455, 266];
function Part({ shape }) {
  if (shape === 'gear') return <circle r="17" />;
  if (shape === 'cube') return <rect x="-15" y="-15" width="30" height="30" rx="3" />;
  if (shape === 'hex') return <polygon points="17,0 8.5,15 -8.5,15 -17,0 -8.5,-15 8.5,-15" />;
  if (shape === 'cone') return <polygon points="0,-18 17,14 -17,14" />;
  return <rect x="-20" y="-10" width="40" height="20" rx="8" />;
}
function GazeFigure() {
  const [mode, setMode] = useState('gaze');
  const [target, setTarget] = useState(2);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    setConfirmed(false);
    const timer = setTimeout(() => setConfirmed(true), reducedMotion() ? 0 : mode === 'gaze' ? 450 : 1100);
    return () => clearTimeout(timer);
  }, [mode, target]);
  const [tx, ty] = parts[target];
  // Beams are unit lines scaled to length, so angle and length transition together.
  const beam = ([x, y], gap) => ({ angle: Math.atan2(ty - y, tx - x), length: Math.hypot(tx - x, ty - y) - gap });
  const gaze = beam(EYE, 30), ray = beam(HAND, 0);
  const steps = mode === 'gaze' ? ['Look at the part', 'Confirm with the controller'] : ['Point the controller ray at the part', 'Confirm with the controller'];
  return <Figure label="FIGURE · TWO WAYS TO PICK A PART" controls={<Toggle label="Interaction method" value={mode} onChange={setMode} options={[['gaze', 'Gaze + confirm'], ['controller', 'Controller only']]} />}
    caption="The two input methods the study compared. Click a part on the table to make it the target: the eyes jump there, the controller ray has to travel. This explains the inputs; it does not show the study’s results.">
    <svg className={`gaze-figure ${mode}`} viewBox="0 0 720 306">
      <rect className="table" x="80" y="40" width="560" height="150" rx="14" /><text className="lane-label" x="96" y="60">SORTING TABLE</text>
      {parts.map(([x, y, shape], i) => <g key={shape} className={`part ${i === target ? 'target' : ''} ${i === target && confirmed ? 'selected' : ''}`} transform={`translate(${x} ${y})`}
        role="button" tabIndex={0} aria-label={`Target part ${i + 1}`} aria-pressed={i === target} onClick={() => setTarget(i)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTarget(i); } }}>
        <circle className="part-hit" r="30" /><Part shape={shape} />{i === target && confirmed && <circle className="confirm-ring" r="30" />}
      </g>)}
      {mode === 'gaze' ? <>
        <g className="gaze-line" style={{ transform: `translate(${EYE[0]}px,${EYE[1]}px) rotate(${gaze.angle}rad)` }}><line x2="1" vectorEffect="non-scaling-stroke" style={{ transform: `scaleX(${gaze.length})` }} /></g>
        <g className="reticle" style={{ transform: `translate(${tx}px,${ty}px)` }}><circle r="26" /><circle r="3" /></g>
      </> : <g className="ray" style={{ transform: `translate(${HAND[0]}px,${HAND[1]}px) rotate(${ray.angle}rad)` }}>
        <line x2="1" vectorEffect="non-scaling-stroke" style={{ transform: `scaleX(${ray.length})` }} /><circle r="5" style={{ transform: `translateX(${ray.length}px)` }} />
      </g>}
      <g className="user" transform={`translate(${EYE[0]} ${EYE[1]})`}><path d="M-18 0 Q0 -14 18 0 Q0 14 -18 0Z" /><circle r="5" /><text y="30" textAnchor="middle">EYES</text></g>
      <g className="user" transform={`translate(${HAND[0]} ${HAND[1]})`}><rect x="-8" y="-6" width="16" height="26" rx="6" /><text y="30" textAnchor="middle">CONTROLLER</text></g>
    </svg>
    <ol className="gaze-steps">{steps.map((s, i) => <li key={s} className={(i === 0 || confirmed) ? 'done' : ''}><span>0{i + 1}</span>{s}{i === 1 && confirmed && <b> ✓</b>}</li>)}</ol>
  </Figure>;
}

/* NTT DATA: a Saga with compensations and an event log. */
const sagaSteps = [
  { action: 'Create customer', undo: 'Delete customer', done: 'CustomerCreated', undone: 'CustomerDeleted' },
  { action: 'Assign account manager', undo: 'Unassign manager', done: 'ManagerAssigned', undone: 'ManagerUnassigned' },
  { action: 'Provision access', undo: 'Revoke access', done: 'AccessProvisioned', undone: 'AccessRevoked', failed: 'AccessProvisioningFailed' },
  { action: 'Send welcome message', undo: 'Retract message', done: 'WelcomeSent', undone: 'WelcomeRetracted' },
];
// Frames are [step, state, event?]; a failure undoes the completed steps in reverse.
function sagaFrames(fail) {
  const frames = [];
  for (let i = 0; i < sagaSteps.length; i++) {
    frames.push([i, 'running']);
    if (i === fail) {
      frames.push([i, 'failed', sagaSteps[i].failed]);
      for (let j = i - 1; j >= 0; j--) frames.push([j, 'compensating'], [j, 'compensated', sagaSteps[j].undone]);
      return frames;
    }
    frames.push([i, 'done', sagaSteps[i].done]);
  }
  return frames;
}
function SagaFigure() {
  const [run, setRun] = useState(null);
  const [frame, setFrame] = useState(0);
  const frames = run ? sagaFrames(run.fail) : [];
  useEffect(() => {
    if (!run) return;
    if (reducedMotion()) { setFrame(frames.length); return; }
    if (frame >= frames.length) return;
    const timer = setTimeout(() => setFrame(f => f + 1), 560);
    return () => clearTimeout(timer);
  }, [run, frame, frames.length]);
  const states = sagaSteps.map(() => 'idle'), log = [];
  for (const [step, state, event] of frames.slice(0, frame)) { states[step] = state; if (event) log.push([step, event, state]); }
  const finished = run && frame >= frames.length;
  const start = fail => { setRun({ fail, id: Date.now() }); setFrame(0); };
  return <Figure label="FIGURE · A SAGA ACROSS FOUR SERVICES" controls={<><button className="figure-button" onClick={() => start(-1)}>▷ Run</button><button className="figure-button warn" onClick={() => start(2)}>▷ Run with a failure at step 3</button></>}
    caption="How a Saga keeps a multi-service workflow consistent. Make a step fail and the completed steps are undone in reverse — and every change, including the undo, is kept as an event. A generic example of the pattern, not the platform’s actual workflow.">
    <div className="saga-figure">
      <ol className="saga-steps">{sagaSteps.map(({ action, undo }, i) => <li key={action} className={states[i]}>
        <small>SERVICE {i + 1}</small><strong>{states[i] === 'compensating' || states[i] === 'compensated' ? `↺ ${undo}` : action}</strong>
        <span>{{ idle: 'waiting', running: 'running…', done: 'done', failed: 'failed', compensating: 'undoing…', compensated: 'undone' }[states[i]]}</span>
      </li>)}</ol>
      <div className="saga-log" aria-live="polite"><p className="dev-eyebrow">EVENT LOG</p>
        {log.length ? <ol>{log.map(([step, event, state], i) => <li key={i} className={state}><span>{String(i + 1).padStart(2, '0')}</span>{event}<small>service {step + 1}</small></li>)}</ol> : <p className="saga-empty">Run the saga to fill the log.</p>}
        {finished && <p className={`saga-result ${run.fail >= 0 ? 'rolled-back' : ''}`}>{run.fail >= 0 ? 'Rolled back: nothing is left half-done.' : 'Committed: every service agrees.'}</p>}
      </div>
    </div>
  </Figure>;
}

/* Dead Inside: an enemy driven by explicit states and transitions. */
// States escalate left to right: escalations arc over the top, retreats under the bottom.
const fsmStates = { patrol: [75, 'Patrol'], investigate: [262, 'Investigate'], chase: [449, 'Chase'], attack: [636, 'Attack'] };
const FSM_Y = 150, FSM_H = 22;
const fsmEdges = [['patrol', 'investigate', 'noise', 'hears a noise'], ['investigate', 'patrol', 'wait', 'search ends'], ['investigate', 'chase', 'see', 'sees the player'], ['chase', 'investigate', 'hide', 'loses sight'], ['patrol', 'chase', 'see', 'sees the player'], ['chase', 'attack', 'close', 'player in reach'], ['attack', 'chase', 'away', 'player out of reach']];
const fsmEvents = [['noise', 'Make a noise'], ['see', 'Step into view'], ['close', 'Get close'], ['away', 'Back away'], ['hide', 'Break line of sight'], ['wait', 'Wait it out']];
function edgeGeometry([from, to]) {
  const x1 = fsmStates[from][0], x2 = fsmStates[to][0], up = x2 > x1, long = Math.abs(x2 - x1) > 200;
  const y = up ? FSM_Y - FSM_H : FSM_Y + FSM_H, inset = long ? 0 : 30, bend = (long ? 150 : 60) * (up ? -1 : 1);
  const ax = x1 + (up ? inset : -inset), bx = x2 + (up ? -inset : inset), cx = (ax + bx) / 2, apex = y + bend / 2;
  return { d: `M${ax} ${y} Q${cx} ${y + bend} ${bx} ${y}`, label: [cx, up ? apex - 8 : apex + 16] };
}
function EnemyFigure() {
  const [state, setState] = useState('patrol');
  const [last, setLast] = useState(null);
  const [note, setNote] = useState('The enemy is patrolling. Try an event.');
  function trigger(event, text) {
    const edge = fsmEdges.find(([from, , e]) => from === state && e === event);
    if (!edge) { setLast(null); setNote(`Ignored: “${text.toLowerCase()}” has no transition out of ${fsmStates[state][1]}.`); return; }
    setState(edge[1]); setLast(edge); setNote(`${fsmStates[edge[0]][1]} → ${fsmStates[edge[1]][1]}: ${edge[3]}.`);
  }
  return <Figure label="FIGURE · AN ENEMY AS A STATE MACHINE" controls={<button className="figure-button" onClick={() => { setState('patrol'); setLast(null); setNote('The enemy is patrolling. Try an event.'); }}>↺ Reset</button>}
    caption="A simplified sketch of the approach. Trigger events and watch the enemy change state: every change of behaviour is one explicit transition with one reason, and events without a transition are ignored. The states shown are illustrative, not an export of the game’s code.">
    <svg className="fsm-figure" viewBox="0 0 720 250" role="img" aria-label={`Current state: ${fsmStates[state][1]}`}>
      <defs>{['idle', 'active'].map(kind => <marker key={kind} id={`fsm-arrow-${kind}`} className={kind} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" /></marker>)}</defs>
      {fsmEdges.map(edge => { const g = edgeGeometry(edge), active = last === edge; return <g key={edge.join()} className={`fsm-edge ${active ? 'active' : ''} ${edge[0] === state ? 'available' : ''}`}>
        <path d={g.d} markerEnd={`url(#fsm-arrow-${active ? 'active' : 'idle'})`} /><text x={g.label[0]} y={g.label[1]} textAnchor="middle">{edge[3]}</text></g>; })}
      {Object.entries(fsmStates).map(([id, [x, name]]) => <g key={id} className={`fsm-state ${id === state ? 'current' : ''}`} transform={`translate(${x} ${FSM_Y})`}>
        <rect x="-59" y={-FSM_H} width="118" height={FSM_H * 2} rx={FSM_H} /><text y="5" textAnchor="middle">{name}</text></g>)}
    </svg>
    <div className="fsm-events" role="group" aria-label="Game events">{fsmEvents.map(([id, text]) => <button key={id} className={fsmEdges.some(([from, , e]) => from === state && e === id) ? 'live' : ''} onClick={() => trigger(id, text)}>{text}</button>)}</div>
    <p className="figure-readout" aria-live="polite">{note}</p>
  </Figure>;
}

/* Farming simulator: a machine working a field in passes. */
const LANES = [52, 94, 136, 178, 220];
const FIELD_L = 90, FIELD_R = 630, TURN = 21;
const fieldPath = LANES.map((y, i) => i === 0 ? `M${FIELD_L} ${y} H${FIELD_R}` : `A${TURN} ${TURN} 0 0 ${i % 2} ${i % 2 ? FIELD_R : FIELD_L} ${y} H${i % 2 ? FIELD_L : FIELD_R}`).join(' ');
function FieldFigure() {
  const path = useRef(null);
  const [progress, setProgress] = useState(() => reducedMotion() ? 0.45 : 0);
  const [running, setRunning] = useState(() => !reducedMotion());
  const [machine, setMachine] = useState({ x: FIELD_L, y: LANES[0], angle: 0, pass: 1 });
  useEffect(() => {
    if (!running) return;
    let frame, previous;
    const step = time => {
      const dt = previous ? Math.min(time - previous, 50) : 0; previous = time;
      setProgress(p => (p + dt / 16000) % 1);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  useEffect(() => {
    const el = path.current, total = el.getTotalLength(), at = progress * total, a = el.getPointAtLength(at), b = el.getPointAtLength(Math.min(total, at + 2));
    // Each pass is one straight run plus the turn that follows it.
    const pass = Math.min(LANES.length, 1 + Math.floor(at / (FIELD_R - FIELD_L + Math.PI * TURN)));
    setMachine({ x: a.x, y: a.y, angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, pass });
  }, [progress]);
  const { pass } = machine;
  return <Figure label="FIGURE · WORKING A FIELD IN PASSES" controls={<button className="figure-button" aria-pressed={running} onClick={() => setRunning(r => !r)}>{running ? 'Ⅱ Pause' : '▷ Drive'}</button>}
    caption="An illustration of the setting — a machine working a field in passes, the kind of scenario a farm simulator has to reproduce. It is not output from the capstone simulator.">
    <svg className="field-figure" viewBox="0 0 720 270" role="img" aria-label={`Machine on pass ${pass} of ${LANES.length}`}>
      <rect className="field" x="40" y="26" width="640" height="220" rx="10" />
      {Array.from({ length: 21 }, (_, i) => <line key={i} className="crop-row" x1="58" x2="662" y1={36 + i * 10} y2={36 + i * 10} />)}
      <path className="field-worked" d={fieldPath} pathLength="1" strokeDasharray={`${progress} 1`} />
      <path ref={path} className="field-plan" d={fieldPath} />
      <g className="machine" transform={`translate(${machine.x} ${machine.y}) rotate(${machine.angle})`}>
        <path className="sensor" d="M14 0 L70 -24 L70 24 Z" /><rect x="-16" y="-11" width="30" height="22" rx="4" /><rect className="cab" x="-2" y="-7" width="11" height="14" rx="2" />
      </g>
      <text className="lane-label" x="56" y="20">FIELD · PASS {pass} / {LANES.length}</text>
    </svg>
  </Figure>;
}

/* RUSH: soft sensing turns raw signals into an estimate of wear. Synthetic signals only. */
const T = 60, SERVICE_AT = 49, FAIL_AT = 58, THRESHOLD = 0.6;
const eventBands = [[8, 14], [24, 30], [40, 45], [52, 59]];
const tx = t => 50 + t * (640 / (T - 1)), vy = v => 200 - v * 165;
function machineSignals(serviced) {
  return Array.from({ length: T }, (_, t) => {
    const age = (serviced && t >= SERVICE_AT ? t - SERVICE_AT : t) / (T - 1);
    return { t, wear: 0.1 + 0.85 * age ** 2.2, current: 0.22 + 0.5 * age ** 2 + 0.035 * Math.sin(t * 1.7), fill: 0.14 + 0.36 * age ** 1.8 + 0.03 * Math.sin(t * 2.9 + 1) };
  });
}
const trace = (points, key) => points.map((p, i) => `${i ? 'L' : 'M'}${tx(p.t).toFixed(1)} ${vy(p[key]).toFixed(1)}`).join(' ');
function MaintenanceFigure() {
  const [mode, setMode] = useState('predictive');
  const predictive = mode === 'predictive';
  const points = machineSignals(predictive).filter(p => predictive || p.t <= FAIL_AT);
  const crossing = points.find(p => p.wear >= THRESHOLD), broken = points.at(-1);
  return <Figure label="FIGURE · SEEING WEAR BEFORE IT BREAKS" controls={<Toggle label="Maintenance approach" value={mode} onChange={setMode} options={[['reactive', 'Without soft sensing'], ['predictive', 'With soft sensing']]} />}
    caption="An illustration of the idea with synthetic signals — not data from RUSH machines. Without a soft sensor you watch raw signals until something breaks; with one, an estimate of wear crosses a threshold early enough to service the machine between events.">
    <svg className="maintenance-figure" viewBox="0 0 720 240" role="img" aria-label={predictive ? 'With soft sensing, the wear estimate crosses the service threshold between events, and the machine is serviced before it fails.' : 'Without soft sensing, the measured signals rise until the machine breaks during an event.'}>
      {eventBands.map(([a, b]) => <g key={a} className="event-band"><rect x={tx(a)} y="22" width={tx(b) - tx(a)} height="178" /><text x={(tx(a) + tx(b)) / 2} y="16" textAnchor="middle">EVENT</text></g>)}
      <line className="axis" x1="50" x2="690" y1="200" y2="200" /><text className="lane-label" x="690" y="224" textAnchor="end">TIME IN THE FIELD →</text>
      <g key={mode}>
        <path className="trace current" d={trace(points, 'current')} pathLength="1" />
        <path className="trace fill" d={trace(points, 'fill')} pathLength="1" />
        {predictive && <path className="trace wear" d={trace(points, 'wear')} pathLength="1" />}
      </g>
      {predictive ? <>
        <line className="threshold" x1="50" x2="690" y1={vy(THRESHOLD)} y2={vy(THRESHOLD)} /><text className="threshold-label" x="56" y={vy(THRESHOLD) - 7}>SERVICE THRESHOLD</text>
        <g className="service-mark" transform={`translate(${tx(SERVICE_AT)} 200)`}><line y2="-148" /><text y="-154" textAnchor="middle">serviced</text></g>
        <circle className="cross-dot" cx={tx(crossing.t)} cy={vy(crossing.wear)} r="5" />
      </> : <>
        <rect className="downtime" x={tx(FAIL_AT)} y="22" width={tx(59) - tx(FAIL_AT)} height="178" />
        <g className="failure-mark" transform={`translate(${tx(FAIL_AT)} ${vy(broken.current)})`}><path d="M-7 -7 L7 7 M7 -7 L-7 7" /><text x="-12" y="-14" textAnchor="end">breaks mid-event</text></g>
      </>}
    </svg>
    <ul className="maintenance-legend"><li className="current">Pump current · measured</li><li className="fill">Fill time · measured</li>{predictive && <li className="wear">Estimated wear · soft sensor</li>}</ul>
    <p className="figure-readout" aria-live="polite">{predictive ? <><strong>Serviced between events.</strong> The wear estimate crosses the threshold in a quiet window, before anything breaks.</> : <><strong>Breaks mid-event.</strong> Without an estimate of wear, the first clear sign of trouble is the failure itself.</>}</p>
  </Figure>;
}

const figures = { voice: VoiceFigure, latency: LatencyFigure, gaze: GazeFigure, saga: SagaFigure, fsm: EnemyFigure, field: FieldFigure, maintenance: MaintenanceFigure };
export default function StoryFigure({ kind }) {
  const Component = figures[kind];
  return Component ? <Component /> : null;
}
