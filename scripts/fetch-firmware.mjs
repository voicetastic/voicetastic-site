// Build-time firmware fetch for the in-browser flasher.
//
// GitHub release assets are served from `release-assets.githubusercontent.com`
// WITHOUT an `Access-Control-Allow-Origin` header, so a browser can't fetch
// them cross-origin (ESP Web Tools fails with "failed to fetch resource").
// We sidestep CORS entirely by downloading the binaries at build time into
// `public/firmware/` so they ship same-origin with the static site. The
// server-side fetch here has no CORS restriction.
//
// Output:
//   public/firmware/voicetastic-tdeck-factory.bin   (flash @ 0x0, fresh board)
//   public/firmware/voicetastic-tdeck.bin            (OTA / update image)
//   public/firmware/manifest.json                    (ESP Web Tools manifest)
//
// Freshness: the site rebuilds on push to `main`, on manual dispatch, and on
// a `firmware-released` repository_dispatch sent by the firmware release
// workflow, so a new release propagates here automatically.
//
// Failure is non-fatal: if GitHub is unreachable or the release lacks an
// asset, we warn and leave `public/firmware/` without a manifest. The flash
// page detects the missing manifest and shows a friendly message instead of
// breaking the build.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const REPO = 'voicetastic/firmware';
const FACTORY = 'voicetastic-tdeck-factory.bin'; // merged image, flash @ 0x0
const OTA = 'voicetastic-tdeck.bin'; // OTA / update image
const OUT_DIR = 'public/firmware';

const headers = {
  'User-Agent': 'voicetastic-site-build',
  Accept: 'application/vnd.github+json',
};
// Authenticate when a token is available (CI) to dodge the 60-req/hr
// unauthenticated rate limit on shared runner IPs.
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (token) headers.Authorization = `Bearer ${token}`;

function warn(msg) {
  console.warn(`[fetch-firmware] ${msg}`);
}

async function downloadAsset(release, name) {
  const asset = (release.assets || []).find((a) => a.name === name);
  if (!asset) {
    warn(`asset "${name}" not in release ${release.tag_name}`);
    return false;
  }
  const res = await fetch(asset.browser_download_url, {
    headers: { 'User-Agent': headers['User-Agent'] },
    redirect: 'follow',
  });
  if (!res.ok) {
    warn(`download "${name}" failed: HTTP ${res.status}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(OUT_DIR, name), buf);
  console.log(`[fetch-firmware] saved ${name} (${buf.length} bytes)`);
  return true;
}

async function main() {
  let release;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      { headers },
    );
    if (!res.ok) {
      warn(`releases/latest returned HTTP ${res.status}; skipping firmware bundle`);
      return;
    }
    release = await res.json();
  } catch (err) {
    warn(`could not reach GitHub: ${err.message}; skipping firmware bundle`);
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  const haveFactory = await downloadAsset(release, FACTORY);
  // OTA image is best-effort; the flasher only needs the factory image.
  await downloadAsset(release, OTA);

  if (!haveFactory) {
    warn('factory image missing; not writing manifest (flasher will be unavailable)');
    return;
  }

  // ESP Web Tools manifest. `path` is relative to the manifest URL, so it
  // resolves same-origin against /firmware/.
  const manifest = {
    name: 'Voicetastic',
    version: release.tag_name || release.name || 'unknown',
    new_install_prompt_erase: true,
    builds: [
      {
        chipFamily: 'ESP32-S3',
        parts: [{ path: FACTORY, offset: 0 }],
      },
    ],
  };
  await writeFile(
    join(OUT_DIR, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log(`[fetch-firmware] wrote manifest.json for ${manifest.version}`);
}

await main();
