""" Rob's PythonRC file. """
# Code in py3-ish mode
from __future__ import (absolute_import, division, print_function, unicode_literals)
try:
    from builtins import *  # pylint: disable=unused-wildcard-import,redefined-builtin,wildcard-import
except ImportError:
    import sys
    print('WARNING: Cannot Load builtins for py3 compatibility.', file=sys.stderr)

import logging

from pprint import pprint as pp  # pylint: disable=unused-import


class RainbowLogFormatter(logging.Formatter):
    """ Adds a new key to the format string: %(colorlevelname)s. """
    # http://kishorelive.com/2011/12/05/printing-colors-in-the-terminal/
    levelcolors = {
        'CRITICAL' : '\033[4;31mCRITICAL\033[0m',  # Underlined Red Text
        'ERROR' : '\033[1;31mERROR\033[0m',        # Bold Red Text
        'WARN' : '\033[1;33mWARNING\033[0m',       # Bold Yellow Text
        'WARNING' : '\033[1;33mWARNING\033[0m',    # Bold Yellow Text
        'INFO' : '\033[0;32mINFO\033[0m',          # Light Green Text
        'DEBUG' : '\033[0;34mDEBUG\033[0m',        # Light Blue Text
        'NOTSET' : '\033[1:30mNOTSET\033[0m'       # Bold Black Text
    }

    def format(self, record):
        """ Adds the new colorlevelname to record and then calls the super. """
        record.colorlevelname = self.levelcolors[record.levelname]
        # Python2.6 has an old style class for the root logging.Formatter so cannot use super()
        # return super(RainbowLogFormatter, self).format(record)
        return logging.Formatter.format(self, record)

def init_logging():
    """ Sets Colorful logging for root logger. """
    frmt = '%(colorlevelname)s:%(module)s:%(funcName)s:%(lineno)d:%(message)s'
    formatter = RainbowLogFormatter(frmt)
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    root_logger = logging.getLogger()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.DEBUG)

def python_history():
    """ Setup python cli history and auto complete """
    try:
        __IPYTHON__
    except NameError:
        histfilename = '.pythonhistory'
    else:
        histfilename = '.ipythonhistory'

    try:
        import atexit
        import os
        import readline
        import rlcompleter
    except ImportError:
        print('Python shell enhancement modules not available.')
    else:
        histfile = os.path.join(os.environ['HOME'], histfilename)
        if 'libedit' in readline.__doc__:
            readline.parse_and_bind('bind ^I rl_complete')
        else:
            readline.parse_and_bind('tab: complete')
        if os.path.isfile(histfile):
            try:
                readline.read_history_file(histfile)
            except IOError:
                pass
        atexit.register(readline.write_history_file, histfile)
        readline.set_history_length(1000)
        del atexit, os, readline, rlcompleter
        print('Python shell history and tab completion are enabled.')

def set_prompt():
    """ Colorful prompt """
    import sys  # pylint: disable=redefined-outer-name
    sys.ps1 = '\001\033[1;32m\002>>> \001\033[0m\002'
    sys.ps2 = '\001\033[1;32m\002... \001\033[0m\002'
    del sys

init_logging()
python_history()
set_prompt()

del init_logging, python_history, set_prompt

# If there is a local "console" file when python is invoked then run it in this scope.
try:
    exec(open('console.py').read())  # pylint: disable=exec-used
except IOError:
    pass
