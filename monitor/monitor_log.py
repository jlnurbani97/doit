#Script di monitor del log

from pathlib  import Path
import re
from collections import defaultdict
from datetime import datetime
import boto3
import os
import time

#Recupero il path del log
LOG_PATH = Path("/app/backend/logs/security.log")


#Intervallo rilevamento
TIME_TO_DELETE= 60

#Numero massimo tollerato di accessi per intervallo di tempo
MAX_ACCESS_TIMES = 5

#Regex per interpretazione linee file
FAILED_LOGIN_REGEX = re.compile(
    r"(?P<ts>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*Tentativo di login fallito.*IP:\s*(?P<ip>\S+)"
)

#Dichiarazione dictionary per mapping IP - Timestamp
FAILED_ATTEMPTS = defaultdict(list)

#Variabili SES
SES_REGION = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
SENDER_EMAIL = os.environ.get("EMAIL_SENDER")
RECIPIENT_EMAIL = os.environ.get("EMAIL_RECIPIENT")

if not SENDER_EMAIL or not RECIPIENT_EMAIL:
    raise RuntimeError("EMAIL_SENDER o EMAIL_RECIPIENT non impostate")

#SES Client
ses=boto3.client("ses",region_name=SES_REGION)

#Function per l'inzio dell'alert
def send_alert(ip,lenght):
    subject = f"[ALERT] Tentativi multipli di accesso da {ip}"
    body = f"""
ATTENZIONE!
Rilevati {lenght} tentativi di login falliti dall'indirizzo IP: {ip}. 

Timestamp: {datetime.now()}
"""
    ses.send_email(
        Source=SENDER_EMAIL,
        Destination={"ToAddresses":[RECIPIENT_EMAIL]},
        Message={
            "Subject":{"Data":subject},
            "Body":{"Text":{"Data":body}},
        }
    )
    print(f"[ALERT] Email inviata per IP {ip}")

print (LOG_PATH)


#Lettura file di log
def monitor_log():
    print ("Monitor avviato")
    while True:
        try:
            with open(LOG_PATH,"r") as logFile:
                #Vado all'utima linea
                logFile.seek(0, os.SEEK_END)
                #Ciclo infinito per esecuzione
                while True:
                    line = logFile.readline()
                    if not line:
                        # Se non c'è una nuova riga, aspetta un secondo e riprova
                        time.sleep(1)
                        continue
                    #Cerco ricorrenza nella linea
                    match = FAILED_LOGIN_REGEX.search(line)
                    if not match:
                        continue
                    #Prendo IP
                    ip = match.group("ip")
                    #Prendo timestamp
                    log_ts = match.group("ts")
                    #Converto stringa a datetime e poi a decimale
                    event_time = datetime.strptime(
                        log_ts, "%Y-%m-%d %H:%M:%S"
                    ).timestamp()

                    #Mapping IP - Timestamp
                    FAILED_ATTEMPTS[ip].append(event_time)

                    #Rimozione vecchi IP
                    FAILED_ATTEMPTS[ip] = [
                        #Inserisco valore solo se evento registrato - evento più recente <= TIME_TO_DELETE (60s)
                        t for t in FAILED_ATTEMPTS[ip]
                        if event_time -t <= TIME_TO_DELETE
                    ]
                    #Verifica lunghezza accessi per IP
                    if len(FAILED_ATTEMPTS[ip]) >= MAX_ACCESS_TIMES:
                        #Invio Notifica
                        send_alert(ip,len(FAILED_ATTEMPTS[ip]))
                        #Pulizia anti spam
                        FAILED_ATTEMPTS[ip].clear()
        except FileNotFoundError:
                #Seconda esecuzione nel caso il log non sia stato ancora creto dal backend
                print(f"Errore: Il file {LOG_PATH} non esiste ancora. Riprovo tra 5 secondi...")
                time.sleep(5)

#Eseguo lo script
if __name__ == "__main__":
    monitor_log()
