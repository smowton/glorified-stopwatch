#!/bin/bash

if [ $# != "1" ]; then
  echo "Usage: make_relase.sh out.zip"
  exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR
zip -r $1 download/ index.html stopwatch.* slickgrid/
