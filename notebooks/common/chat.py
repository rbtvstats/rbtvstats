from datetime import datetime
from multiprocessing.dummy import Pool as ThreadPool
import pandas as pd
import glob
import itertools
import os

def loadFile(filepath):
    dateStr = os.path.basename(filepath).rstrip('.txt')
    dateObj = datetime.strptime(dateStr, '%Y-%m-%d').date()

    #read file
    openfile = open(filepath)
    rawData = openfile.read()
    openfile.close()

    #process each chat message
    chatTmp = []
    splitRawData = rawData.split('\n')
    for line in splitRawData:
        if len(line) > 12:
            timeStr = line[1:9]
            username = line[12:line.index('>')]
            message = line[line.index('>') + 2:]
            datetimeObj = datetime(dateObj.year, dateObj.month, dateObj.day, int(timeStr[0:2]), int(timeStr[3:5]), int(timeStr[6:8]))

        chatTmp.append((datetimeObj, username, message))

    return chatTmp

def load(dir):
    files = sorted(glob.glob(os.path.join(dir, '*.txt')))
    pool = ThreadPool()
    results = pool.map(loadFile, files)

    pool.close()
    pool.join()

    chatTmp = list(itertools.chain.from_iterable(results))

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
