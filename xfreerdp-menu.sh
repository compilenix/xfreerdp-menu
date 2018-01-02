#!/bin/sh

node $(dirname $(ls -l "${BASH_SOURCE[0]}" | awk '{print $NF}'))/Index.js
