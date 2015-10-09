#!/bin/bash
cd /var/www/www.ruv.is/
log="/var/tmp/ras2-feed.log"
errorlog="/var/tmp/ras2-feed-error.log"

drush ruv-feed ras2 >>$log 2>>$errorlog