#!/bin/bash
#Variabili
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_PATH="$PROJECT_ROOT/backend/logs/security.log"
DATE=$(date +%Y-%m-%d_%H%M%S)
ARCHIVE="security_log_backup_$DATE.tar.gz"
BUCKET="doit-cyber-2025"

echo "----------------------------------------------------------"
echo "-- Backup_s3 starting... --"
echo "Verifica esistenza log..."

#Verifico esistenza del file di log
if [ -f "$LOG_PATH" ]; then
    echo "File di log inesistente!"
    exit 1
fi
echo "Security log rilevato: $LOG_PATH"

#Creazione archivio compresso
echo "Creazione file compresso..."
tar -czf "/tmp/$ARCHIVE" -C "$(dirname "$LOG_PATH")" "$(basename "$LOG_PATH")"
echo "Cartella $ARCHIVE creata"

#Creazione archivio compresso
echo "Caricamento su Bucker s3..."
aws s3 cp "/tmp/$ARCHIVE" "s3://$BUCKET/$ARCHIVE"
echo "Inserimento in $BUCKET/$ARCHIVE avvenuto con successo."

#Rimozione locale
rm "/tmp/$ARCHIVE"
echo "File $ARCHIVE rimosso localmente."

echo "-- Backup_s3 closing... --"
echo "----------------------------------------------------------"


