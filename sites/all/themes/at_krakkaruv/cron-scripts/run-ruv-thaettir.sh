#!/bin/bash
cd /var/www/www.ruv.is/
log="/var/tmp/thaettir-feed.log"
errorlog="/var/tmp/thaettir--feed-error.log"

drush ruv-feed thaettir-ruv >>$log 2>>$errorlog
drush ruv-feed thaettir-ras1 >>$log 2>>$errorlog
drush ruv-feed thaettir-ras2 >>$log 2>>$errorlog