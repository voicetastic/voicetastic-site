# Firmware binaries

Drop signed firmware binaries here. The ESP Web Tools manifest at
`manifest.json` references them by path.

## Expected files

- `voicetastic-tdeck.bin` — merged firmware image for LilyGo T-Deck (ESP32-S3),
  starting at offset `0x0`. Build it with:

  ```bash
  esptool.py --chip esp32s3 merge_bin \
    -o voicetastic-tdeck.bin \
    --flash_mode dio --flash_freq 80m --flash_size 16MB \
    0x0      bootloader.bin \
    0x8000   partitions.bin \
    0x10000  voicetastic.bin
  ```

  Adjust offsets and partition layout to match your build.

## Updating the manifest

When you ship a new release, bump `version` in `manifest.json` and replace
the binary. ESP Web Tools will prompt users to re-flash if the installed
version differs from the manifest.

See https://esphome.github.io/esp-web-tools/ for the full manifest spec
(multi-chip builds, OTA-only updates, etc.).
