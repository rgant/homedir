#!/bin/sh

set -e;

if [ $# != 1 ]; then
	cat >&2 <<EOF
Use gnupg to decrypt a gpg file.
Usage: $0 FILENAME

EOF
	exit 1;
fi

gpg --decrypt "$1";
