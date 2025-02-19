""" Rob's PythonRC file. """
import logging
import os
from pprint import pprint
import typing

class RainbowLogFormatter(logging.Formatter):
    """ Adds a new key to the format string: %(colorlevelname)s. """
    # http://kishorelive.com/2011/12/05/printing-colors-in-the-terminal/
    levelcolors: dict[str, str] = {
        'CRITICAL' : '\033[4;31mCRITICAL\033[0m',  # Underlined Red Text
        'ERROR' : '\033[1;31mERROR\033[0m',        # Bold Red Text
        'WARN' : '\033[1;33mWARNING\033[0m',       # Bold Yellow Text
        'WARNING' : '\033[1;33mWARNING\033[0m',    # Bold Yellow Text
        'INFO' : '\033[0;32mINFO\033[0m',          # Light Green Text
        'DEBUG' : '\033[0;34mDEBUG\033[0m',        # Light Blue Text
        'NOTSET' : '\033[1:30mNOTSET\033[0m'       # Bold Black Text
    }

    @typing.override
    def format(self, record: logging.LogRecord) -> str:
        """ Adds the new colorlevelname to record and then calls the super. """
        record.colorlevelname = self.levelcolors[record.levelname]
        # Python2.6 has an old style class for the root logging.Formatter so cannot use super()
        # return super(RainbowLogFormatter, self).format(record)
        return logging.Formatter.format(self, record)


def init_logging() -> None:
    """ Sets Colorful logging for root logger. """
    frmt = '%(colorlevelname)s:%(module)s:%(funcName)s:%(lineno)d:%(message)s'
    formatter = RainbowLogFormatter(frmt)
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.DEBUG)

def pp(
    object: object,
    stream: typing.IO[str] | None = None,
    indent: int = 1,
    width: int | None = None,
    depth: int | None = None,
    compact: bool = False,
):
    """ Set the width automatically when pprint-ing. """
    if width is None:
        terminal_size = os.get_terminal_size()
        width = terminal_size.columns - 5 if terminal_size.columns > 80 else terminal_size.columns

    pprint(object, stream=stream, indent=indent, width=width, depth=depth, compact=compact)

init_logging()

del init_logging

# If there is a local "console" file when python is invoked then run it in this scope.
try:
    exec(open('console.py').read())  # pylint: disable=exec-used
except IOError:
    pass
