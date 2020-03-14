#!/bin/sh
dir=$(dirname $(ls -l "${BASH_SOURCE[0]}" | awk '{print $NF}'))

node "${dir}/index.js" list | \
    dmenu -l 100 -i | \
    xargs -0 node "${dir}/index.js" run
