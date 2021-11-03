#!/usr/bin/env bash

echo "Redeploying lesebot!"

echo "Getting latest Docker container"
docker pull ghcr.io/lesesalen/lesebot:latest

echo "Stopping bot..."
docker stop testbot

echo "Removing old container..."
docker container rm testbot

echo "Redeploying bot"
docker run --env-file .env --pull always -itd --restart unless-stopped --name testbot ghcr.io/lesesalen/lesebot:latest

echo "And we're live again!"
