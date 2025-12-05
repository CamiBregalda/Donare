#!/bin/bash

yum update -y
yum install -y docker
service docker start
chkconfig docker on
usermod -a -G docker ec2-user

mkdir -p /usr/local/lib/docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

cd /home/ec2-user

cat <<EOT > docker-compose.yml
services:

  postgres:
    image: postgres:15
    container_name: postgres_db_donare
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: donareDB
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - donare_network

  backend:
    image: davidmarlon/donare-backend:v1
    container_name: donare_backend
    restart: always
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres_db_donare:5432/donareDB
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: password
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
    networks:
      - donare_network

  frontend:
    image: davidmarlon/donare-frontend:v1
    container_name: donare_frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - donare_network

volumes:
  postgres_data:

networks:
  donare_network:
    driver: bridge
EOT

chown ec2-user:ec2-user docker-compose.yml

docker compose up -d