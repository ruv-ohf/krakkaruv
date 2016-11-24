#!/bin/bash
cd /var/www/www.krakkaruv.is/
log="/var/tmp/ruv-make-sipvefur.log"
errorlog="/var/tmp/ruv-make-sipvefur.log"

drush cc drush
drush ruv-make-sipvefur >>$log 2>>$errorlog
