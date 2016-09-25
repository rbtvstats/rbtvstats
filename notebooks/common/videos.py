import pandas as pd
import datetime
import json

def load(fielpath):
    #read video file
    openfile = open(fielpath)
    dataJson = json.load(openfile)
    openfile.close()

    videosTmp = []
    videosHostsTmp = []
    videosShowsTmp = []
    for video in dataJson.itervalues():
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
