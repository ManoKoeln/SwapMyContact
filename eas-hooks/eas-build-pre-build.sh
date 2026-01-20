#!/usr/bin/env bash

# Read version info from app.json
VERSION=$(node -e "console.log(require('./app.json').expo.version)")
VERSION_CODE=$(node -e "console.log(require('./app.json').expo.android.versionCode)")

echo "Setting Android version to $VERSION ($VERSION_CODE)"

# Update build.gradle to use versionCode from app.json
sed -i.bak "/def appVersion = /a\\
def appVersionCode = appJson.expo.android.versionCode" android/app/build.gradle

sed -i.bak "s/versionName appVersion/versionCode appVersionCode\\n        versionName appVersion/" android/app/build.gradle

echo "Android version configured successfully"
