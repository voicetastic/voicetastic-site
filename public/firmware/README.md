# Firmware flashing

The firmware binaries and the ESP Web Tools manifest are **downloaded into
this folder at build time** by [`scripts/fetch-firmware.mjs`](../../scripts/fetch-firmware.mjs)
(run via the `prebuild` npm hook). They are git-ignored - only this README is
tracked. The `/flash` page ([src/pages/flash.astro](../../src/pages/flash.astro))
then loads `/firmware/manifest.json` **same-origin**.

## Why build-time, not runtime

The page used to assemble the manifest in the browser and point ESP Web Tools
straight at a GitHub release asset's `browser_download_url`. That broke:
GitHub now serves release assets from `release-assets.githubusercontent.com`,
which returns **no `Access-Control-Allow-Origin` header**. The browser blocks
the cross-origin binary fetch and ESP Web Tools fails with "failed to fetch
resource".

There's no server-side proxy available (the site is static on GitHub Pages),
so we sidestep CORS entirely: download the binaries server-side at build time
and ship them same-origin with the site. A same-origin fetch needs no CORS
headers.

## How it works

`scripts/fetch-firmware.mjs`:

1. Calls `GET https://api.github.com/repos/voicetastic/firmware/releases/latest`.
2. Downloads `voicetastic-tdeck-factory.bin` (and the OTA `voicetastic-tdeck.bin`)
   into this folder.
3. Writes `manifest.json` (ESP Web Tools format) with the release `version` and
   a **relative** `path` so ESP Web Tools resolves the binary same-origin.

Failure is non-fatal: if GitHub is unreachable or an asset is missing, the
script warns and skips. The flash page detects the absent manifest and shows a
message instead of crashing.

## Freshness

The site rebuilds (and re-fetches the latest firmware) on:

- push to `main`,
- manual `workflow_dispatch`,
- a `firmware-released` `repository_dispatch` sent by the firmware repo's
  release workflow - so a new release propagates here automatically.

## Which binary

`voicetastic-tdeck-factory.bin` - the **merged** image (bootloader +
partitions + app at offset `0x0`), built by the firmware repo's CI on every
`vX.Y.Z` tag. The sibling `voicetastic-tdeck.bin` is the OTA/update image - not
for from-scratch flashing.

## Caveats

- The firmware repo must stay **public** (anonymous API + download), or the
  build needs a token with read access.
- "latest" = the release GitHub flags as latest (most recent published,
  non-prerelease, non-draft).
- If the repo slug or asset filenames change, update the constants at the top
  of `scripts/fetch-firmware.mjs`.

See https://esphome.github.io/esp-web-tools/ for the manifest spec.
