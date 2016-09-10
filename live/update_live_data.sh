#!/bin/sh

WORKING_DIR='/home/marcel/rbtvstats.github.io/'
LIVE_DATA_FILEPATH='data/live_data.csv'
LIVE_METADATA_FILEPATH='data/live_metadata.json'

cd $WORKING_DIR

git pull
printf "{\n\t\"time\": `date +%s`\n}\n" > $LIVE_METADATA_FILEPATH
git add $LIVE_DATA_FILEPATH
git add $LIVE_METADATA_FILEPATH
git commit -m "update live data"
git push
