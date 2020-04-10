#!/bin/sh
dir=$(dirname $(ls -l "${BASH_SOURCE[0]}" | awk '{print $NF}'))
pushd $dir
~/.fnm/fnm use
node "index.js" list | \
    dmenu -l 100 -i | \
    xargs -0 node "index.js" run
