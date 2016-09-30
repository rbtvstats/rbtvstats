import pandas as pd
import re
import os
from datetime import datetime

def load(dir, start=None, end=None):
    #read chat files
    chatTmp = []
    exp = re.compile('\[(.+?)\] <(.+?)> (.+)?')
    files = sorted(os.listdir(dir))
    for filename in files:
        if filename.endswith('.txt'):
            filepath = os.path.join(dir, filename)
            dateStr = filename.rstrip('.txt')
            dateObj = datetime.strptime(dateStr, '%Y-%m-%d').date()

            if (start is None or dateObj >= start) and (end is None or dateObj <= end):
                #read file
                openfile = open(filepath)
                rawData = openfile.read()
                openfile.close()

                #process each chat message
                splitRawData = rawData.split('\n')
                for line in splitRawData:
                    match = exp.match(line)
                    if match is not None:
                        timeStr = match.group(1)
                        username = match.group(2)
                        message = match.group(3)
                        datetimeObj = datetime.strptime(dateStr + ' ' + timeStr, '%Y-%m-%d %H:%M:%S')

                        chatTmp.append((datetimeObj, username, message))

    #create data frame
    columns = ['datetime', 'username', 'message']
    chat = pd.DataFrame(chatTmp, columns=columns)

    #index
    chat.set_index(chat['datetime'], inplace=True)

    #remove columns
    chat.drop('datetime', axis=1, inplace=True)

    #sort
    chat.sort_index(inplace=True)

    return chat
