import pandas as pd
import os
from datetime import datetime

def load(dir, limit=None):
    #read live files
    liveTmp = []
    files = sorted(os.listdir(dir))
    for filename in files:
        if filename.endswith('.csv'):
            filepath = os.path.join(dir, filename)
            
            #read file
            openfile = open(filepath)
            rawData = openfile.read()
            openfile.close()
            
            #process each datapoint
            splitRawData = rawData.split('\n')
            for line in splitRawData:
                split = line.split(',')
                if len(split) == 2:
                    timestamp = int(split[0])
                    viewers = int(split[1])
                    datetimeObj = datetime.fromtimestamp(timestamp)

                    liveTmp.append((datetimeObj, viewers))

    #create data frame
    columns = ['datetime', 'viewers']
    live = pd.DataFrame(liveTmp, columns=columns)

    #index
    live.set_index(live['datetime'], inplace=True)

    #sort
    live.sort_index(inplace=True)

    #resample
    live = live.resample('1min').mean().fillna(method='pad', limit=5)

    return live
