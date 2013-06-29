#!/bin/bash

grunt build

# upload
echo Upload to server
rsync -avHz --delete --progress dist/ busaosp@busaosp.com.br:/home/busaosp/beta.busaosp.com.br/
