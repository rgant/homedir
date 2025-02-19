#!/usr/bin/env bash
# https://stackoverflow.com/a/54920339/41908

iterations=$1
shift
(($# > 0)) || return                   # bail if no command given
for ((i = 0; i < iterations; i++)); do
  { time -p "$@" &>/dev/null; } 2>&1 # ignore the output of the command but collect time's output in stdout

  if [ $? -ne 0 ]; then
    echo 'Command Error' >&2
  fi
done | awk '
  /^real/ { real = real + $2; nr++ }
  /^user/ { user = user + $2; nu++ }
  /^sys/  { sys  = sys  + $2; ns++}
  END    {
    if (nr>0) printf("real %f\n", real/nr);
    if (nu>0) printf("user %f\n", user/nu);
    if (ns>0) printf("sys %f\n",  sys/ns)
  }'
