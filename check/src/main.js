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
    eyebrow: 'iRepair Shield Check · gratuito', title: 'Collega il tuo Android.', titleAccent: 'Scopri se ti spiano.',
    bFree: 'Gratis, nel browser', bRead: 'Solo lettura', bLocal: 'Nessun dato inviato',
    lead: 'Un cavo USB, un clic: le app del telefono confrontate con stalkerware e spyware conosciuti.',
    sub: 'Usa il <strong>database firmato di iRepair Shield</strong>, aggiornato ogni giorno. Il controllo gira sul tuo computer: dal telefono non esce nulla.',
    start: 'Controlla il telefono', demo: 'Prova con un telefono di esempio',
    c1: 'Non rimuove niente', c2: 'Niente account', c3: 'Firma del database verificata',
    live: 'Database di oggi', s1: 'Collega', s2: 'Leggi', s3: 'Confronta',
    lChecks: 'controllo', k1: 'App installate', k2: 'Firme stalkerware', k3: 'Indicatori spyware', k4: 'Firma database',
    gIdle: 'IN ATTESA', gScan: 'LETTURA', gOk: 'PULITO', gBad: 'TROVATE', gBad1: 'TROVATA',
    rPhone: 'Telefono', rApps: 'App controllate', rRes: 'Risultato',
    nSig: 'firme', nIoc: 'indicatori', nHash: 'hash APK', nDom: 'domini',
    dSig: 'firme stalkerware', dIoc: 'indicatori spyware', dHash: 'hash di APK maligni', dDaily: 'Ogni giorno', dDailyL: 'ricostruito e firmato',
    safeEye: 'Sicurezza', safeTitle: 'Prima di iniziare',
    safe1: 'Se temi che qualcuno ti controlli, usa un computer che quella persona non usa.',
    safe2: 'Questa pagina legge soltanto. Non installa, non rimuove e non cambia niente sul telefono.',
    safe3: 'Togliere un\'app spia può avvisare chi l\'ha installata e cancella le prove. Prima parla con un centro antiviolenza (1522) o con un tecnico.',
    howLabel: '3 passaggi', how: 'Come si fa',
    how1: 'Sul telefono: Impostazioni › Informazioni sul telefono › tocca 7 volte «Numero build».',
    how2: 'Impostazioni › Opzioni sviluppatore › attiva «Debug USB».',
    how3: 'Collega il cavo, premi «Controlla il telefono» e sul telefono tocca «Consenti».',
    noUsb: 'Questo browser non può parlare con il telefono via USB. Apri la pagina con Chrome o Edge su un computer.',
    stIdle: '> pronto. collega il telefono e premi il pulsante', stDb: '> scarico e verifico il database…', stPick: '> scegli il telefono nella finestra del browser…',
    stAuth: '> sul telefono tocca «Consenti» (debug USB)…', stRead: '> leggo l\'elenco delle app…', stDone: '> controllo completato',
    clean: 'Nessuna app spia conosciuta', cleanShort: 'Nessuna corrispondenza',
    cleanNote: 'Controllate {n} app. Un risultato pulito riduce il sospetto, non esclude uno spyware: una lista conosce solo ciò che è già stato pubblicato.',
    found: '{n} app corrispondono a spyware conosciuto', found1: '1 app corrisponde a spyware conosciuto', foundShort: '{n} da controllare',
    foundNote: 'È un indicatore, non una diagnosi. Non rimuovere nulla adesso.',
    next: 'Cosa fare adesso',
    next1: 'Non cancellare l\'app e non ripristinare il telefono: perderesti le prove.',
    next2: 'Se sei in pericolo chiama il 112. Per un aiuto riservato: 1522 (antiviolenza e stalking, gratuito, 24 ore).',
    next3: 'Per un\'analisi completa con rapporto serve un tecnico: iRepair Shield controlla anche le app non ancora in lista, gli iPhone e il backup.',
    proTitle: 'Serve di più di una lista?', proText: 'iRepair Shield giudica anche le app che nessuno ha ancora segnalato, controlla gli iPhone e il backup, e chiude con un rapporto PDF.',
    more: 'Scopri iRepair Shield', again: 'Controlla un altro telefono', verified: 'firma verificata', unverified: 'firma non verificabile qui',
    dbBad: '> firma del database non valida: controllo annullato',
    err: 'Non sono riuscito a leggere il telefono', errHint: 'Controlla che il debug USB sia attivo e che nessun altro programma stia usando ADB (chiudi Android Studio, iRepair Shield, «adb»), poi riprova.',
    only: 'Solo Android. Gratuito. Fatto da iRepair Rimini, Apple Independent Repair Provider.',
    cat: { Stalkerware: 'Stalkerware', 'Mercenary spyware': 'Spyware mercenario', Trojan: 'Trojan', Watchware: 'App di controllo', Spyware: 'Spyware' },
  },
  en: {
    eyebrow: 'iRepair Shield Check · free', title: 'Plug in your Android.', titleAccent: 'See if someone is spying.',
    bFree: 'Free, in the browser', bRead: 'Read-only', bLocal: 'No data sent',
    lead: 'One USB cable, one click: the phone\'s apps checked against known stalkerware and spyware.',
    sub: 'Uses the <strong>signed iRepair Shield database</strong>, rebuilt every day. The check runs on your computer; nothing leaves the phone.',
    start: 'Check the phone', demo: 'Try with a sample phone',
    c1: 'Removes nothing', c2: 'No account', c3: 'Database signature verified',
    live: 'Today\'s database', s1: 'Plug in', s2: 'Read', s3: 'Compare',
    lChecks: 'check', k1: 'Installed apps', k2: 'Stalkerware signatures', k3: 'Spyware indicators', k4: 'Database signature',
    gIdle: 'WAITING', gScan: 'READING', gOk: 'CLEAN', gBad: 'FOUND', gBad1: 'FOUND',
    rPhone: 'Phone', rApps: 'Apps checked', rRes: 'Result',
    nSig: 'signatures', nIoc: 'indicators', nHash: 'APK hashes', nDom: 'domains',
    dSig: 'stalkerware signatures', dIoc: 'spyware indicators', dHash: 'malicious APK hashes', dDaily: 'Every day', dDailyL: 'rebuilt and signed',
    safeEye: 'Safety', safeTitle: 'Before you start',
    safe1: 'If you fear someone is watching you, use a computer that person does not use.',
    safe2: 'This page only reads. It never installs, removes or changes anything on the phone.',
    safe3: 'Removing a spying app can alert whoever installed it and destroys the evidence. Talk to a support service or a technician first.',
    howLabel: '3 steps', how: 'How to do it',
    how1: 'On the phone: Settings › About phone › tap "Build number" 7 times.',
    how2: 'Settings › Developer options › turn on "USB debugging".',
    how3: 'Plug in the cable, press "Check the phone" and tap "Allow" on the phone.',
    noUsb: 'This browser cannot talk to a phone over USB. Open the page in Chrome or Edge on a computer.',
    stIdle: '> ready. plug in the phone and press the button', stDb: '> downloading and verifying the database…', stPick: '> pick the phone in the browser window…',
    stAuth: '> tap "Allow" on the phone (USB debugging)…', stRead: '> reading the list of apps…', stDone: '> check complete',
    clean: 'No known spying app found', cleanShort: 'No match',
    cleanNote: '{n} apps checked. A clean result lowers suspicion; it does not rule out spyware: a list only knows what has already been published.',
    found: '{n} apps match known spyware', found1: '1 app matches known spyware', foundShort: '{n} to check',
    foundNote: 'This is an indicator, not a diagnosis. Do not remove anything now.',
    next: 'What to do now',
    next1: 'Do not delete the app and do not reset the phone: you would lose the evidence.',
    next2: 'If you are in danger call your local emergency number. For confidential help contact a domestic-violence support service.',
    next3: 'A full analysis with a report needs a technician: iRepair Shield also checks apps not yet on any list, iPhones and backups.',
    proTitle: 'Need more than a list?', proText: 'iRepair Shield also judges apps nobody has reported yet, checks iPhones and backups, and ends with a PDF report.',
    more: 'See iRepair Shield', again: 'Check another phone', verified: 'signature verified', unverified: 'signature not verifiable here',
    dbBad: '> database signature not valid: check cancelled',
    err: 'Could not read the phone', errHint: 'Check that USB debugging is on and that no other program is using ADB (close Android Studio, iRepair Shield, "adb"), then try again.',
    only: 'Android only. Free. Made by iRepair Rimini, Apple Independent Repair Provider.',
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
const fmt = (n) => (typeof n === 'number' ? n.toLocaleString(lang === 'it' ? 'it-IT' : 'en-GB') : '—');
let counts = null, state = 'idle', last = null;
function setState(s, gradeText, gradeSmall) {
  state = s; $('console').dataset.state = s;
  const g = $('grade'); g.replaceChildren(document.createTextNode(gradeText), el('small', null, gradeSmall));
  g.style.animation = 'none'; void g.offsetWidth; g.style.animation = '';
}
function steps(n) { ['st1', 'st2', 'st3'].forEach((id, i) => { $(id).className = 'c-step' + (i < n ? ' done' : i === n ? ' on' : ''); }); }
function paintCounts() {
  if (!counts) return;
  $('nSig').innerHTML = `${fmt(counts.sig)} <i>${t('nSig')}</i>`; $('nIoc').innerHTML = `${fmt(counts.ioc)} <i>${t('nIoc')}</i>`;
  $('nHash').innerHTML = `${fmt(counts.hash)} <i>${t('nHash')}</i>`; $('nDom').innerHTML = `${fmt(counts.dom)} <i>${t('nDom')}</i>`;
  $('bSig').textContent = fmt(counts.sig); $('bIoc').textContent = fmt(counts.ioc); $('bHash').textContent = fmt(counts.hash);
  $('dbVer').textContent = 'DB ' + counts.version;
}
function paint() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach((e) => { if (e.hasAttribute('data-html')) e.innerHTML = t(e.dataset.t); else e.textContent = t(e.dataset.t); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  $('nousb').hidden = !!navigator.usb; $('start').disabled = !navigator.usb;
  paintCounts();
  if (last) showResult(...last); else if (state === 'idle') { $('status').textContent = t('stIdle'); setState('idle', '?', t('gIdle')); }
}
function showResult(phone, db, hits) {
  last = [phone, db, hits]; steps(3);
  const bad = hits.length > 0;
  setState(bad ? 'bad' : 'ok', bad ? String(hits.length) : '✓', bad ? (hits.length === 1 ? t('gBad1') : t('gBad')) : t('gOk'));
  $('vPhone').textContent = phone.label; $('vApps').textContent = fmt(phone.packages.length);
  $('vDb').replaceChildren(document.createTextNode(db.version + ' · '), el('span', db.verified ? 'ck' : null, db.verified ? '✓ ' + t('verified') : t('unverified')));
  $('vRes').textContent = bad ? t('foundShort', { n: hits.length }) : t('cleanShort');
  $('vRes').style.color = bad ? 'var(--red)' : 'var(--ok)';
  $('status').textContent = t('stDone');
  const box = $('result'); box.replaceChildren(); box.hidden = false;
  const main = el('div', 'panel ' + (bad ? 'bad' : 'ok'));
  main.append(el('h2', null, bad ? (hits.length === 1 ? t('found1') : t('found', { n: hits.length })) : t('clean')));
  main.append(el('p', null, bad ? t('foundNote') : t('cleanNote', { n: phone.packages.length })));
  if (bad) {
    const ul = el('ul', 'hits');
    for (const h of hits) { const li = el('li'); li.append(el('strong', null, h.name), el('span', 'tag', T[lang].cat[h.category] || h.category), el('code', null, h.pkg)); ul.append(li); }
    main.append(ul);
  }
  const side = el('div', 'panel');
  if (bad) { side.append(el('h3', null, t('next'))); const ol = el('ol', 'next'); ['next1', 'next2', 'next3'].forEach((k) => ol.append(el('li', null, t(k)))); side.append(ol); }
  else { side.append(el('h3', null, t('proTitle')), el('p', null, t('proText'))); }
  const a = el('a', 'cta2', t('more')); a.href = SHIELD_URL; a.rel = 'noopener';
  const again = el('button', 'link', t('again')); again.type = 'button';
  again.onclick = () => { last = null; box.hidden = true; steps(0); ['vPhone', 'vApps', 'vDb', 'vRes'].forEach((id) => { $(id).textContent = '—'; $(id).style.color = ''; }); state = 'idle'; paint(); scrollTo({ top: 0, behavior: 'smooth' }); };
  side.append(a, again);
  box.append(main, side);
  if (innerWidth < 900) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function go(demo) {
  const status = (s) => { $('status').textContent = s; };
  last = null; $('result').hidden = true; $('start').disabled = true; $('demo').disabled = true;
  setState('scan', '…', t('gScan')); steps(0);
  try {
    status(t('stDb'));
    const db = await loadDb();
    if (!demo) steps(0);
    const phone = demo ? DEMO : await readPhone((s) => { status(s); if (s === t('stRead')) steps(1); });
    steps(2); $('vPhone').textContent = phone.label;
    await new Promise((r) => setTimeout(r, 450));
    showResult(phone, db, match(phone.packages, db.known));
  } catch (e) {
    const m = String((e && e.message) || e);
    steps(0); setState('idle', '?', t('gIdle'));
    if (m === 'cancelled' || /No device selected/i.test(m)) status(t('stIdle'));
    else if (m === 'bad-signature') status(t('dbBad'));
    else if (m === 'no-usb') status(t('noUsb'));
    else status(`> ${t('err')}: ${m}. ${t('errHint')}`);
  } finally { $('start').disabled = !navigator.usb; $('demo').disabled = false; }
}
async function loadCounts() {
  try {
    const m = await fetch(DB_BASE + 'manifest.json', { cache: 'no-cache' }).then((r) => r.json());
    counts = { sig: m.entries.signatures, ioc: m.entries.iocs, hash: m.entries.hashes, dom: (m.ioc_breakdown || {}).domains, version: String(m.files['malware-signatures.json'].version) };
    paintCounts();
  } catch { /* counts stay «—» */ }
}
if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; paint(); }));
  $('start').addEventListener('click', () => go(false));
  $('demo').addEventListener('click', () => go(true));
  paint(); loadCounts();
  if (new URLSearchParams(location.search).has('demo')) go(true);
}
