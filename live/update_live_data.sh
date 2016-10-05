#!/bin/sh

DATA_REPO_DIR='/home/marcel/rbtvdata/'
LIVE_DATA_DIR='live/'
LIVE_METADATA_FILEPATH='live/metadata.json'

#push live data
cd $DATA_REPO_DIR
git pull
printf "{\n\t\"time\": `date +%s`\n}\n" > $LIVE_METADATA_FILEPATH
git add $LIVE_DATA_DIR
git commit -m "update live data"
git push
