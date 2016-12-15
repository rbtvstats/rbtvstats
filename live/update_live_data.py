#!/usr/bin/env python
import simplejson as json
import datetime
import time
import os
import glob

DATA_REPO_DIR = '/home/marcel/rbtv/rbtvdata/'
LIVE_DATA_DIR = 'live/'
LIVE_METADATA_FILEPATH = 'live/metadata.json'
LIVE_METADATA_FILEPATH2 = 'live/metadata2.json'

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

    #################################
    #metadata 2
    metadataFiles = []
    totalSize = 0
    for filepath in files:
        with open(filepath, 'r') as file:
            f = {}
            f['filename'] = os.path.basename(filepath)
            lines = file.readlines()
            firstEntry = lines[0]
            f['start'] = int(firstEntry.split(',')[0])
            lastEntry = lines[-1]
            f['end'] = int(lastEntry.split(',')[0])
            metadataFiles.append(f)
            totalSize += file.tell()

    metadataFiles.sort(key=lambda f: f['start'])

    metadata = {}
    metadata['update'] = currentTimestamp
    metadata['files'] = metadataFiles
    metadata['size'] = totalSize

    filepath = LIVE_METADATA_FILEPATH2
    with open(filepath, 'w') as file:
        json.dump(metadata, file, indent=2)

if __name__ == "__main__":
    os.chdir(DATA_REPO_DIR)

    #os.system('git pull')
    updateMetadata()
    #os.system('git add %s' % LIVE_DATA_DIR)
    #os.system('git commit -m "update live data"')
    #os.system('git push')
