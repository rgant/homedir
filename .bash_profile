#### Settings
shopt -s cmdhist
shopt -s globstar
# shopt -s histappend # Fancy bashrc_Apple_Terminal already handles this.

# Set C-w to delete words based on unix filename rules
stty werase undef
bind '\C-w:unix-filename-rubout'

#txtund=$(tput sgr 0 1) # Underline
txtbld=$(tput bold) # Bold
#txtblk=$(tput setaf 0) # Black
txtred=$(tput setaf 1) # Red
txtgrn=$(tput setaf 2) # Green
#txtylw=$(tput setaf 3) # Yellow
txtblu=$(tput setaf 4) # Blue
#txtpur=$(tput setaf 5) # Purple
#txtcyn=$(tput setaf 6) # Cyan
#txtwht=$(tput setaf 7) # White
txtrst=$(tput sgr0) # Text reset

GPG_TTY=$(tty)
# If I load a sub shell this prevents it from defaulting to 500 history items.
export HISTCONTROL=ignoreboth:erasedups
export HISTFILESIZE=50000
export HISTSIZE=50000
PROMPT_DIRTRIM=2 # Automatically trim long paths in the prompt (requires Bash 4.x)
PROMPT_COMMAND=('history -a' "${PROMPT_COMMAND[@]}") # Fancy bashrc_Apple_Terminal makes this safe for multiple Terminals

export CLICOLOR=1
export EDITOR=nano
export ESLINT_D_LOCAL_ESLINT_ONLY=true
export GIT_OPTIONAL_LOCKS=0
export GIT_PS1_SHOWCOLORHINTS=1
export GIT_PS1_SHOWDIRTYSTATE=1
export GIT_PS1_SHOWSTASHSTATE=1
export GPG_TTY
export GREP_OPTIONS='--color=auto --no-messages'
export NODE_OPTIONS='--max-old-space-size=8192'
export NPM_CONFIG_SAVE=1
export PATH="/Users/rgant/bin:/Users/rgant/.local/bin:/opt/homebrew/opt/libpq/bin:/Users/rgant/go/bin:${PATH}:."
export PIP_REQUIRE_VIRTUALENV=true
export PYENCHANT_LIBRARY_PATH=/opt/homebrew/lib/libenchant-2.2.dylib
export PYTHONSTARTUP="$HOME/.pythonrc.py"
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=${OPENSSL_PREFIX}"
# Force per shell history files from /etc/bashrc_Apple_Terminal even though we have histappend enabled.
export SHELL_SESSION_HISTORY=1

#### Functions

# Check to see if it's time to display system status again. Don't display on multiple recent shells
__init_status() {
	local watchfile="$HOME/.hrly_info"
	local hr
	hr=$(date +'%F %H')
	# shellcheck disable=SC2143
	if [[ ! -f "$watchfile" || ! $(grep "$hr" "$watchfile") ]]; then
		echo "$hr" > "$watchfile"
		sys_status
	fi
}

# Trap to kill pending jobs on exit shell with ^d
__kill_jobs() {
	local theid
	for theid in $(jobs -p); do
		local gid
		gid=$(ps -o pgid= -p "$theid")
		pkill -g "$gid"
	done
}

# Change prompt to red when last command errored
__status_code() {
	local status="$?"
	if [ $status != 0 ]; then
		echo "$txtbld$txtred"
	fi
}

bgc() {
	local color
	case $1 in
		green)
			color='{57825, 65021, 56540}'
			;;
		yellow | *)
			color='{65535, 65232, 53533}'
			;;
	esac
	osascript -e 'tell application "Terminal" to set background color of selected tab of the front window to '"${color}"
}

# Create a data URL from a file
# From: https://github.com/mathiasbynens/dotfiles/blob/8cf8c1c8315a6349224eeb3ecc033d469456025f/.functions#L69
dataurl() {
	if [ "$#" -ne 1 ]; then
		echo "Usage: ${FUNCNAME[0]} /path/to/datafile" >&2
		return 1
	fi

	local mimeType
	mimeType=$(file -b --mime-type "$1")
	if [[ $mimeType == text/* ]]; then
		mimeType="${mimeType};charset=utf-8"
	fi
	echo "data:${mimeType};base64,$(openssl base64 -in "$1" | tr -d '\n')"
}

develop() {
	if [ "$#" -ne 1 ]; then
		echo "Usage: ${FUNCNAME[0]} /path/to/project" >&2
		return 1
	fi

	cd "$1" || return 2
	tabname "$(basename "$PWD")"
	if [ -f .nvmrc ]; then
		nvm use
	fi
	if [ -f .venv/bin/activate ]; then
		# shellcheck disable=SC1091
		source .venv/bin/activate
	fi
	if [ -d node_modules/.bin/ ]; then
		export PATH="$PWD/node_modules/.bin:${PATH}"
	fi
	# https://www.derekgourlay.com/blog/git-when-to-merge-vs-when-to-rebase/
	git fetch --all
	git status
}

diff() {
	/usr/bin/diff --unified "$@" | colordiff | "${HOMEBREW_PREFIX}/share/git-core/contrib/diff-highlight/diff-highlight"
}

dl() {
	if [ "$#" -lt 1 ]; then
		echo "Usage: ${FUNCNAME[0]} URL_TO_DOWNLOAD [DIR_OR_NAME_TO_SAVE_AS]" >&2
		return 1
	fi

	if [ -n "$2" ]; then
		# Download file into specified directory
		if [ -d "$2" ]; then
			cd "$2" || return 2
		# Download the file to specified name
		elif [ ! -e "$2" ]; then
			curl --location --output "$2" "$1"
			return
		fi
	fi

	# Download the file using the remote name
	curl --location --remote-name "$1"

	if [ -n "$2" ]; then
		cd - || return 3
	fi
}

# Find Windows Line Endings files in git repo, ignoring any gitignored files.
fixwin() {
	local thefile
	while IFS= read -r -d '' thefile; do
		if file "$thefile" | grep -q 'ASCII text, with CRLF line terminators' && ! git check-ignore -q "$thefile"; then
			echo -n "Converting $thefile from crlf to "
			sed -e $'s/\r$//' -i '' "$thefile"
			echo 'lf'
		fi
		# <() is command substitution when a pipe cannot be used.
	done < <(find "${1-./}" -name '.git' -prune -o -name 'node_modules' -prune -o -name 'bower_components' -prune -o -type f -print0)
}

gitbranchgrep() {
	local grepargs=()
	local pathspecs=()

	while test $# -gt 0; do
		case $1 in
			--)
				shift
				pathspecs=("$@")
				;;
			*)
				grepargs+=("$1")
				;;
		esac
		shift
	done

	git for-each-ref --format='%(refname:short)' refs/heads/ | xargs -I '{}' git grep "${grepargs[@]}" '{}' -- "${pathspecs[@]}"
}

gpip() {
	PIP_REQUIRE_VIRTUALENV=false pip "$@"
}

man() {
	if [ "$#" -lt 1 ]; then
		echo "Usage: ${FUNCNAME[0]} [section number] command_name" >&2
		return 1
	fi

	if [ $# -eq 1 ]; then
		open "x-man-page://$1"
	elif [ $# -eq 2 ]; then
		open "x-man-page://$1/$2"
	fi
}

md5() { /sbin/md5 "$@" | sed -e's/^MD5 (\(.*\)) = \([0-9a-f]*\)$/\2 \1/' | sort; }

pdfmerge() {
	if [ "$#" -lt 3 ]; then
		echo "Usage: ${FUNCNAME[0]} output.pdf 1.pdf 2.pdf ... N.pdf" >&2
		return 1
	fi

	local outpdf="$1"
	shift
	gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outpdf}" "$@"
}

pdfunprotect() {
	if [ "$#" -ne 1 ]; then
		echo "Usage: ${FUNCNAME[0]} tounlock.pdf" >&2
		return 1
	fi

	local tmppdf
	tmppdf=$(mktemp -t 'pdf')
	gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${tmppdf}" -f "$1"
	if [ -s "${tmppdf}" ]; then
		mv "${tmppdf}" "$1"
	fi
}

projfind() {
	local extraargs=()
	local searchpath=()

	while test $# -gt 0; do
		case $1 in
			-*)
				extraargs+=("$1")
				;;
			*)
				if [ -e "$1" ]; then
					searchpath+=(-f "$1" --)
				else
					extraargs+=("$1")
				fi
				;;
		esac
		shift
	done

	if [ -z "${extraargs[0]}" ]; then
		cat >&2 << EOF
Usage: ${FUNCNAME[0]} [path ...] [-find-flags]

Recursive find of project folders that excludes .git and node_modules.

See man find for more details.

Command template:
find "PATH" -path '*/.git/*' -prune -o -path '*/node_modules/*' -prune -o FIND FLAGS
EOF
		return 1
	fi

	# set -x
	find "${searchpath[@]-./}" -path '*/.git/*' -prune \
		-o -path '*/node_modules/*' -prune \
		-o "${extraargs[@]}"
	# set +x
}

projgrep() {
	local extraargs=()
	local searchpath=()
	local pttrn

	while test $# -gt 0; do
		case $1 in
			-*)
				extraargs+=("$1")
				;;
			*)
				if [ -e "$1" ]; then
					searchpath+=("$1")
				else
					pttrn="$1"
				fi
				;;
		esac
		shift
	done

	if [ -z "${pttrn}" ]; then
		cat >&2 << EOF
Usage: ${FUNCNAME[0]} [-grep --flags] [pattern] [path ...]

Recursive grep search of project folders that excludes .git and node_modules.

See man grep for more details.

Command template:
grep -R --exclude-dir=.git --exclude-dir=build --exclude-dir=dist --exclude-dir=node_modules "GREP_FLAGS" "PTTRN" "PATH"
EOF
		return 1
	fi

	grep -R --exclude-dir=.git --exclude-dir=build --exclude-dir=dist --exclude-dir=node_modules "${extraargs[@]}" "${pttrn}" "${searchpath[@]-./}"
}

# Start an HTTP server from a directory, optionally specifying the port
servhttp() {
	local extraargs=()
	local port='8000'

	while test $# -gt 0; do
		case $1 in
			-*)
				extraargs+=("$1")
				;;
			*)
				port="$1"
				;;
		esac
		shift
	done

	if [[ ! "${extraargs[*]}" =~ '-h' ]]; then
		sleep 1 && open "http://localhost:${port}/" &
	fi
	python3 -m http.server "${extraargs[@]}" "$port"
}

ssh() {
	osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "SSH"'
	/usr/bin/ssh "$@"
	tabname
	osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "Basic"'
}

sys_status() {
	### System Status
	echo -e "${txtbld}Uptime${txtrst}"
	w

	echo -e "\\n${txtbld}Disk Usage${txtrst}"
	df -h | grep '^Filesystem\|^/' | grep --color=always ' \|9[0-9]%\|100%'

	echo -e "\\n${txtbld}Network${txtrst}"
	hostname -f
	ifconfig | grep inet | grep -v '::1\| 127\.\| fe80:\| detached\| deprecated' | cut -d' ' -f2 | sort

	local cols
	cols=$(tput cols)
	echo -ne "$txtbld"
	# shellcheck disable=SC2046
	printf '%.0s-' $(seq 1 "$cols")
	echo -e "$txtrst"
}

# Set MacOS Terminal.app tab name
tabname() {
	# call with a value to set the name, call without value to set to previous name.
	[ -n "$*" ] && terminal_tabname=$*
	[ -n "$terminal_tabname" ] && printf '\e]1;%s\a' "$terminal_tabname"
}

update_brew_install() {
	local installed
	installed=$(brew leaves | sed -e 's/^/  /' -e 's/$/ \\/' -e '$ s/ \\//' -e '1 s/^  //')
	echo "brew install ${installed}" > "${HOME}/Programming/homedir/brew-install.txt"
	local cask_installs
	cask_installs=$(brew list --cask | sed -e 's/^/  /' -e 's/$/ \\/' -e '$ s/ \\//' -e '1 s/^  //')
	echo "brew install --cask ${cask_installs}" >> "${HOME}/Programming/homedir/brew-install.txt"
}

update_npm_install() {
	local installed
	installed=$(npm list --global --depth=0 --parseable | sed -e '1d' -e 's|.*/node_modules/||' -e 's/^/  /' -e 's/$/ \\/' -e '$ s/ \\//' -e '2 s/^  //')
	echo "npm install --global ${installed}" > "${HOME}/Programming/homedir/npm-global-install.txt"
}

#### Implement configuration
# Only one trap is allowed, so must add the kill trap to the one from bashrc_Apple_Terminal
trap '__kill_jobs;shell_session_update' EXIT

# Reset Profile in case tab was opened from a different profile.
osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "Basic"'
tabname "$(hostname -s)"

# Homebrew
if [[ -f /opt/homebrew/bin/brew ]]; then
	eval "$(/opt/homebrew/bin/brew shellenv)"
fi

if [ -s "${HOMEBREW_PREFIX}/etc/bash_completion.d/git-prompt.sh" ]; then
	# Something else is already sourcing "${HOMEBREW_PREFIX}/etc/bash_completion.d/git-prompt.sh" so this does nothing
	# shellcheck disable=SC1090,SC1091,SC2086
	# source ~/bin/git-prompt.sh
	PS1="\\[$txtgrn$txtbld\\]\\h\\[$txtrst\\]:\\[$txtblu$txtbld\\]\\w\\[$txtrst\\]\$(__git_ps1)\\[\$(__status_code)\\]\$\\[$txtrst\\] "
	echo -n "$txtbld$txtred$(/usr/bin/diff --brief "${HOMEBREW_PREFIX}/etc/bash_completion.d/git-prompt.sh" ~/backups/opt/homebrew/Cellar/git/2.47.1/etc/bash_completion.d/git-prompt.sh/after | sed -e 's/$/\n/')$txtrst"
fi

if [ -s "${HOMEBREW_PREFIX}/opt/nvm/nvm.sh" ]; then
	# shellcheck disable=SC1091
	source "${HOMEBREW_PREFIX}/opt/nvm/nvm.sh"
fi

if command -v pyenv 1> /dev/null 2>&1; then
	eval "$(pyenv init -)"
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

# Only display system status if we are on a terminal
test -t 0 && __init_status

# check that my corrected script is still corrected
# https://gist.github.com/rgant/2bd867c05c534a44524c59a6da7bb29b
# https://apple.stackexchange.com/a/314363/55422
echo -n "$txtbld$txtred$(/usr/bin/diff --brief /etc/bashrc_Apple_Terminal backups/private/etc/bashrc_Apple_Terminal/after | sed -e 's/$/\n/')$txtrst"

alias cp='cp -i'
#alias cpu_temp='sudo powermetrics | grep "CPU die temperature"'
#alias dc='cd ~/Documents'
alias df='df -h'
# alias diff='diff --unified'
#alias dl='cd ~/Downloads'
alias du='du -h'
alias funcs='compgen -A function'
alias headers='curl --verbose --silent 1> /dev/null'
alias htmlgrep="find ./ -name '*.html' -print0 | xargs -0 grep"
alias modem_tunnel='ssh home -L 2000:modem.home.robgant.com:80 -N'
alias mv='mv -i'
alias myip='dig +short myip.opendns.com @resolver1.opendns.com'
alias npmg='npm --location=global'
alias path='echo -e ${PATH//:/\\n}'
alias phpgrep="find ./ -name '*.php' -print0 | xargs -0 grep"
alias pkgfix='npx sort-package-json && npx package-json-validator --warnings --recommendations'
alias prettier='prettier --ignore-path='' --config ~/Programming/.prettierrc.json'
alias pygrep="find ./ -name '*.py' -print0 | xargs -0 grep"
alias rm='rm -i'
alias router_tunnel='ssh home -L 2000:router.home.robgant.com:80 -N'
alias tsgrep="find ./ -name '*.ts' -print0 | xargs -0 grep"
alias urldecode='python3 -c "import sys,urllib.parse;print(urllib.parse.unquote(sys.argv[1]))"'
alias urlencode='python3 -c "import sys,urllib.parse;print(urllib.parse.quote_plus(sys.argv[1]))"'
alias uuid='uuidgen | tr "[:upper:]" "[:lower:]"'
alias vnc_tunnel='ssh vnctunnel -N'
alias wake_media_center='wakeonlan F0:18:98:EC:7C:70'

# Personal Projects
alias saas='develop ~/Programming/saas-api-boilerplate'
alias ninja='develop ~/Programming/rob.gant.ninja'

# Professional Projects are loaded from ~/.bash_profile.d/work.bash_profile

# Load local configurations
if [ -d ~/.bash_profile.d ]; then
	for profile in ~/.bash_profile.d/*.bash_profile; do
		# shellcheck disable=SC1090
		source "$profile"
	done
fi
