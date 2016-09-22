#!/bin/sh

DATA_REPO_DIR='/home/marcel/rbtvdata/'
CHAT_DATA_DIR='chat/'
CHAT_METADATA_FILEPATH='chat/metadata.json'

#push chat data
cd $DATA_REPO_DIR
git pull
printf "{\n\t\"time\": `date +%s`\n}\n" > $CHAT_METADATA_FILEPATH
git add $CHAT_DATA_DIR
git commit -m "update chat data"
git push
