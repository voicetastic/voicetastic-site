# Voicetastic — site

Project overview + browser-flasher site for the [Voicetastic](https://github.com/voicetastic)
project. Built with [Astro](https://astro.build/) and
[ESP Web Tools](https://esphome.github.io/esp-web-tools/).

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site
```

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to
GitHub Pages on every push to `main`. If you also keep a GitLab pull
mirror of this repo, the in-tree `.gitlab-ci.yml` runs the same
`npm install && npm run build` there so the mirror's project view shows
green pipelines too — GitHub Pages remains the canonical deploy target.

Note on `dist/` placement: GitHub Pages publishes `dist/` directly via
`actions/upload-pages-artifact`. GitLab Pages contracts on `public/`, so
its job additionally copies `dist/` → `public/`. Anything that must ship
with the site (firmware binaries, favicon, etc.) lives under `public/`
in source and gets copied into `dist/` during `astro build`.

## Browser flasher

The `/flash` page embeds `<esp-web-install-button>` pointing at
`/firmware/manifest.json`. Web Serial requires HTTPS and Chromium-based
browsers (Chrome, Edge, Opera). See [`public/firmware/README.md`](public/firmware/README.md)
for how to drop in real firmware images.

## License

GPL-3.0-or-later, matching the rest of the Voicetastic project.
