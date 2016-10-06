import pandas as pd
import datetime
import json
import os

def load(dir):
    #read video files
    videosTmp = []
    videosHostsTmp = []
    videosShowsTmp = []
    files = sorted(os.listdir(dir))
    for filename in files:
        if filename != 'metadata.json':
            filepath = os.path.join(dir, filename)
            
            #read file
            openfile = open(filepath)
            dataJson = json.load(openfile)
            openfile.close()
            
            #process each video
            for video in dataJson:
                for host in video['hosts']:
                    videosHostsTmp.append((video['id'], host))

                for show in video['shows']:
                    videosShowsTmp.append((video['id'], show))

                videosTmp.append((video['id'], 
                                  video['title'], 
                                  video['channel'], 
                                  datetime.timedelta(seconds=video['length']), 
                                  datetime.datetime.fromtimestamp(video['published']), 
                                  video['stats']['viewCount'], 
                                  video['stats']['likeCount'], 
                                  video['stats']['dislikeCount'], 
                                  video['stats']['favoriteCount'], 
                                  video['stats']['commentCount']))

    #videos dataframe
    videos = pd.DataFrame(videosTmp, columns=['id', 
                                              'title', 
                                              'channel', 
                                              'length', 
                                              'published', 
                                              'viewCount', 
                                              'likeCount', 
                                              'dislikeCount', 
                                              'favoriteCount', 
                                              'commentCount'])
    videos.set_index(videos['id'], inplace=True)
    videos.drop('id', axis=1, inplace=True)
    videos.sort_values('published', inplace=True)

    #videosHosts dataframe
    videosHosts = pd.DataFrame(videosHostsTmp, columns=['id', 
                                                        'host'])
    videosHosts.set_index(videosHosts['id'], inplace=True)
    videosHosts.drop('id', axis=1, inplace=True)

    #videosShows dataframe
    videosShows = pd.DataFrame(videosShowsTmp, columns=['id', 
                                                        'show'])
    videosShows.set_index(videosShows['id'], inplace=True)
    videosShows.drop('id', axis=1, inplace=True)

    return videos, videosHosts, videosShows
