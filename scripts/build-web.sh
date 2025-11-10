#!/usr/bin/env bash

#
# This script is usually run by the justfile
#

is_release="$1"
target=wasm32-unknown-unknown
target_dir="web-target"

release_arg=""
build_kind="debug"
dist_dir="$target_dir/wasm-debug"

if [ "$is_release" == "release" ]; then
    release_arg="--release"
    build_kind="release"
    dist_dir="$target_dir/wasm-release"
fi

export CARGO_TARGET_DIR=$target_dir

set -ex

cargo build --target $target $release_arg
rm -rf $dist_dir
mkdir -p $dist_dir
wasm-bindgen --out-dir $dist_dir --target web --no-typescript $target_dir/$target/$build_kind/fishy.wasm

# Copy HTML and PWA resources
cp wasm_resources/index.html $dist_dir/index.html
cp wasm_resources/manifest.json $dist_dir/manifest.json
cp wasm_resources/service-worker.js $dist_dir/service-worker.js
cp wasm_resources/install-prompt.js $dist_dir/install-prompt.js
cp wasm_resources/pwa-styles.css $dist_dir/pwa-styles.css

# Copy icons if they exist (create placeholder icons if needed)
if [ -d "wasm_resources/icons" ]; then
    cp -r wasm_resources/icons $dist_dir/icons
else
    echo "Note: PWA icons not found. Create icons in wasm_resources/icons/"
fi

# Copy screenshots if they exist
if [ -d "wasm_resources/screenshots" ]; then
    cp -r wasm_resources/screenshots $dist_dir/screenshots
fi

# Copy game assets
cp -r assets $dist_dir
