#!/usr/bin/env python

import requests
import datetime
import time
import os

API_KEY = ''
CHANNEL_ID = 'rocketbeanstv'
OUTPUT_FOLDER = '/home/marcel/rbtv/rbtvdata/live/twitch'

if __name__ == "__main__":
    #get current viewer count
    videoResult = requests.get('https://api.twitch.tv/kraken/streams/%s?client_id=%s' % (CHANNEL_ID, API_KEY))
    videoResultContent = videoResult.json()
    viewerCount = videoResultContent['stream']['viewers']

    #save datapoint
    date = datetime.datetime.now()
    timestamp = int(time.mktime(date.timetuple()))
    filepath = os.path.join(OUTPUT_FOLDER, date.strftime('%Y-%m.csv'))
    fd = open(filepath, 'a')
    fd.write('%s,%s\n' % (timestamp, viewerCount))
    fd.close()
