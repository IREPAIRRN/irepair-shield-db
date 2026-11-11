# iRepair Shield — Android anti-spyware rules

This page is generated from the app’s code: these are the rules that run on the shop PC when an Android phone is analysed. It is not a list of “bad” apps: these are behaviours. A flagged app is a question to ask the customer, not a verdict.

## How to read it

- Every app installed by the user gets points for each **signal** it shows. The total decides the level.
- Some **combinations** of signals are typical of a family of threats: when a combination is present the score cannot go below its minimum, whatever the total.
- Apps that came from a trusted store, apps preinstalled by the maker and the maker’s own apps are not treated as “installed outside the store”.

## Levels

| Level | from points |
|---|---|
| CRITICAL | 80 |
| HIGH | 60 |
| MEDIUM | 35 |
| LOW | 15 |

## Signals

| Signal | Points |
|---|---|
| Accessibility service enabled (can read the screen and perform taps) | 25 |
| Device-admin active (resists uninstall, can lock/wipe) | 20 |
| No launcher icon (hidden from the app drawer) | 20 |
| Is the phone's keyboard and was installed outside the store: it sees everything typed | 20 |
| Set as always-on VPN: all internet traffic passes through it | 15 |
| Is the autofill service (passwords) and was installed outside the store | 15 |
| Can act as a contactless (NFC) payment card | 15 |
| Deceptive name (fake player/cleaner/adult app) on a sideloaded app | 12 |
| Notification access (can read incoming messages and codes) | 12 |
| Installed outside the store in the last 7 days, already with special access | 12 |
| SMS permission granted | 12 |
| Sent 5 MB or more in the background (nothing on screen) since the last restart | 10 |
| Google Play Protect is switched off on this phone | 10 |
| Installed outside a trusted app store | 10 |
| Receives incoming / outgoing SMS events | 10 |
| Among the biggest battery users (10% or more of all apps, since the last full charge) | 8 |
| Call-log permission granted | 8 |
| Read the clipboard in the last 7 days (copied passwords, codes, IBANs) | 8 |
| Can draw over other apps | 8 |
| System-like package name (Android / Google / phone maker) on an app installed outside the store | 8 |
| Background location granted | 6 |
| Monitors calls (phone state / outgoing calls) | 6 |
| Precise location granted | 6 |
| Microphone/camera permission granted | 6 |
| Sent 1 MB or more in the background at night (00-06) | 6 |
| Can install other apps | 5 |

## Combinations

| Combination | Minimum score | Minimum level |
|---|---|---|
| Hidden + accessibility + device-admin: classic stalkerware pattern | 90 | CRITICAL |
| No icon, installed outside the store, and used the microphone or camera in the background in the last 7 days | 85 | CRITICAL |
| Possible NFC card cloning: acts as a contactless card, installed outside a store, and can read the screen or hide. Do NOT tap a bank card on this phone; block the cards with the bank | 85 | CRITICAL |
| Sideloaded app with device-admin and screen overlay: screen-locker ransomware pattern (locks the phone and demands payment; often spread via WhatsApp/Facebook links) | 85 | CRITICAL |
| Device admin + accessibility outside the store: can read and operate the phone and resists removal | 80 | CRITICAL |
| Hidden app with accessibility and SMS/location/mic access: spyware pattern | 80 | CRITICAL |
| Accessibility + overlay + SMS from a sideloaded app: banking-trojan pattern | 75 | HIGH |
| No icon, installed outside the store, and sends data in the background: what a spy app does with what it collects | 75 | HIGH |
| Play Protect off + an app from outside the store with control: the usual stalkerware install recipe | 75 | HIGH |
| Poses as a system app: system-like name, installed outside the store, with a sensitive capability or no icon | 75 | HIGH |
| Reads the clipboard and can act unseen (accessibility or no icon): copied passwords and OTP codes at risk | 70 | HIGH |
| Hidden sideloaded app holding device-admin | 70 | HIGH |
| Possible keylogger: keyboard or password autofill installed outside the store | 70 | HIGH |
| Intercepts SMS or calls with no icon: one-time codes and calls seen invisibly | 70 | HIGH |
| No icon, installed outside the store, and among the biggest battery users of the phone | 65 | HIGH |
| Accessibility + notification access outside the store: sees the screen and every message preview | 65 | HIGH |
| Recently installed outside the store and already controls the phone (accessibility, admin or notifications): ask the customer who installed it and when | 65 | HIGH |
| Sideloaded app drawing overlays with silent-install or hidden icon: ad-fraud/fleeceware pattern (fake player, cleaner/booster, cracked-game bundle) | 60 | HIGH |
| Notification access + SMS from a sideloaded app: one-time-code stealer pattern | 60 | HIGH |
| Always-on VPN installed outside the store: traffic can be read or redirected; ask the customer if they chose it | 45 | MEDIUM |
| Disguised app: its name imitates a Google / system app (or mixes Latin and Cyrillic letters) and it was installed outside a store | from the app name | — |

## Limits

- The rules see what Android declares over USB (permissions, active services, who installed the app, recent use). They do not read app contents or messages.
- Spyware that exploits a system flaw without installing a visible app leaves none of these signs: those cases need the signed indicators and a forensic analysis.
- A false positive is possible. If a rule is wrong about a legitimate app, write to us: we fix it and the fix reaches everyone with the update.

_Generated from electron/behavioralScan.js._
