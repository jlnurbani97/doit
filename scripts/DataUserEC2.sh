#!/bin/bash
# Log dell'output per debug
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

# Aggiorna il sistema
apt-get update -y
apt-get upgrade -y

# Installazione prerequisiti
apt install -y ca-certificates curl unzip

# Installazione docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

cat <<EOF > /etc/apt/sources.list.d/docker.sources
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt-get update -y
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installazione fail2ban
apt install -y fail2ban

# Installazione AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf awscliv2.zip aws/

# Post-installazione e permessi
systemctl enable --now docker fail2ban
usermod -aG docker ubuntu

# Creazione cartella progetto e permessi
mkdir -p /home/ubuntu/doit
chown ubuntu:ubuntu /home/ubuntu/doit