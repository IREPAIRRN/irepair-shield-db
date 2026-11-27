# iRepair Shield Check

A free, read-only Android check that runs in the browser (Chrome / Edge on a computer, WebUSB).
It reads the list of installed apps over USB and compares it with the signed database in this repository.

- **Read-only.** The only commands sent to the phone are the four in `READ_COMMANDS` at the top of
  [`src/main.js`](src/main.js): `pm list packages` and three `getprop`. Nothing is installed, removed or changed.
- **Nothing is uploaded.** The page downloads the database; nothing read from the phone leaves the browser.
- **The database signature is checked in the page** (Ed25519, same key as `public-keys.json`). A bad signature stops the check.
- A match is an indicator, not a diagnosis. A clean result lowers suspicion; it does not rule out spyware.

`app.js` is `src/main.js` bundled with [Tango ADB](https://github.com/yume-chan/ya-webadb) (MIT):

```
npm i @yume-chan/adb@2.6.4 @yume-chan/adb-daemon-webusb@2.3.2 @yume-chan/adb-credential-web@2.1.0 esbuild
npx esbuild check/src/main.js --bundle --format=esm --minify --target=chrome113 --outfile=check/app.js
```

`?demo` runs the page with a sample phone, without a cable.

After rebuilding `app.js`, update the `?v=` in `index.html` to the first 10 characters of its SHA-256
(`sha256sum check/app.js`), so browsers do not keep the old script.
