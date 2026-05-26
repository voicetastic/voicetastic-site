# Firmware flashing

There is intentionally **no manifest or binary in this folder.** The `/flash`
page ([src/pages/flash.astro](../../src/pages/flash.astro)) builds the ESP Web
Tools manifest **at runtime** so the site never needs rebuilding when new
firmware ships.

## How it works

On page load, a script:

1. Calls the GitLab API to find the latest released firmware version:
   ```
   GET /api/v4/projects/10/packages?package_type=generic
       &package_name=voicetastic-firmware&order_by=created_at&sort=desc&per_page=1
   ```
2. Builds the **direct** package-registry download URL for the factory image:
   ```
   /api/v4/projects/10/packages/generic/voicetastic-firmware/<version>/voicetastic-tdeck-factory.bin
   ```
3. Assembles an ESP Web Tools manifest in memory (Blob URL) pointing at that
   URL and hands it to `<esp-web-install-button>`.

## Why not the release permalink?

`…/releases/permalink/latest/downloads/voicetastic-tdeck-factory.bin` 302-
redirects through hops (`/releases/permalink/latest` → `/releases/<tag>` →
package API) that carry **no `Access-Control-Allow-Origin` header**. A cross-
origin browser fetch through those redirects fails with "NetworkError". The
**direct** package-registry URL returns `200` with `ACAO: *` and no redirect,
so CORS is satisfied. Resolving the version via the API keeps it always-latest
without baking a version into the site.

## Which binary

`voicetastic-tdeck-factory.bin` — the **merged** image (bootloader +
partitions + app at offset `0x0`), built by the firmware repo's CI on every
`vX.Y.Z` tag. The sibling `voicetastic-tdeck.bin` is the OTA/update image at
`0x10000` — not for from-scratch flashing.

## Caveats

- The firmware project must stay **public** (anonymous API + download).
- "latest" = newest package by `created_at`.
- If the project ID (10) or package name changes, update the constants at the
  bottom of `flash.astro`.

See https://esphome.github.io/esp-web-tools/ for the manifest spec.
