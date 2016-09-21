#!/usr/bin/env python

from shutil import copyfile
import os
import re

REPO_FOLDER = '/home/marcel/Development/RBTVChatLogs'
OUTPUT_FOLDER = '/home/marcel/Development/rbtvdata/chat'

if __name__ == "__main__":
    exp = re.compile("\d\d\d\d")

    #year
    for year in os.listdir(REPO_FOLDER):
        yearPath = os.path.join(REPO_FOLDER, year)
        if os.path.isdir(yearPath) and exp.match(year):
            #month
            for month in os.listdir(yearPath):
                monthPath = os.path.join(yearPath, month)
                if os.path.isdir(monthPath):
                    #day
                    for day in os.listdir(monthPath):
                        dayPath = os.path.join(monthPath, day)
                        day = os.path.splitext(day)[0]
                        if os.path.isfile(dayPath):
                            src = dayPath
                            dst = os.path.join(OUTPUT_FOLDER, year + '-' + month + '-' + day + '.txt')
                            copyfile(src, dst)
