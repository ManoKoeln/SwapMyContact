#!/bin/bash
set -e

echo "Building React Native libraries with 16 KB page size support..."

export ANDROID_NDK_HOME="/Users/matthias/Library/Android/sdk/ndk/27.0.12077973"
export ANDROID_SDK_ROOT="/Users/matthias/Library/Android/sdk"

# Set linker flags for 16 KB page size
export LDFLAGS="-Wl,-z,max-page-size=16384"
export CFLAGS="-Wl,-z,max-page-size=16384"
export CXXFLAGS="-Wl,-z,max-page-size=16384"

RN_DIR="/Users/matthias/Projekte/SwapMyContact/node_modules/react-native"

# Find all prebuilt .so files
echo "Removing prebuilt React Native libraries..."
find "$RN_DIR/ReactAndroid/src/main/jni/first-party" -name "*.so" -type f -delete 2>/dev/null || true
find "$RN_DIR/ReactAndroid/src/main/jniLibs" -name "*.so" -type f -delete 2>/dev/null || true

echo "React Native will be rebuilt from source with 16 KB flags"
