#!/usr/bin/env python
import simplejson as json
import time
import datetime
import os
import sys
import pytz

RAW_DATA_FOLDER = '/home/marcel/Development/rbtvdata/twitter/raw'
OUTPUT_FOLDER = '/home/marcel/Development/rbtvdata/twitter'
fileId = 'data'

def loadTweets():
    print('load tweets...')
    tweets = {}
    filepath = '%s/%s.json' %(RAW_DATA_FOLDER, fileId)
    if os.path.isfile(filepath):
        fd = open(filepath, 'r')
        tweets = json.load(fd)
        fd.close()
    print('loaded %d tweets' % len(tweets))
    return tweets

def saveTweets(day, tweets):
    print('save %d tweets from %s...' % (len(tweets), day))
    filepath = os.path.join(OUTPUT_FOLDER, fileId, day + '.json')
    fd = open(filepath, 'w')
    json.dump(tweets, fd, indent='\t')
    fd.close()

def sortByDate(tweet):
    return tweet['created_at']

if __name__ == '__main__':
    if len(sys.argv) == 2:
        fileId = sys.argv[1]

    tweets = loadTweets()

    timezoneLocal = pytz.timezone('Europe/Berlin')
    dateFrom = timezoneLocal.localize(datetime.datetime(2015, 1, 15))

    #group tweets
    groupedTweets = {}
    for id, tweet in tweets.iteritems():
        date = datetime.datetime.strptime(tweet['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
        localDate = pytz.utc.localize(date).astimezone(timezoneLocal)
        if localDate >= dateFrom:
            timestamp = int(time.mktime(localDate.timetuple()))
            tweet['created_at'] = timestamp
            tweet['id'] = id
            day = localDate.strftime('%Y-%m-%d')
            if day not in groupedTweets:
                groupedTweets[day] = []
            groupedTweets[day].append(tweet)

    #save grouped tweets
    dirpath = os.path.join(OUTPUT_FOLDER, fileId)
    os.mkdir(dirpath)

    for day, tweets in groupedTweets.iteritems():
        tweets = sorted(tweets, key=sortByDate)
        saveTweets(day, tweets)
