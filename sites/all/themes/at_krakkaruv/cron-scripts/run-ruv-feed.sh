#!/bin/bash
cd /var/www/www.ruv.is/

log="/var/tmp/ruv-feed.log"
errorlog="/var/tmp/ruv-feed-error.log"

drush ruv-feed ruv >>$log 2>>$errorlog