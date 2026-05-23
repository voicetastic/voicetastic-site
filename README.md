# Voicetastic — site

Marketing + browser-flasher site for the [Voicetastic](https://git.cha-sam.re/voicetastic)
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

Auto-deploys to GitLab Pages on every push to `main` via `.gitlab-ci.yml`.

The build artifact is copied into `public/` (GitLab Pages requirement) — note
that this overwrites the source `public/` directory at deploy time. Anything
that must ship with the site (firmware binaries, favicon, etc.) lives under
`public/` in source and gets copied into `dist/` during `astro build`.

## Browser flasher

The `/flash` page embeds `<esp-web-install-button>` pointing at
`/firmware/manifest.json`. Web Serial requires HTTPS and Chromium-based
browsers (Chrome, Edge, Opera). See [`public/firmware/README.md`](public/firmware/README.md)
for how to drop in real firmware images.

## License

GPL-3.0-or-later, matching the rest of the Voicetastic project.
