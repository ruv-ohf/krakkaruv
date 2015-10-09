#!/bin/bash
cd /var/www/www.ruv.is/
log="/var/tmp/ras1-feed.log"
errorlog="/var/tmp/ras1-feed-error.log"

drush ruv-feed ras1 >>$log 2>>$errorlog