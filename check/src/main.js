// iRepair Shield — free Android check in the browser.
// READ-ONLY by design: the only commands ever sent to the phone are in READ_COMMANDS below. Nothing is installed,
// removed or changed, and nothing read from the phone leaves this page (no upload, no analytics).
import { Adb, AdbDaemonTransport } from '@yume-chan/adb';
import { AdbDaemonWebUsbDeviceManager } from '@yume-chan/adb-daemon-webusb';
import AdbWebCredentialStore from '@yume-chan/adb-credential-web';

const READ_COMMANDS = Object.freeze({
  packages: 'pm list packages',
  model: 'getprop ro.product.model',
  brand: 'getprop ro.product.brand',
  android: 'getprop ro.build.version.release',
});
const DB_BASE = '../';
const DB_KEY_B64 = 'gUHODJCm2LX6y+BzV5p8wrOwvIxCeX4dcWnmPFmq0jU=';   // Ed25519, same key as public-keys.json / the app
const SHIELD_URL = 'https://i-repair.it/irepair-shield/?utm_source=shield-check&utm_medium=tool';

const T = {
  it: {
    title: 'Controlla se sul tuo Android c\'è uno stalkerware conosciuto',
    lead: 'Collega il telefono con il cavo USB e premi il pulsante. Il controllo avviene in questa pagina, sul tuo computer: dal telefono non esce nulla.',
    safeTitle: 'Prima di iniziare',
    safe1: 'Se temi che qualcuno ti controlli, usa un computer che quella persona non usa.',
    safe2: 'Questa pagina legge soltanto. Non installa, non rimuove e non cambia niente sul telefono.',
    safe3: 'Togliere un\'app spia può avvisare chi l\'ha installata e cancella le prove. Prima parla con un centro antiviolenza (1522) o con un tecnico.',
    how: 'Come si fa',
    how1: 'Sul telefono: Impostazioni › Informazioni sul telefono › tocca 7 volte «Numero build».',
    how2: 'Impostazioni › Opzioni sviluppatore › attiva «Debug USB».',
    how3: 'Collega il cavo, premi «Controlla il telefono» e sul telefono tocca «Consenti».',
    start: 'Controlla il telefono', demo: 'Prova con un telefono di esempio',
    noUsb: 'Questo browser non può parlare con il telefono via USB. Apri la pagina con Chrome o Edge su un computer.',
    stDb: 'Scarico e verifico il database…', stPick: 'Scegli il telefono nella finestra del browser…',
    stAuth: 'Sul telefono tocca «Consenti» (debug USB)…', stRead: 'Leggo l\'elenco delle app…', stDone: 'Fatto.',
    clean: 'Nessuna app spia conosciuta trovata',
    cleanNote: 'Controllate {n} app. Un risultato pulito riduce il sospetto, non esclude uno spyware: una lista conosce solo ciò che è già stato pubblicato.',
    found: '{n} app corrispondono a spyware conosciuto', found1: '1 app corrisponde a spyware conosciuto',
    foundNote: 'È un indicatore, non una diagnosi. Non rimuovere nulla adesso.',
    next: 'Cosa fare adesso',
    next1: 'Non cancellare l\'app e non ripristinare il telefono: perderesti le prove.',
    next2: 'Se sei in pericolo chiama il 112. Per un aiuto riservato: 1522 (antiviolenza e stalking, gratuito, 24 ore).',
    next3: 'Per un\'analisi completa con rapporto serve un tecnico: iRepair Shield controlla anche le app non ancora in lista, gli iPhone e il backup.',
    more: 'Scopri iRepair Shield', phone: 'Telefono', db: 'Database', verified: 'firma verificata', unverified: 'firma non verificabile in questo browser',
    dbBad: 'La firma del database non è valida: controllo annullato.',
    err: 'Non sono riuscito a leggere il telefono', errHint: 'Controlla che il debug USB sia attivo, che nessun altro programma stia usando ADB (chiudi Android Studio, iRepair Shield, «adb») e riprova.',
    again: 'Controlla un altro telefono', only: 'Solo Android. Gratuito. Fatto da iRepair Rimini con il database firmato di iRepair Shield.',
    cat: { Stalkerware: 'Stalkerware', 'Mercenary spyware': 'Spyware mercenario', Trojan: 'Trojan', Watchware: 'App di controllo', Spyware: 'Spyware' },
  },
  en: {
    title: 'Check your Android for known stalkerware',
    lead: 'Plug the phone in with a USB cable and press the button. The check runs in this page, on your computer: nothing leaves the phone.',
    safeTitle: 'Before you start',
    safe1: 'If you fear someone is watching you, use a computer that person does not use.',
    safe2: 'This page only reads. It never installs, removes or changes anything on the phone.',
    safe3: 'Removing a spying app can alert whoever installed it and destroys the evidence. Talk to a support service or a technician first.',
    how: 'How to do it',
    how1: 'On the phone: Settings › About phone › tap "Build number" 7 times.',
    how2: 'Settings › Developer options › turn on "USB debugging".',
    how3: 'Plug in the cable, press "Check the phone" and tap "Allow" on the phone.',
    start: 'Check the phone', demo: 'Try with a sample phone',
    noUsb: 'This browser cannot talk to a phone over USB. Open the page in Chrome or Edge on a computer.',
    stDb: 'Downloading and verifying the database…', stPick: 'Pick the phone in the browser window…',
    stAuth: 'Tap "Allow" on the phone (USB debugging)…', stRead: 'Reading the list of apps…', stDone: 'Done.',
    clean: 'No known spying app found',
    cleanNote: '{n} apps checked. A clean result lowers suspicion; it does not rule out spyware: a list only knows what has already been published.',
    found: '{n} apps match known spyware', found1: '1 app matches known spyware',
    foundNote: 'This is an indicator, not a diagnosis. Do not remove anything now.',
    next: 'What to do now',
    next1: 'Do not delete the app and do not reset the phone: you would lose the evidence.',
    next2: 'If you are in danger call your local emergency number. For confidential help contact a domestic-violence support service.',
    next3: 'A full analysis with a report needs a technician: iRepair Shield also checks apps not yet on any list, iPhones and backups.',
    more: 'See iRepair Shield', phone: 'Phone', db: 'Database', verified: 'signature verified', unverified: 'signature cannot be verified in this browser',
    dbBad: 'The database signature is not valid: check cancelled.',
    err: 'Could not read the phone', errHint: 'Check that USB debugging is on, that no other program is using ADB (close Android Studio, iRepair Shield, "adb") and try again.',
    again: 'Check another phone', only: 'Android only. Free. Made by iRepair Rimini with the signed iRepair Shield database.',
    cat: {},
  },
};
let lang = (new URLSearchParams(location.search).get('lang') || navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en';
const t = (k, vars) => String(T[lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (_, v) => (vars && v in vars ? vars[v] : ''));
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

// ── database ────────────────────────────────────────────────────────────────
const b64 = (s) => Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0));
async function verified(bytes, sigText) {
  try {
    const key = await crypto.subtle.importKey('raw', b64(DB_KEY_B64), { name: 'Ed25519' }, false, ['verify']);
    return await crypto.subtle.verify({ name: 'Ed25519' }, key, b64(sigText), bytes);
  } catch { return null; }   // null = this browser has no Ed25519: shown as «not verifiable», never as «verified»
}
async function loadFile(name) {
  const [raw, sig] = await Promise.all([
    fetch(DB_BASE + name, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(name + ' ' + r.status); return r.arrayBuffer(); }),
    fetch(DB_BASE + name + '.sig', { cache: 'no-cache' }).then((r) => (r.ok ? r.text() : '')),
  ]);
  const ok = sig ? await verified(raw, sig) : null;
  if (ok === false) throw new Error('bad-signature');
  return { json: JSON.parse(new TextDecoder().decode(raw)), ok };
}
export async function loadDb() {
  const [sigs, iocs] = await Promise.all([loadFile('malware-signatures.json'), loadFile('malware-iocs.json')]);
  const known = new Map();
  for (const [pkg, v] of Object.entries(iocs.json.packages || {})) known.set(pkg.toLowerCase(), { name: v[0], category: v[1] });
  for (const [pkg, v] of Object.entries(sigs.json.signatures || {})) known.set(pkg.toLowerCase(), { name: v.name, category: v.category });
  return { known, version: sigs.json.updated || String(sigs.json.version || ''), verified: sigs.ok === true && iocs.ok === true };
}
export function parsePackages(out) {
  return [...new Set(String(out || '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.startsWith('package:')).map((l) => l.slice(8).trim()).filter(Boolean))];
}
export function match(packages, known) {
  return packages.map((p) => ({ pkg: p, hit: known.get(p.toLowerCase()) })).filter((x) => x.hit).map((x) => ({ pkg: x.pkg, ...x.hit }));
}

// ── phone (read-only) ───────────────────────────────────────────────────────
async function readPhone(status) {
  const manager = AdbDaemonWebUsbDeviceManager.BROWSER;
  if (!manager) throw new Error('no-usb');
  status(t('stPick'));
  const device = await manager.requestDevice();
  if (!device) throw new Error('cancelled');
  status(t('stAuth'));
  const connection = await device.connect();
  const transport = await AdbDaemonTransport.authenticate({ serial: device.serial, connection, credentialStore: new AdbWebCredentialStore('iRepair Shield Check') });
  const adb = new Adb(transport);
  try {
    status(t('stRead'));
    const run = (cmd) => adb.subprocess.noneProtocol.spawnWaitText(cmd).then((s) => String(s).trim());
    const [packages, brand, model, android] = [await run(READ_COMMANDS.packages), await run(READ_COMMANDS.brand), await run(READ_COMMANDS.model), await run(READ_COMMANDS.android)];
    return { packages: parsePackages(packages), label: `${brand} ${model} · Android ${android}`.trim() };
  } finally { try { await adb.close(); } catch { /* already gone */ } }
}
const DEMO = { label: 'Samsung SM-A356B · Android 16 (esempio / sample)', packages: parsePackages(['com.android.chrome', 'com.whatsapp', 'com.samsung.android.dialer', 'a.tck.lvmchi', 'com.google.android.gm'].map((p) => 'package:' + p).join('\n')) };

// ── page ────────────────────────────────────────────────────────────────────
function paint() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach((e) => { e.textContent = t(e.dataset.t); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $('nousb').hidden = !!navigator.usb;
  $('start').disabled = !navigator.usb;
}
function showResult(phone, db, hits) {
  const box = $('result'); box.replaceChildren(); box.hidden = false;
  box.className = 'result ' + (hits.length ? 'bad' : 'ok');
  box.append(el('h2', null, hits.length ? (hits.length === 1 ? t('found1') : t('found', { n: hits.length })) : t('clean')));
  box.append(el('p', 'note', hits.length ? t('foundNote') : t('cleanNote', { n: phone.packages.length })));
  if (hits.length) {
    const ul = el('ul', 'hits');
    for (const h of hits) { const li = el('li'); li.append(el('strong', null, h.name), el('span', 'cat', T[lang].cat[h.category] || h.category), el('code', null, h.pkg)); ul.append(li); }
    box.append(ul, el('h3', null, t('next')));
    const ol = el('ol', 'next'); ['next1', 'next2', 'next3'].forEach((k) => ol.append(el('li', null, t(k)))); box.append(ol);
  }
  const meta = el('p', 'meta', `${t('phone')}: ${phone.label} · ${t('db')}: ${db.version} (${db.verified ? t('verified') : t('unverified')})`);
  const a = el('a', 'cta', t('more')); a.href = SHIELD_URL; a.rel = 'noopener';
  const again = el('button', 'ghost', t('again')); again.type = 'button'; again.onclick = () => { box.hidden = true; $('status').textContent = ''; scrollTo({ top: 0, behavior: 'smooth' }); };
  const row = el('div', 'row'); row.append(a, again);
  box.append(meta, row); box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function go(demo) {
  const status = (s) => { $('status').textContent = s; };
  $('start').disabled = true; $('demo').disabled = true; $('result').hidden = true;
  try {
    status(t('stDb'));
    const db = await loadDb();
    const phone = demo ? DEMO : await readPhone(status);
    status(t('stDone'));
    showResult(phone, db, match(phone.packages, db.known));
  } catch (e) {
    const m = String((e && e.message) || e);
    if (m === 'cancelled' || /No device selected/i.test(m)) status('');
    else if (m === 'bad-signature') status(t('dbBad'));
    else if (m === 'no-usb') status(t('noUsb'));
    else status(`${t('err')}: ${m}. ${t('errHint')}`);
  } finally { $('start').disabled = !navigator.usb; $('demo').disabled = false; }
}
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; paint(); }));
  $('start').addEventListener('click', () => go(false));
  $('demo').addEventListener('click', () => go(true));
  paint();
  if (new URLSearchParams(location.search).has('demo')) go(true);
}
