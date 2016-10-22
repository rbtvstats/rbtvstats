#!/usr/bin/env python
import simplejson as json
import datetime
import time
import os
import sys
import glob

DATA_REPO_DIR = '/home/marcel/rbtv/rbtvdata/'
VIDEO_DATA_DIR = 'video/'
VIDEO_METADATA_FILEPATH = 'video/metadata.json'

def loadVideoData():
    filepath = sys.argv[1]
    openfile = open(filepath)
    data = json.load(openfile)
    openfile.close()

    return data

def saveVideoData(month, videos):
    filepath = os.path.join(DATA_REPO_DIR, VIDEO_DATA_DIR, month + '.json')
    fd = open(filepath, 'w')
    json.dump(videos, fd, indent='\t')
    fd.close()

def updateMetadata():
    files = sorted(glob.glob(os.path.join(VIDEO_DATA_DIR, '*.json')))
    files = files[:-1]

    #first entry
    filepath = files[0]
    firstTimestamp = 0
    with open(filepath, 'r') as file:
        data = json.load(file)
        firstTimestamp = data[0]['published']

    #last entry
    filepath = files[-1]
    lastTimestamp = 0
    with open(filepath, 'r') as file:
        data = json.load(file)
        lastTimestamp = data[-1]['published']

    #time
    currentTimestamp = int(time.time())

    metadata = {}
    metadata['first'] = firstTimestamp
    metadata['last'] = lastTimestamp
    metadata['time'] = currentTimestamp

    filepath = VIDEO_METADATA_FILEPATH
    file = open(filepath, 'w')
    json.dump(metadata, file, indent='\t')
    file.close()

def sortByDate(video):
    return video['published']

if __name__ == '__main__':
    videos = loadVideoData()

    os.chdir(DATA_REPO_DIR)

    #group videos
    groupedVideos = {}
    for video in videos.itervalues():
        date = datetime.datetime.fromtimestamp(video['published'])
        month = date.strftime('%Y-%m')

        if month not in groupedVideos:
            groupedVideos[month] = []

        groupedVideos[month].append(video)

    #save grouped videos
    for month, videos in groupedVideos.iteritems():
        videos = sorted(videos, key=sortByDate)
        saveVideoData(month, videos)

    updateMetadata()
