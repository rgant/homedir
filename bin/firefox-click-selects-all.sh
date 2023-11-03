#!/bin/sh

# Based upon https://superuser.com/a/1559926/16336

set -e

OMNI_PATH=/Applications/Firefox.app/Contents/Resources/browser/omni.ja
DIR_PATH="$(dirname $OMNI_PATH)";
BACKUP_PATH="$HOME/backups/$DIR_PATH"

osascript -e 'quit application "Firefox"'

# Backup current omni.ja
mkdir -p "$BACKUP_PATH"
cp -af $OMNI_PATH "$BACKUP_PATH"

# Create a working folder
cd /tmp
mkdir -p omni
unzip -d omni -q $OMNI_PATH

cd omni
sed -e 's/this\._preventClickSelectsAll = this\.focused;/this._preventClickSelectsAll = true;/' -i '' modules/UrlbarInput.sys.mjs
sed -e 's/this\._preventClickSelectsAll = this\._textbox\.focused;/this._preventClickSelectsAll = true;/' -i '' chrome/browser/content/browser/search/searchbar.js

zip -0DXqr omni.ja ./*
chown rgant:admin omni.ja
# Terminal.app needs Full Disk Access in System Settings
mv -f omni.ja $OMNI_PATH

# Cleanup
cd ..
rm -r omni

# Clear the Firefox startup cache
touch "$DIR_PATH/.purgecaches"
