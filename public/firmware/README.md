# Firmware flashing

`manifest.json` is the ESP Web Tools manifest that the `/flash` page loads.
It points **directly at the live GitLab release permalink** for the latest
firmware — so the site does **not** need rebuilding when new firmware ships.

## How it works

The manifest's part `path` is the always-latest factory image:

```
https://git.cha-sam.re/voicetastic/firmware/-/releases/permalink/latest/downloads/voicetastic-tdeck-factory.bin
```

- `voicetastic-tdeck-factory.bin` is the **merged** image (bootloader +
  partitions + app at offset `0x0`), built by the firmware repo's CI
  `publish-release` job on every `vX.Y.Z` tag. It's the right image for a
  from-scratch browser flash. (The sibling `voicetastic-tdeck.bin` is the
  OTA/update image at `0x10000` — do NOT point the manifest at that one.)
- The browser fetches it cross-origin at flash time. GitLab serves release
  downloads with `Access-Control-Allow-Origin: *`, and it's a simple GET, so
  CORS is satisfied without keeping a same-origin copy here.
- `permalink/latest` always resolves to the newest release, so a new firmware
  tag is picked up live — no site rebuild, no file to drop in this folder.

## Going live

The permalink 404s until the first firmware release exists. To activate:

1. Merge the firmware CI MR (`ci/setup-pipeline`).
2. Cut a firmware tag (`vX.Y.Z`) so the tag pipeline builds + publishes a
   release with the `voicetastic-tdeck-factory.bin` asset.
3. The `/flash` button works immediately and stays current for all future
   releases.

## Caveats

- The release must include the `voicetastic-tdeck-factory.bin` asset (the CI
  emits it — confirmed in build artifacts).
- `latest` = newest release by `released_at`.
- The firmware project must stay public (anonymous browser fetch).
- `manifest.json` `version` is cosmetic here — ESP Web Tools only uses it for
  the "already installed?" prompt; the actual binary is always live-latest.

See https://esphome.github.io/esp-web-tools/ for the full manifest spec.
