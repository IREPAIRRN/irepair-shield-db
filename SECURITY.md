# Security policy

*Italiano: per segnalare un problema di sicurezza usa il pulsante **Report a vulnerability** nella scheda
Security di questo repository, oppure scrivi a rimini@i-repair.it. Non aprire una issue pubblica.*

## How to report

Please report security problems **privately**, not in a public issue:

- **Preferred:** the **Report a vulnerability** button in the **Security** tab of this repository
  (GitHub private vulnerability reporting). Only the maintainer can read the report.
- **Or:** e-mail rimini@i-repair.it with `SECURITY` in the subject.

Please include what you found, the files or commit involved, and the steps to reproduce it.

## What counts as a security problem

- anything that could make the app accept a database file that was not signed by iRepair Rimini
  (signatures, `manifest.json`, `public-keys.json`, the verification in `verify.js`);
- a signing key, publish token or other credential that appears to be exposed;
- a flaw in `verify.js` that makes it report "OK" for a file that does not match its signature or its SHA-256.

## What is not a security problem

A legitimate app or address flagged by an entry (a false positive), or a known threat that is missing, is a
data issue: write to rimini@i-repair.it as described in the README under *Reporting a false positive*.

## How the data is protected

Every file is signed with an Ed25519 key that is never published. The app only uses a file whose detached
signature (`<file>.sig`) verifies against the public key built into the app, so a file signed with any other
key is ignored and the copy shipped with the app keeps working. You can check the files yourself with
`node verify.js` (see the README).
