#!/usr/bin/env python
import simplejson as json
import datetime
import time
import os
import glob

DATA_REPO_DIR = '/home/marcel/rbtv/rbtvdata/'
CHAT_DATA_DIR = 'chat/'
CHAT_METADATA_FILEPATH = 'chat/metadata.json'

def updateMetadata():
    files = sorted(glob.glob(os.path.join(CHAT_DATA_DIR, '*.txt')))

    #first entry
    filepath = files[0]
    firstDate = os.path.splitext(os.path.basename(filepath))[0]
    firstTime = ''
    with open(filepath, 'r') as file:
        firstEntry = file.readline()
        firstTime = firstEntry[1:9]
    firstDatetime = datetime.datetime.strptime(firstDate + ' ' + firstTime, '%Y-%m-%d %H:%M:%S')
    firstTimestamp = int(time.mktime(firstDatetime.timetuple()))

    #last entry
    filepath = files[-1]
    lastDate = os.path.splitext(os.path.basename(filepath))[0]
    lastTime = ''
    with open(filepath, 'r') as file:
        lastEntry = file.readlines()[-1]
        lastTime = lastEntry[1:9]
    lastDatetime = datetime.datetime.strptime(lastDate + ' ' + lastTime, '%Y-%m-%d %H:%M:%S')
    lastTimestamp = int(time.mktime(lastDatetime.timetuple()))

    #time
    currentTimestamp = int(time.time())

    #metadata
    metadata = {}
    metadata['first'] = firstTimestamp
    metadata['last'] = lastTimestamp
    metadata['time'] = currentTimestamp

    #save metadata
    filepath = CHAT_METADATA_FILEPATH
    with open(filepath, 'w') as file:
        json.dump(metadata, file, indent='\t')

if __name__ == "__main__":
    os.chdir(DATA_REPO_DIR)

    os.system('git pull')
    updateMetadata()
    os.system('git add %s' % CHAT_DATA_DIR)
    os.system('git commit -m "update chat data"')
    os.system('git push')
