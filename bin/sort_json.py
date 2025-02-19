#!/usr/bin/env python
"""
Sort and pretty print JSON file inplace!

This could be done with `json.tool` and an alias:

```sh
alias sort_json='python -m json.tool --indent 2 --sort-keys'
```

But it is tricky to do that on a file in place.

"""
import argparse
import json
import logging
import sys


class ArgsNamespace(argparse.Namespace):
    jsonfile: str | int = ''


def process(filename: str | int) -> None:
    """
    Opens filename and loads JSON contents. Then opens for writing and dumps pretty JSON content.
    """
    with open(filename, encoding='utf-8') as json_file:
        data = json.load(json_file)   # pyright:ignore [reportAny]

    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(
            data, json_file, ensure_ascii=False, indent=2, separators=(',', ': '), sort_keys=True
        )
        _ = json_file.write('\n')


def main() -> None:
    """Parse command line arguments and then sort the JSON file."""
    parser = argparse.ArgumentParser(description=__doc__)
    _ = parser.add_argument(
        'jsonfile', nargs='?', default=sys.stdin.fileno(), help='JSON file to sort and pretty'
    )
    args = parser.parse_args(namespace=ArgsNamespace())

    process(args.jsonfile)


if __name__ == '__main__':
    logging.basicConfig()#level=logging.DEBUG)
    try:
        main()
    except (SystemExit, KeyboardInterrupt):
        logging.info('Exiting')
        raise
    except:
        logging.exception('Uncaught Exception')
        raise
