#!/usr/bin/env python
import datetime
import simplejson as json
import os
import sys

OUTPUT_FOLDER = '/home/marcel/Development/rbtvdata/video'

def loadVideoData():
    filepath = sys.argv[1]
    openfile = open(filepath)
    data = json.load(openfile)
    openfile.close()

    return data

def saveVideoData(month, videos):
    filepath = os.path.join(OUTPUT_FOLDER, month + '.json')
    fd = open(filepath, 'w')
    json.dump(videos, fd, indent='\t')
    fd.close()

def sortByDate(video):
    return video['published']

if __name__ == '__main__':
    videos = loadVideoData()

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
