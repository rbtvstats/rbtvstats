#!/usr/bin/env python
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import os
import sys

OUTPUT_FOLDER = '/home/marcel/Development/rbtvdata/twitter/raw'

app = Flask(__name__)
CORS(app)

fileId = 'data'
tweets = {}

@app.route('/', methods = ['POST'])
def handler():
    content = request.json
    oldCount = len(tweets)
    for id, tweet in content.iteritems():
        if id not in tweets:
            tweets[id] = tweet
    newCount = len(tweets)
    diff = newCount - oldCount
    print('added %d new tweets' % diff)

    return ''

def loadTweets():
    print('load tweets...')
    global tweets
    filepath = '%s/%s.json' %(OUTPUT_FOLDER, fileId)
    if os.path.isfile(filepath):
        fd = open(filepath, 'r')
        tweets = json.load(fd)
        fd.close()
    print('loaded %d tweets' % len(tweets))

def saveTweets():
    print('save tweets...')
    filepath = '%s/%s.json' %(OUTPUT_FOLDER, fileId)
    fd = open(filepath, 'w')
    json.dump(tweets, fd, indent=4)
    fd.close()
    print('saved %d tweets' % len(tweets))

if __name__ == '__main__':
    if len(sys.argv) == 2:
        fileId = sys.argv[1]

    loadTweets()
    app.run(debug=False, port=8042)
    saveTweets()
