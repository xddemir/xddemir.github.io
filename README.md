# Dogukan Demir — React Portfolio

React 19 + Vite, with separate English, German, and Turkish entry pages. Features include project filters, an interactive career explorer, a MASTER XR interaction-method comparison, and the visible Dead Inside trailer.

## Development

Requires Node.js 22.12+ or Node 24 LTS.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`.

```sh
npm run build
npm run preview
```

The build produces `dist/`, including real `index.html`, `de/index.html`, and `tr/index.html` entry points. Language switching preserves the section. No rewrite rules or server runtime are required. The configuration targets the root GitHub Pages site `xddemir.github.io`.

## Editing

- `src/App.jsx`: React components and translated interaction labels in `ui`.
- `src/content.js`: project data, translations, and social URLs.
- `src/styles.css`: responsive design, keyboard focus, reduced-motion handling, and print styling. Uses system fonts without external font requests.
- `public/images/me.jpg`: replace this portrait to update all languages. Adjust `.photo-frame img` for a different crop.
- `public/videos/Dead Inside.mp4`: original trailer.
- `public/images/dead-inside-trailer.png`: trailer preview frame.
- `index.html`, `de/index.html`, `tr/index.html`: translated metadata and React entry points. Update the alternate URLs if the site origin changes.

The former static HTML generator has been replaced by React; no separate translation generation is needed.

## Browser checks

```sh
npx playwright install chromium
npm run build
npm test
```

For installed Microsoft Edge in PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm test
```

Tests cover language entry points, mobile overflow, portrait/video loading, actual playback, project filters, XR method selection, keyboard navigation, language switching, and career-to-project links.

## Publishing

The GitHub Actions workflow builds and uploads `dist/` for GitHub Pages on pushes to `master` or `main`, or through a manual run. Select **GitHub Actions** in repository **Settings → Pages**. Creating the workflow does not publish anything; deployment starts after a push or manual run.

## Inspiration and attribution

[AminDaryan/About-Me](https://github.com/AminDaryan/About-Me) informed the editorial spacing, readable project entries, and interactive explanations. This portfolio uses its own layout, palette, React implementation, content, and assets. No code or artwork was copied from the reference.

DFKI content separates three MASTER XR training scenes from a separate 15-participant study. Dogukan's role is scene development and research engineering, not paper authorship. The comparison figure explains study inputs; it does not perform eye tracking or assert study outcomes. Other professional details come from the supplied CV and user clarifications.
