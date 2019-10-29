#!/bin/bash
SSH_SERVER=`cat server.txt`
REMOTE_DIR=/var/www/dnd/algen

echo "Copying files to server"
rsync -rlptv -e ssh --delete dist/ $SSH_SERVER:$REMOTE_DIR
