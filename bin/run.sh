#!/bin/bash

trap "killall php node" EXIT

cd app
php -S 0.0.0.0:8888 ../bin/router.php  &

cd ..
grunt run
