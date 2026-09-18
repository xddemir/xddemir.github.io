import { useEffect, useRef, useState } from "react";
import { categories } from "./graph-data.js";

export default function GraphScene({
  nodes,
  edges,
  selected,
  onSelect,
  filter,
  resetKey,
  zoom,
  rotating,
}) {
  const host = useRef(null),
    canvas = useRef(null),
    buttons = useRef(new Map());
  const camera = useRef({ yaw: -0.16, pitch: 0.16 }),
    drag = useRef(null);
  const [dragging, setDragging] = useState(false),
    [hovered, setHovered] = useState(null);
  useEffect(() => {
    camera.current = { yaw: -0.16, pitch: 0.16 };
  }, [resetKey]);
  useEffect(() => {
    const el = host.current,
      ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    let frame,
      width = 0,
      height = 0,
      previous = 0,
      inView = true;
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.current.width = width * dpr;
      canvas.current.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(el);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    visibility.observe(el);
    const connected = new Set(
      edges.flatMap((e) =>
        e.from === hovered ? [e.to] : e.to === hovered ? [e.from] : [],
      ),
    );
    function draw(time) {
      const dt = previous ? Math.min(time - previous, 40) : 0;
      previous = time;
      if (!width || !height || !inView || document.hidden) {
        frame = requestAnimationFrame(draw);
        return;
      }
      if (rotating) camera.current.yaw += dt * 0.000065;
      const { yaw, pitch } = camera.current;
      const scale =
        Math.min(
          width / (filter === "all" ? 1360 : 1180),
          height / (filter === "all" ? 1050 : 800),
        ) * zoom;
      const ys = nodes.map((n) => n.position[1]);
      const centerY =
        filter === "all"
          ? height / 2
          : height / 2 - ((Math.max(...ys) + Math.min(...ys)) / 2) * scale;
      const project = ([x, y, z]) => {
        const rx = x * Math.cos(yaw) + z * Math.sin(yaw),
          rz = -x * Math.sin(yaw) + z * Math.cos(yaw),
          ry = y * Math.cos(pitch) - rz * Math.sin(pitch),
          depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
        const perspective = 1100 / (1100 - depth);
        return {
          x: width / 2 + rx * scale * perspective,
          y: centerY + ry * scale * perspective,
          z: depth,
          size: perspective,
        };
      };
      const points = new Map(nodes.map((n) => [n.id, project(n.position)]));
      ctx.clearRect(0, 0, width, height);
      // Three spatial guide rings share the nodes' perspective transform.
      ctx.strokeStyle = "#62849a26";
      ctx.lineWidth = 0.7;
      ctx.setLineDash([2, 7]);
      for (let plane = 0; plane < 3; plane++) {
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const a = (i / 100) * Math.PI * 2,
            u = Math.cos(a) * 350,
            v = Math.sin(a) * 260;
          const p = project(
            plane === 0 ? [u, 0, v] : plane === 1 ? [u, v, 0] : [0, u, v],
          );
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (const edge of edges) {
        const a = points.get(edge.from),
          b = points.get(edge.to);
        if (!a || !b) continue;
        const active = edge.from === hovered || edge.to === hovered;
        ctx.strokeStyle = active
          ? "#99ebcd"
          : hovered
            ? "#50647530"
            : edge.kind === "tool"
              ? "#739aac65"
              : "#8faec5a0";
        ctx.lineWidth = active ? 1.8 : edge.kind === "tool" ? 0.9 : 1.3;
        ctx.setLineDash(edge.kind === "tool" ? [3, 5] : []);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        // A small arrow shows the direction: organization -> project -> tool.
        const angle = Math.atan2(b.y - a.y, b.x - a.x),
          px = a.x + (b.x - a.x) * 0.65,
          py = a.y + (b.y - a.y) * 0.65;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(
          px - 5 * Math.cos(angle - 0.45),
          py - 5 * Math.sin(angle - 0.45),
        );
        ctx.lineTo(px, py);
        ctx.lineTo(
          px - 5 * Math.cos(angle + 0.45),
          py - 5 * Math.sin(angle + 0.45),
        );
        ctx.stroke();
        if (active && width > 600) {
          ctx.font = "10px Segoe UI";
          const label = edge.label,
            w = ctx.measureText(label).width;
          const x = (a.x + b.x) / 2,
            y = (a.y + b.y) / 2;
          ctx.fillStyle = "#101923ed";
          ctx.fillRect(x - w / 2 - 5, y - 9, w + 10, 17);
          ctx.fillStyle = "#c9e9de";
          ctx.textAlign = "center";
          ctx.fillText(label, x, y + 3);
        }
      }
      ctx.setLineDash([]);
      for (const n of nodes) {
        const p = points.get(n.id),
          button = buttons.current.get(n.id);
        if (!button) continue;
        button.style.left = `${p.x}px`;
        button.style.top = `${p.y}px`;
        button.style.setProperty(
          "--depth",
          Math.max(0.7, Math.min(1.25, p.size)),
        );
        button.style.zIndex = n.id === hovered ? 60 : Math.round(p.z / 25) + 20;
        button.style.opacity =
          hovered && hovered !== n.id && !connected.has(n.id)
            ? ".23"
            : String(Math.max(0.65, Math.min(1, 0.86 + p.z / 650)));
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
    };
  }, [nodes, edges, hovered, zoom, rotating]);
  function pointerDown(e) {
    if (e.target.closest("button") || e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }
  return (
    <div
      ref={host}
      className={`graph-scene ${dragging ? "is-dragging" : ""}`}
      aria-label="Interactive 3D portfolio graph"
      onPointerDown={pointerDown}
      onPointerMove={(e) => {
        if (!drag.current) return;
        camera.current.yaw += (e.clientX - drag.current.x) * 0.005;
        camera.current.pitch = Math.max(
          -0.7,
          Math.min(
            0.7,
            camera.current.pitch + (e.clientY - drag.current.y) * 0.004,
          ),
        );
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <canvas ref={canvas} aria-hidden="true" />
      <div
        className="graph-nodes"
        role="group"
        aria-label="Organizations, projects, and technologies"
      >
        {nodes.map((n) => (
          <button
            key={n.id}
            ref={(el) =>
              el ? buttons.current.set(n.id, el) : buttons.current.delete(n.id)
            }
            data-node-id={n.id}
            className={`graph-node ${n.kind} ${n.logo ? "has-logo" : ""}`}
            style={{
              "--node-color": categories[n.category]?.color || "#87e0c0",
            }}
            aria-label={n.title}
            onPointerEnter={() => setHovered(n.id)}
            onFocus={() => {
              setHovered(n.id);
            }}
            onBlur={() => setHovered(null)}
            onClick={() => {
              onSelect(n.id);
            }}
          >
            <span className="node-orb">
              {n.kind === "person" ? (
                <img src="/images/me.jpeg" alt="" draggable="false" />
              ) : n.logo ? (
                <img src={n.logo} alt="" draggable="false" />
              ) : n.kind === "skill" ? (
                <span />
              ) : (
                <span className="node-glyph">{n.video ? "▷" : "◇"}</span>
              )}
            </span>
            <span className="node-label">{n.title}</span>
            <span className="node-subtitle">{n.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
