#!/usr/bin/env python
import simplejson as json
import datetime
import time
import os
import glob

DATA_REPO_DIR = '/home/marcel/rbtv/rbtvdata/'
LIVE_DATA_DIR = 'live/'
LIVE_METADATA_FILEPATH = 'live/metadata.json'

def updateMetadata():
    files = sorted(glob.glob(os.path.join(LIVE_DATA_DIR, '*.csv')))

    #first entry
    filepath = files[0]
    firstDate = os.path.splitext(os.path.basename(filepath))[0]
    firstTimestamp = 0
    with open(filepath, 'r') as file:
        firstEntry = file.readline()
        firstTimestamp = int(firstEntry.split(',')[0])

    #last entry
    filepath = files[-1]
    lastDate = os.path.splitext(os.path.basename(filepath))[0]
    lastTimestamp = 0
    with open(filepath, 'r') as file:
        lastEntry = file.readlines()[-1]
        lastTimestamp = int(lastEntry.split(',')[0])

    #time
    currentTimestamp = int(time.time())

    #metadata
    metadata = {}
    metadata['first'] = firstTimestamp
    metadata['last'] = lastTimestamp
    metadata['time'] = currentTimestamp

    #save metadata
    filepath = LIVE_METADATA_FILEPATH
    with open(filepath, 'w') as file:
        json.dump(metadata, file, indent='\t')

if __name__ == "__main__":
    os.chdir(DATA_REPO_DIR)

    os.system('git pull')
    updateMetadata()
    os.system('git add $LIVE_DATA_DIR')
    os.system('git commit -m "update live data"')
    os.system('git push')
