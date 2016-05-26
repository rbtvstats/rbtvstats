#!/bin/bash

mkdir -p data

wd=`pwd`
ln -s $wd/data $wd/viewer/app/data
ln -s $wd/data $wd/crawler/app/data
