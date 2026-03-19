#!/bin/sh

if [ -z "$husky_skip_init" ]; then
  husky_skip_init=1
  export husky_skip_init

  readonly hook_name="$(basename -- "$0")"

  if [ "$HUSKY" = "0" ]; then
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    . ~/.huskyrc
  fi

  sh -e "$0" "$@"
  exit $?
fi
