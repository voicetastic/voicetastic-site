# Firmware flashing

There is intentionally **no manifest or binary in this folder.** The `/flash`
page ([src/pages/flash.astro](../../src/pages/flash.astro)) builds the ESP Web
Tools manifest **at runtime** so the site never needs rebuilding when new
firmware ships.

## How it works

On page load, a script:

1. Calls the GitHub Releases API to find the latest published release:
   ```
   GET https://api.github.com/repos/voicetastic/firmware/releases/latest
   ```
2. Finds the asset named `voicetastic-tdeck-factory.bin` and reads its
   `browser_download_url`:
   ```
   https://github.com/voicetastic/firmware/releases/download/<tag>/voicetastic-tdeck-factory.bin
   ```
3. Assembles an ESP Web Tools manifest in memory (Blob URL) pointing at that
   URL and hands it to `<esp-web-install-button>`.

## CORS

Both `api.github.com` and the redirect target (`objects.githubusercontent.com`,
where the binary actually lives) return `Access-Control-Allow-Origin: *`, so
the API fetch + ESP Web Tools' binary fetch both succeed cross-origin without
proxying. The single 302 hop the `browser_download_url` makes is transparent
to the browser.

## Which binary

`voicetastic-tdeck-factory.bin` — the **merged** image (bootloader +
partitions + app at offset `0x0`), built by the firmware repo's CI on every
`vX.Y.Z` tag. The sibling `voicetastic-tdeck.bin` is the OTA/update image at
`0x10000` — not for from-scratch flashing.

## Caveats

- The firmware repo must stay **public** (anonymous API + download).
- "latest" = the release flagged as latest by GitHub (typically the
  most recently published non-prerelease).
- If the repo slug or asset filename changes, update the constants at the
  top of `flash.astro`.

See https://esphome.github.io/esp-web-tools/ for the manifest spec.
