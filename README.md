# Voicetastic — site

Marketing + browser-flasher site for the [Voicetastic](https://github.com/voicetastic)
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
GitHub Pages on every push to `main`. `.gitlab-ci.yml` is kept as a
parallel deploy path for the GitLab mirror — both pipelines run the
same `npm install && npm run build` and pick up `dist/`.

The GitLab Pages job additionally copies `dist/` into `public/` because
that path is hard-coded into GitLab's Pages contract; GitHub Pages
deploys `dist/` directly via `actions/upload-pages-artifact`. Anything
that must ship with the site (firmware binaries, favicon, etc.) lives
under `public/` in source and gets copied into `dist/` during
`astro build`.

## Browser flasher

The `/flash` page embeds `<esp-web-install-button>` pointing at
`/firmware/manifest.json`. Web Serial requires HTTPS and Chromium-based
browsers (Chrome, Edge, Opera). See [`public/firmware/README.md`](public/firmware/README.md)
for how to drop in real firmware images.

## License

GPL-3.0-or-later, matching the rest of the Voicetastic project.
