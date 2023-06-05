#!/bin/sh

set -e;

if [ $# != 1 ]; then
	cat >&2 <<EOF
Save an encrypted copy of a file using gnupgp.
Usage: $0 FILENAME

EOF
	exit 1;
fi

gpg --encrypt --recipient "J Rob Gant <rgant@alum.wpi.edu>" --symmetric "$@";
