#!/bin/bash
docker run --rm -it -u $(id -u):$(id -g) -v $PWD:/workdir $(docker build -q .) /bin/bash
