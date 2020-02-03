#!/bin/bash

FAT_PINK="\[\e[1;35m\]"
GIT_YELLOW="\[\e[0;33m\]"
NORMAL="\[\e[m\]"
PS1="${FAT_PINK}Service A${NORMAL}$GIT_YELLOW"'$(__git_ps1 " (%s)")'" $FAT_PINK$ $NORMAL"

