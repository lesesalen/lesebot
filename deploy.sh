#!/usr/bin/env bash

echo "Redeploying lesebot!"

echo "Building new docker container..."
docker build -t lesebot .

echo "Stopping bot..."
docker stop lesebot

echo "Removing old container..."
docker container rm lesebot

echo "Redeploying bot"
docker run --env-file .env -itd --restart unless-stopped --name lesebot lesebot

echo "And we're live again!"
