#!/usr/bin/env node
// Verifies the signed iRepair Shield threat-intel files in this folder. No dependencies (Node 18+).
//
//   node verify.js                      verify the three files against public-keys.json in this folder
//   node verify.js --key <base64>       verify against a key you obtained elsewhere (e.g. from the app itself)
//   node verify.js --dir path/to/copy   verify a downloaded copy
//
// What "OK" means: every .json file is byte-for-byte what was signed with the iRepair Shield database key
// (Ed25519, detached signature in the .sig file next to it), and matches the SHA-256 recorded in manifest.json.
// What it does not mean: public-keys.json is published in the same repository as the data, so it only protects
// against damage in transit. The copy of the key that matters is the one built into the app; pass it with --key
// when you want a check that does not rely on this repository.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FILES = ['malware-signatures.json', 'malware-hashes-core.json', 'malware-iocs.json'];
const SPKI_ED25519_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

function publicKey(b64) {
  const raw = Buffer.from(String(b64 || '').trim(), 'base64');
  if (raw.length !== 32) throw new Error('public key must be 32 bytes, base64-encoded');
  return crypto.createPublicKey({ key: Buffer.concat([SPKI_ED25519_PREFIX, raw]), format: 'der', type: 'spki' });
}

function verifyDir(dir, keyOverride) {
  const read = (f) => fs.readFileSync(path.join(dir, f));
  let keys = {}, manifest = null;
  if (!keyOverride) { try { keys = JSON.parse(read('public-keys.json').toString('utf8')); } catch (e) { throw new Error('public-keys.json not found or unreadable — pass --key <base64>'); } }
  try { manifest = JSON.parse(read('manifest.json').toString('utf8')); } catch (e) { /* optional */ }
  const results = [];
  for (const f of FILES) {
    const r = { file: f, ok: false, detail: '' };
    try {
      const raw = read(f);
      const sig = Buffer.from(read(`${f}.sig`).toString('utf8').trim(), 'base64');
      const key = publicKey(keyOverride || keys[f]);
      if (sig.length !== 64 || !crypto.verify(null, raw, key, sig)) r.detail = 'signature does NOT verify';
      else {
        const sha = crypto.createHash('sha256').update(raw).digest('hex');
        const want = manifest && manifest.files && manifest.files[f] ? manifest.files[f].sha256 : null;
        if (want && want !== sha) r.detail = 'signature verifies, but SHA-256 differs from manifest.json';
        else { const j = JSON.parse(raw.toString('utf8')); r.ok = true; r.detail = `v${j.version} (${j.updated}), sha256 ${sha.slice(0, 16)}…`; }
      }
    } catch (e) { r.detail = e.message; }
    results.push(r);
  }
  return results;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
  let results;
  try { results = verifyDir(path.resolve(opt('--dir') || __dirname), opt('--key')); } catch (e) { console.error(`verify: ${e.message}`); process.exit(2); }
  for (const r of results) console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${r.file} — ${r.detail}`);
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `\n${bad} file(s) FAILED verification. Do not use them.` : '\nAll files verified.');
  process.exit(bad ? 1 : 0);
}

module.exports = { verifyDir, FILES };
