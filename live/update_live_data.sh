#!/bin/sh

WORKING_DIR='/home/marcel/rbtvdata/'
LIVE_DATA_FILEPATH='live/data.csv'
LIVE_METADATA_FILEPATH='live/metadata.json'

cd $WORKING_DIR

git pull
printf "{\n\t\"time\": `date +%s`\n}\n" > $LIVE_METADATA_FILEPATH
git add $LIVE_DATA_FILEPATH
git add $LIVE_METADATA_FILEPATH
git commit -m "update live data"
git push
