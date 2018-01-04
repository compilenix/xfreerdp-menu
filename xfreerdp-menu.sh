#!/bin/sh
dir=$(dirname $(ls -l "${BASH_SOURCE[0]}" | awk '{print $NF}'))

node "${dir}/Index.js"
