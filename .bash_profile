# This file is sourced by login shells. It should contain commands that need to be run only once,
# such as setting environment variables that apply to all processes started from this shell.
# It also sources .bashrc for interactive shell configurations.

#### Settings
shopt -s cmdhist
shopt -s globstar
# shopt -s histappend # Fancy bashrc_Apple_Terminal already handles this.

GPG_TTY=$(tty)
export HISTCONTROL=ignoreboth:erasedups
export HISTFILESIZE=50000
export HISTSIZE=50000
PROMPT_DIRTRIM=2 # Automatically trim long paths in the prompt (requires Bash 4.x)
PROMPT_COMMAND=('history -a' "${PROMPT_COMMAND[@]}") # Fancy bashrc_Apple_Terminal makes this safe for multiple Terminals

export CLICOLOR=1
export EDITOR=nano
export ESLINT_D_LOCAL_ESLINT_ONLY=true
export DFT_BACKGROUND=light
export GIT_OPTIONAL_LOCKS=0
export GIT_PS1_SHOWCOLORHINTS=1
export GIT_PS1_SHOWDIRTYSTATE=1
export GIT_PS1_SHOWSTASHSTATE=1
export GPG_TTY
export GREP_OPTIONS='--color=auto --no-messages'
export NODE_OPTIONS='--max-old-space-size=8192'
export NPM_CONFIG_SAVE=1
export PATH="/Users/rgant/bin:/Users/rgant/.local/bin:/opt/homebrew/opt/libpq/bin:/opt/homebrew/opt/dotnet@8/bin:/Users/rgant/go/bin:${PATH}:."
export PIP_REQUIRE_VIRTUALENV=true
export PYENCHANT_LIBRARY_PATH=/opt/homebrew/lib/libenchant-2.2.dylib
export PYTHONSTARTUP="$HOME/.pythonrc.py"
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=${OPENSSL_PREFIX}"
# Force per shell history files from /etc/bashrc_Apple_Terminal even though we have histappend enabled.
export SHELL_SESSION_HISTORY=1

# Homebrew
if [[ -f /opt/homebrew/bin/brew ]]; then
	eval "$(/opt/homebrew/bin/brew shellenv)"
fi

if [ -s "${HOMEBREW_PREFIX}/opt/nvm/nvm.sh" ]; then
	# shellcheck disable=SC1091
	source "${HOMEBREW_PREFIX}/opt/nvm/nvm.sh"
fi

if command -v pyenv 1> /dev/null 2>&1; then
	eval "$(pyenv init -)"
	# Homebrew has a messed up python right now. Might need to try a clean install of everything. I've already tried uninstalling and installing python and s3cmd.
	# Fixes this error when running s3cmd:
	# ERROR: SSL certificate verification failure: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1028)
	SSL_CERT_FILE=$(python3 -m certifi)
	export SSL_CERT_FILE
fi

if command -v rbenv 1> /dev/null 2>&1; then
	eval "$(rbenv init -)"
fi

if [ -s "${HOMEBREW_PREFIX}/share/google-cloud-sdk/path.bash.inc" ]; then
	# shellcheck disable=SC1091
	source "${HOMEBREW_PREFIX}/share/google-cloud-sdk/path.bash.inc"
fi

# Use bash-completion, if available (after intializing the commands!)
if [[ -r "${HOMEBREW_PREFIX}/etc/profile.d/bash_completion.sh" ]]; then
	export BASH_COMPLETION_COMPAT_DIR="${HOMEBREW_PREFIX}/etc/bash_completion.d"
	# shellcheck disable=SC1091
	source "${HOMEBREW_PREFIX}/etc/profile.d/bash_completion.sh"
fi

# Source .bashrc for interactive shell settings
if [ -t 0 ] && [[ -f ~/.bashrc ]]; then
    source ~/.bashrc
fi
