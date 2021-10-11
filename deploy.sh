#!/usr/bin/env bash

echo "Redeploying lesebot!"

echo "Getting latest Docker container"
docker pull ghcr.io/lesesalen/lesebot:latest

echo "Stopping bot..."
docker stop lesebot

echo "Removing old container..."
docker container rm lesebot

echo "Redeploying bot"
docker run --env-file .env -itd --pull always --restart unless-stopped --name lesebot ghcr.io/lesesalen/lesebot:latest

echo "And we're live again!"
