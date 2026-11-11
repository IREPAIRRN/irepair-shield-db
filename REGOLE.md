# iRepair Shield — regole dell’anti-spyware Android

Questa pagina è generata dal codice dell’app: sono le stesse regole che girano sul PC del negozio quando si analizza un telefono Android. Non è un elenco di app «cattive»: sono comportamenti. Un’app segnalata è una domanda da fare al cliente, non una condanna.

## Come si legge

- Ogni app installata dall’utente riceve dei punti per ciascun **segnale** che presenta. La somma decide il livello.
- Alcune **combinazioni** di segnali sono tipiche di una famiglia di minacce: quando una combinazione è presente il punteggio non può scendere sotto il suo minimo, qualunque sia la somma.
- Le app arrivate da uno store attendibile, quelle preinstallate dal produttore e quelle del produttore stesso non sono trattate come «installate fuori dallo store».

## Livelli

| Livello | da punti |
|---|---|
| CRITICAL | 80 |
| HIGH | 60 |
| MEDIUM | 35 |
| LOW | 15 |

## Segnali

| Segnale | Punti |
|---|---|
| Servizio di accessibilità attivo (può leggere lo schermo ed eseguire tocchi) | 25 |
| Amministratore dispositivo attivo (resiste alla disinstallazione, può bloccare/cancellare) | 20 |
| Nessuna icona nel launcher (nascosta dal drawer) | 20 |
| È la tastiera del telefono ed è installata fuori dallo store: vede tutto ciò che si digita | 20 |
| Impostata come VPN sempre attiva: tutto il traffico internet passa da lei | 15 |
| È il servizio di compilazione automatica (password) ed è installata fuori dallo store | 15 |
| Può comportarsi come una carta di pagamento contactless (NFC) | 15 |
| Nome ingannevole (finto player/cleaner/app per adulti) su app sideloaded | 12 |
| Accesso alle notifiche (può leggere messaggi e codici in arrivo) | 12 |
| Installata fuori dallo store negli ultimi 7 giorni, già con accessi speciali | 12 |
| Permesso SMS concesso | 12 |
| Ha inviato 5 MB o più in background (nulla sullo schermo) dall'ultimo riavvio | 10 |
| Google Play Protect è disattivato su questo telefono | 10 |
| Installata fuori da uno store attendibile | 10 |
| Riceve gli eventi degli SMS in entrata / in uscita | 10 |
| Tra le app che consumano più batteria (10% o più di tutte le app, dall'ultima ricarica completa) | 8 |
| Permesso registro chiamate concesso | 8 |
| Ha letto gli appunti negli ultimi 7 giorni (password, codici, IBAN copiati) | 8 |
| Può disegnare sopra altre app | 8 |
| Nome di pacchetto da app di sistema (Android / Google / produttore) su un'app installata fuori dallo store | 8 |
| Posizione in background concessa | 6 |
| Monitora le chiamate (stato del telefono / chiamate in uscita) | 6 |
| Posizione precisa concessa | 6 |
| Permesso microfono/fotocamera concesso | 6 |
| Ha inviato 1 MB o più in background di notte (00-06) | 6 |
| Può installare altre app | 5 |

## Combinazioni

| Combinazione | Punteggio minimo | Livello minimo |
|---|---|---|
| Nascosta + accessibilità + amministratore: schema tipico di stalkerware | 90 | CRITICAL |
| Senza icona, installata fuori dallo store, e ha usato microfono o fotocamera in background negli ultimi 7 giorni | 85 | CRITICAL |
| Possibile clonazione carta NFC: si comporta come una carta contactless, installata fuori da uno store e può leggere lo schermo o nascondersi. NON avvicinare carte bancarie a questo telefono; fai bloccare le carte dalla banca | 85 | CRITICAL |
| App sideloaded con amministratore dispositivo e overlay schermo: schema ransomware blocca-schermo (blocca il telefono e chiede un pagamento; spesso diffuso tramite link WhatsApp/Facebook) | 85 | CRITICAL |
| Amministratore + accessibilità fuori dallo store: può leggere e usare il telefono e resiste alla rimozione | 80 | CRITICAL |
| App nascosta con accessibilità e accesso a SMS/posizione/mic: schema spyware | 80 | CRITICAL |
| Accessibilità + overlay + SMS da app sideloaded: schema trojan bancario | 75 | HIGH |
| Senza icona, installata fuori dallo store, e invia dati in background: ciò che fa un'app spia con quello che raccoglie | 75 | HIGH |
| Play Protect disattivato + un'app fuori dallo store con il controllo: la procedura tipica di installazione di uno stalkerware | 75 | HIGH |
| Si spaccia per app di sistema: nome da sistema, installata fuori dallo store, con una funzione sensibile o senza icona | 75 | HIGH |
| Legge gli appunti e può agire di nascosto (accessibilità o senza icona): password e codici OTP copiati a rischio | 70 | HIGH |
| App nascosta sideloaded con amministratore dispositivo | 70 | HIGH |
| Possibile keylogger: tastiera o compilazione password installata fuori dallo store | 70 | HIGH |
| Intercetta SMS o chiamate senza icona: codici monouso e chiamate visti di nascosto | 70 | HIGH |
| Senza icona, installata fuori dallo store, e tra le app che consumano più batteria | 65 | HIGH |
| Accessibilità + accesso alle notifiche fuori dallo store: vede lo schermo e l'anteprima di ogni messaggio | 65 | HIGH |
| Installata da poco fuori dallo store e già con il controllo del telefono (accessibilità, amministratore o notifiche): chiedere al cliente chi l'ha installata e quando | 65 | HIGH |
| App sideloaded che disegna overlay con installazione silenziosa o icona nascosta: schema ad-fraud/fleeceware (finto player, cleaner/booster, gioco craccato) | 60 | HIGH |
| Accesso notifiche + SMS da app sideloaded: schema ruba-codici OTP | 60 | HIGH |
| VPN sempre attiva installata fuori dallo store: il traffico può essere letto o deviato; chiedere al cliente se l'ha scelta | 45 | MEDIUM |
| App camuffata: il nome imita un'app Google / di sistema (o mescola lettere latine e cirilliche) ed è installata fuori da uno store | dal nome dell’app | — |

## Limiti

- Le regole vedono ciò che Android dichiara via USB (permessi, servizi attivi, chi ha installato l’app, uso recente). Non leggono il contenuto delle app né i messaggi.
- Uno spyware che sfrutta una falla del sistema senza installare un’app visibile non lascia questi segni: per quei casi servono gli indicatori firmati e un’analisi forense.
- Un falso positivo è possibile. Se una regola sbaglia su un’app legittima, scriveteci: la correggiamo e la correzione arriva a tutti con l’aggiornamento.

_Generato da electron/behavioralScan.js._
