#!/bin/bash

git submodule update --init
if [ -f slickgrid/slick.grid.js ]; then
  cd slickgrid
  if ! patch -R -p1 -s -f --dry-run < ../slickgrid-set-focus.patch >/dev/null 2>&1; then
    patch -N -p1 -s -f < ../slickgrid-set-focus.patch >/dev/null 2>&1
  fi
fi


