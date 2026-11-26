# Doit — Secure Containerized Kanban Web Application

**Doit** è una web application full-stack basata su metodologia **Kanban** (*To Do*, *In Progress*, *Done*) progettata secondo il paradigma **Defense in Depth** e **Security by Design**. 

Sviluppata come Project Work per il percorso di *Tecnico esperto in Cloud Computing Solution Architecture and Cybersecurity*, l'infrastruttura dimostra l'integrazione tra sviluppo a microservizi containerizzati (Docker), hardening applicativo e sistemistico (OWASP remediation, Fail2ban, Reverse Proxy), logging centralizzato e automazione cloud su **AWS** (EC2, S3, SES, IAM).

---

## Architettura del Sistema

L'infrastruttura è ospitata su un'istanza **AWS EC2 (`t3.small`, Ubuntu 24.04)** protetta da un Security Group perimetrale restrittivo (porte `80` e `22` filtrate). I servizi applicativi sono isolati all'interno di una rete Docker dedicata orchestrata tramite `docker-compose`.

![Architettura finale Do.it](https://github.com/user-attachments/assets/efd1acc8-363d-4891-b68c-31b950672b7f)

### Microservizi e Componenti

| Servizio / Componente | Tecnologia | Ruolo nell'infrastruttura |
| :--- | :--- | :--- |
| **`doit-frontend`** | React, Vite, Tailwind CSS | Esegue una **multi-stage build** (`node:20-alpine`) per generare gli asset statici dell'interfaccia SPA, eliminando codice sorgente e dipendenze di sviluppo a runtime. |
| **`doit-nginx`** | Nginx (`alpine`) | Unico punto di ingresso HTTP (porta `80`). Serve la build statica del frontend e agisce da **Reverse Proxy** verso il backend (`:3000`), inoltrando gli header `X-Real-IP` e `X-Forwarded-For`. |
| **`doit-backend`** | Node.js, Express, Sequelize | Espone le API REST (pattern MVC), gestisce l'autenticazione stateless via **JWT**, l'hashing delle password (**Bcrypt**) e scrive i log di sicurezza strutturati tramite **Winston**. |
| **`doit-mysql`** | MySQL 8.0 | Database relazionale isolato nella rete interna Docker, accessibile esclusivamente dal backend. |
| **`doit-monitor`** | Python 3.12 (`slim`), `boto3` | Container dedicato che legge in sola lettura (`:ro`) il file `security.log` in tempo reale e invia alert via **AWS SES** al superamento della soglia di tentativi di login falliti. |
| **Host Hardening & Backup** | Fail2ban, Bash, Crontab, AWS CLI | **Fail2ban** analizza `security.log` sull'host e applica ban temporanei via `iptables` contro attacchi Brute Force; uno script cron orario comprime i log e li archivia su **AWS S3** tramite **IAM Role**. |

---

## Flusso di Logging, Monitoring e Incident Response

Il cuore dell'osservabilità del sistema è il file `/var/log/doit/security.log`, condiviso tra container e host tramite Docker Volume:

1. **Generazione (`doit-backend`):** Il logger Winston registra ogni evento critico (login riusciti/falliti, registrazioni, operazioni CRUD) con timestamp e IP reale del client estratto dagli header di Nginx:
   ```text
   2025-12-28 17:51:45 [WARN]: Tentativo di login fallito | User: example | IP: 203.0.113.42
   ```
2. **Prevenzione Attiva (`Fail2ban`):** La jail custom `doit-login` monitora il log e blocca automaticamente su porta `80` per **10 minuti** (`bantime = 600`) qualsiasi IP che totalizzi **5 tentativi falliti in 60 secondi**.
3. **Alerting in Tempo Reale (`doit-monitor` + `AWS SES`):** Lo script `monitor_log.py` traccia in memoria una finestra mobile di 60 secondi per ogni IP sorgente; al raggiungimento dei 5 errori invia una notifica email all'amministratore tramite Amazon Simple Email Service.
4. **Log Retention (`Crontab` + `AWS S3`):** Lo script `scripts/backup_s3.sh` viene eseguito allo scoccare di ogni ora (`0 * * * *`), comprime il file di log in formato `.tar.gz` e lo carica su un bucket S3 privato sfruttando un **IAM Role** configurato secondo il principio del *Least Privilege* (`s3:PutObject`, `s3:ListBucket`, `ses:SendEmail`).

---

## Security Testing e Remediation (OWASP)

Durante lo sviluppo sono stati eseguiti test offensivi controllati in ambiente isolato (Kali Linux / Burp Suite / Bettercap) per validare l'efficacia delle contromisure implementate:

* **Brute Force Authentication:** Simulato con *Burp Suite Intruder*. Mitigato tramite **Fail2ban** (blocco L3/L4) e **Log Monitor** (alerting via SES).
* **Broken Access Control / IDOR:** Risolto sostituendo il passaggio esplicito dello `userId` nelle rotte API con l'estrazione dell'identità lato server tramite middleware di verifica **JWT** (`Bearer` token).
* **SQL Injection (SQLi):** Prevenuta tramite l'uso dell'ORM **Sequelize** con *Prepared Statements* e query parametrizzate.
* **Cryptographic Failures (Plaintext Passwords):** Mitigato tramite hashing e salting delle password con **Bcrypt** (10 salt rounds) prima della persistenza su MySQL.
* **Cross-Site Scripting (XSS):** Mitigato dall'escaping automatico del DOM nativo di **React** sui dati renderizzati.
* **Man-in-the-Middle (MITM / ARP Spoofing):** Analizzato in rete locale con *Bettercap*, evidenziando la necessità di terminazione TLS/HTTPS per il traffico in produzione.

---

## Struttura del Progetto

```text
doit/
├── backend/                # API REST Node.js/Express (MVC, JWT, Bcrypt, Winston, Sequelize)
├── frontend/               # Single Page Application React + Vite + Tailwind CSS
├── monitor/                # Servizio Python per analisi real-time dei log e alert AWS SES
├── nginx/                  # Configurazione Reverse Proxy (default.conf)
├── scripts/
│   ├── DataUserEC2.sh      # Script di provisioning automatico per istanza AWS EC2 (User Data)
│   └── backup_s3.sh        # Script Bash per archiviazione oraria dei log su AWS S3
└── docker-compose.yml      # Orchestrazione multi-container e gestione volumi
```

---

## Installazione e Avvio Rapido

### Prerequisiti
* Docker Engine & Docker Compose plugin
* Account AWS (opzionale, richiesto solo per backup S3 e notifiche SES)

### 1. Clona la repository
```bash
git clone https://github.com/jlnurbani97/doit.git
cd doit
```

### 2. Configura le variabili d'ambiente
Crea i file `.env` nelle rispettive directory (`backend/.env.backend`, `monitor/.env.monitor`, e `.env.docker` nella root) impostando le credenziali del database, la chiave `JWT_SECRET` e i parametri AWS (`AWS_DEFAULT_REGION`, `EMAIL_SENDER`, `EMAIL_RECIPIENT`).

### 3. Avvia lo stack con Docker Compose
```bash
docker compose up -d --build
```

L'applicazione sarà raggiungibile su `http://localhost` (porta `80`).

### 4. Provisioning su AWS EC2 (Produzione)
Lo script `scripts/DataUserEC2.sh` può essere passato direttamente come **User Data** in fase di creazione dell'istanza Ubuntu EC2 per installare automaticamente Docker, Fail2ban, AWS CLI e predisporre le directory di progetto.

---

## Sviluppi Futuri e Hardening Avanzato (Roadmap)

Sebbene l'attuale architettura soddisfi i requisiti di sicurezza e monitoraggio per un ambiente dimostrativo, l'evoluzione verso uno standard *production-ready* prevede i seguenti miglioramenti tecnici e organizzativi:

* **Container Hardening (Esecuzione Non-Root):** Attualmente i container applicativi (`doit-backend`, `doit-monitor`) girano con privilegi di `root` (UID 0) all'interno del namespace del container. In ottica *Least Privilege*, l'introduzione di utenti applicativi dedicati non privilegiati nei `Dockerfile` (es. `USER node` o creazione di un utente di sistema ad hoc) ridurrebbe drasticamente l'impatto di un eventuale *container escape* sull'host sottostante.
* **Terminazione TLS/HTTPS:** Attualmente il traffico viaggia in chiaro su porta `80` (HTTP), esponendo le comunicazioni al rischio di sniffing (come dimostrato nei test MITM). L'aggiunta di un dominio dedicato con certificati **SSL/TLS** (via *Let's Encrypt/Certbot* su Nginx o **AWS Certificate Manager** dietro un *Application Load Balancer*) garantirebbe la cifratura in transito e il redirect forzato `HTTP -> HTTPS` con header **HSTS**.
* **Secrets Management Centralizzato:** Sostituzione dei file `.env` locali con **AWS Secrets Manager** o **AWS Systems Manager (SSM) Parameter Store**, iniettando a runtime credenziali DB e `JWT_SECRET` direttamente nei container senza mantenerli sul filesystem dell'istanza EC2.
* **Isolamento di Rete dei Container:** Rimozione di `network_mode: host` sul servizio `doit-nginx` a favore di una rete Docker **bridge** dedicata con pubblicazione selettiva delle sole porte necessarie (`80`/`443`), aumentando la segmentazione tra host e reverse proxy.
* **Rate Limiting Applicativo e Token Refresh:** Affiancare al blocco L3/L4 di Fail2ban un *rate limiting* nativo su Nginx (`limit_req_zone`) e a livello Express, introducendo inoltre un meccanismo di **Refresh Token** con revoca per ridurre la finestra di validità degli access token JWT.
* **Git Flow e Pipeline CI/CD:** Essendo stato sviluppato individualmente, l'intero ciclo di sviluppo è stato gestito direttamente sul branch `main`. In un contesto collaborativo, l'adozione di una strategia **Git Flow** (*feature branches*, *Pull Request* con branch protection) abbinata a una pipeline **GitHub Actions** permetterebbe di automatizzare controlli SAST/SCA (*Trivy* per le immagini Docker, *Gitleaks* in pre-commit) prima del deploy.

## Autore

**Julen Urbani** — [GitHub](https://github.com/jlnurbani97)
