#!/bin/sh
dir=$(dirname $(ls -l "${BASH_SOURCE[0]}" | awk '{print $NF}'))

node "${dir}/Index.js" list | \
    dmenu -l 100 -i | \
    xargs -0 node "${dir}/Index.js" run
