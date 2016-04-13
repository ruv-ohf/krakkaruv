#!/bin/bash
cd /var/www/www.ruv.is/
log="/var/tmp/unpublish-shows.log"
errorlog="/var/tmp/unpublish-shows-error.log"

drush ruv-unpublish-eps >>$log 2>>$errorlog
drush ruv-unpublish-shows >>$log 2>>$errorlog