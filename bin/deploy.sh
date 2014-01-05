#!/bin/bash

grunt build

# upload app
echo Upload app to server
rsync -avHz --delete --progress dist/ busaosp@busaosp.com.br:/home/busaosp/app.busaosp.com.br/

# upload home
echo Upload home to server
rsync -avHz --delete --progress home/ busaosp@busaosp.com.br:/home/busaosp/busaosp.com.br/
