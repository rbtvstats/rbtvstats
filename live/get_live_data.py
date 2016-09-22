#!/usr/bin/env python

import requests
import time

API_KEY = ''
CHANNEL_ID = 'UCQvTDmHza8erxZqDkjQ4bQQ'
DATA_FILEPATH = '/home/marcel/rbtvdata/live/data.csv'

if __name__ == "__main__":
    #find livestream video id
    searchResult = requests.get('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%s&eventType=live&type=video&key=%s' % (CHANNEL_ID, API_KEY))
    searchResultContent = searchResult.json()
    videoId = searchResultContent['items'][0]['id']['videoId']

    #get current viewer count
    videoResult = requests.get('https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=%s&key=%s' % (videoId, API_KEY))
    videoResultContent = videoResult.json()
    viewerCount = videoResultContent['items'][0]['liveStreamingDetails']['concurrentViewers']

    #save datapoint
    fd = open(DATA_FILEPATH, 'a')
    fd.write('%s,%s\n' % (int(time.time()), viewerCount))
    fd.close()
