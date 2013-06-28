#!/bin/bash

trap "killall php node" EXIT

cd app
php -S 127.0.0.1:8888 &> /dev/null &

cd ..
grunt run
