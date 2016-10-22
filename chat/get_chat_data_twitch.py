#!/usr/bin/env python

from datetime import datetime, timedelta
from pytz import timezone
from tqdm import tqdm
import pytz
import calendar
import requests
import codecs
import re
import json
import sys

BASE_URL = 'http://overrustlelogs.net/Rocketbeanstv chatlog'
OUTPUT_FOLDER = '/home/marcel/rbtv/rbtvdata/chat'

def print2(str):
    print(str)
    sys.stdout.flush()

def download(url):
    r = requests.get(url, stream=True)
    totalLength = r.headers.get('content-length')

    if totalLength is None: # no content length header
        return None
    else:
        dataAll = ''
        totalLength = int(totalLength) / 4096
        for data in tqdm(r.iter_content(chunk_size=4096), leave=True, total=totalLength, desc='Download ' + url):
            if data != None:
                dataAll += data

        return dataAll

if __name__ == "__main__":
    reload(sys)
    sys.setdefaultencoding("utf-8")

    currentDate = datetime(2015, 8, 5)
    #currentDate = datetime(2016, 8, 28)
    endDate = datetime(2016, 9, 1)

    timezoneLocal = timezone('Europe/Berlin')
    exp = re.compile("\[(\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d) UTC\] (.+?): (.+)?")

    chat = {}

    while currentDate <= endDate:
        folder = calendar.month_name[currentDate.month] + ' ' + str(currentDate.year)
        filename = currentDate.strftime('%Y-%m-%d.txt')
        url = BASE_URL + '/' + folder + '/' + filename

        print2('\n==============================================================================================================')
        print2('folder=%s' % folder)
        print2('filename=%s' % filename)
        print2('url=%s\n' % url)

        #download chat log
        tries = 5
        while tries > 0:
            print2('start download (try %i/%i)' % (6 - tries, 5))
            result = download(url)

            if result == None:
                tries = tries - 1
                if tries <= 0:
                    print2('could not download `%s`' % url)
            else:
                tries = 0

                #adjust format of all messages
                lines = result.splitlines()
                for line in lines:
                    match = exp.match(line)
                    if match is None:
                        print2('could not match line: `%s`' % line)
                    else :
                        dateStr = match.group(1) #UTC time
                        dateObj = datetime.strptime(dateStr, '%Y-%m-%d %H:%M:%S') #UTC time
                        localDateObj = pytz.utc.localize(dateObj).astimezone(timezoneLocal) #adjust to local timezone
                        username = match.group(2)
                        message = match.group(3)

                        id = localDateObj.strftime('%Y-%m-%d')
                        if not id in chat:
                            chat[id] = []

                        #save message (in memory) -> approx. 1.6GB RAM (!!!)
                        chat[id].append('[%s] <%s> %s' % (localDateObj.strftime('%H:%M:%S'), username, message))

        currentDate = currentDate + timedelta(days=1)

    #write all messages to files -> approx. 800MB
    for key, value in chat.items():
        fd = codecs.open(OUTPUT_FOLDER + '/' + key + '.txt', 'w', encoding='utf8')
        for line in value:
            fd.write(line + '\n')
        fd.close()
