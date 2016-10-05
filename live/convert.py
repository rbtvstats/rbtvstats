#!/usr/bin/env python
import datetime
import os
import sys

OUTPUT_FOLDER = '/home/marcel/rbtvdata/live'

def loadLiveData():
    filepath = sys.argv[1]
    fd = open(filepath, 'r')
    data = fd.read()
    fd.close()
    return data

def saveLiveData(month, data):
    filepath = os.path.join(OUTPUT_FOLDER, month + '.csv')
    fd = open(filepath, 'w')
    for d in data:
        fd.write('%d,%d\n' % d)
    fd.close()

if __name__ == '__main__':
    data = loadLiveData()

    live = {}
    splitData = data.split('\n')
    for line in splitData:
        split = line.split(',')
        if len(split) == 2:
            timestamp = int(split[0])
            viewers = int(split[1])
            date = datetime.datetime.fromtimestamp(timestamp)

            id = date.strftime('%Y-%m')
            if id not in live:
                live[id] = []

            live[id].append((timestamp, viewers)) 

    for month, data in live.iteritems():
        data = sorted(data, key=lambda v: v[0])
        saveLiveData(month, data)
