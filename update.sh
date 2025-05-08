#!/bin/bash
git pull
docker container stop ctpuzzlegame
docker container rm ctpuzzlegame
docker image rm ctpuzzlegame:1.0
docker image build -t ctpuzzlegame:1.0 .
docker run --name ctpuzzlegame -p 3339:8080 ctpuzzlegame:1.0 npx node-static dist -a 0.0.0.0
