#!/bin/sh

CHAT_REPO_DIR='/home/marcel/RBTVChatLogs/'
CHAT_DATA_DIR='/home/marcel/rbtvdata/chat/'

#pull chat data
cd $CHAT_REPO_DIR
git pull

#copy chat data and adjust filename
res=`find . -not -iwholename '*.git*' -type f -name '*.txt'`
echo "$res" | 
while read src; do
    dst="$CHAT_DATA_DIR`echo "$src" | sed -r 's/.+?\/([0-9]{4})\/([0-9]{2})\/([0-9]{2}).txt/\1-\2-\3.txt/g'`"
    cp $src $dst
done
