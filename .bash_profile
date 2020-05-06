#### Settings

shopt -s globstar
shopt -s histappend

#txtund=$(tput sgr 0 1) # Underline
txtbld=$(tput bold)     # Bold
#txtblk=$(tput setaf 0) # Black
txtred=$(tput setaf 1)  # Red
txtgrn=$(tput setaf 2)  # Green
#txtylw=$(tput setaf 3) # Yellow
txtblu=$(tput setaf 4)  # Blue
txtpur=$(tput setaf 5)  # Purple
#txtcyn=$(tput setaf 6) # Cyan
#txtwht=$(tput setaf 7) # White
txtrst=$(tput sgr0)     # Text reset

GPG_TTY=$(tty)
HISTCONTROL=ignoreboth:erasedups
HISTFILESIZE=20000
HISTSIZE=20000
PROMPT_DIRTRIM=2 # Automatically trim long paths in the prompt (requires Bash 4.x)

export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
export CLICOLOR=1
export EDITOR=nano
export GIT_PS1_SHOWDIRTYSTATE=1
export GIT_PS1_SHOWSTASHSTATE=1
export GPG_TTY
export GREP_OPTIONS='--color=auto --no-messages'
export PATH="/Users/rgant/bin:${PATH}:."
export PIP_REQUIRE_VIRTUALENV=true
export PIPENV_DONT_LOAD_ENV=false
# export PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
export PYTHONSTARTUP="$HOME/.pythonrc.py"
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=$(brew --prefix openssl@1.1)"

#### Functions

# Setup SSH Agent
__init_agent () {
	local SSH_ENV="$HOME/.ssh/environment";

	__start_agent () {
		/usr/bin/ssh-agent -t 14400 | sed 's/^echo/#echo/' > "${SSH_ENV}"
		chmod 600 "${SSH_ENV}"
		# shellcheck disable=SC1090,SC1091
		source "${SSH_ENV}"
	}

	if [ -f "${SSH_ENV}" ]; then
		# shellcheck disable=SC1090,SC1091
		source "${SSH_ENV}"
		echo "${SSH_AGENT_PID}" > "$HOME/.ssh/ssh-agent.pid"
		pgrep -u "$USER" -F "$HOME/.ssh/ssh-agent.pid" -q ssh-agent || {
			__start_agent
		}
	else
		__start_agent
	fi
}

# Check to see if it's time to display system status again. Don't display on multiple recent shells
__init_status () {
	local watchfile="$HOME/.hrly_info"
	local hr
	hr=$(date +"%F %H")
	# shellcheck disable=SC2143
	if [[ ! -f "$watchfile" || ! $(grep "$hr" "$watchfile") ]]; then
		echo "$hr" > "$watchfile"
		sys_status
	fi
}

# Trap to kill pending jobs on exit shell with ^d
__kill_jobs () {
	local theid
	for theid in $(jobs -p); do
		local gid
		gid=$(ps -o pgid= -p "$theid")
		pkill -g "$gid"
	done
}

# Change prompt to red when last command errored
__status_code () {
	local status="$?";
	if [ $status != 0 ]; then
		echo "$txtbld$txtred";
	fi
}

# Create a data URL from a file
# From: https://github.com/mathiasbynens/dotfiles/blob/8cf8c1c8315a6349224eeb3ecc033d469456025f/.functions#L69
dataurl () {
	local mimeType;
	mimeType=$(file -b --mime-type "$1");
	if [[ $mimeType == text/* ]]; then
		mimeType="${mimeType};charset=utf-8";
	fi
	echo "data:${mimeType};base64,$(openssl base64 -in "$1" | tr -d '\n')";
}

develop () {
	if [ "$#" -ne 1 ]; then
		echo "Usage: ${FUNCNAME[0]} /path/to/project" >&2
		return 1
	fi

	cd "$1" || return 2
#	tmux new-session \; \
#		send-keys '_develop' C-m \; \
#		split-window -h
#}
#
#_develop () {
	tabname "$(basename "$PWD")"
	if [ -d node_modules/.bin/ ]; then
		export PATH="$PWD/node_modules/.bin:${PATH}"
	fi
	if [ -d vendor/bin/ ]; then
		export PATH="$PWD/vendor/bin:${PATH}"
	fi
	if [ -f .nvmrc ]; then
		export NVM_DIR="$HOME/.nvm"
		# shellcheck disable=SC1091
		source "/usr/local/opt/nvm/nvm.sh"
		nvm use
	fi
	# https://www.derekgourlay.com/blog/git-when-to-merge-vs-when-to-rebase/
	git fetch
	git status
}

dl () {
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
			curl --output "$2" "$1"
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
fixwin () {
	local thefile
	while IFS= read -r -d '' thefile; do
		if file "$thefile" | grep -q 'ASCII text, with CRLF line terminators' && ! git check-ignore -q "$thefile"; then
			echo -n "Converting $thefile from crlf to "
			sed -e $'s/\r$//' -i '' "$thefile"
			echo 'lf'
		fi
	# <() is command substitution when a pipe cannot be used.
	done <   <(find "${1-./}" -name '.git' -prune -o -name 'node_modules' -prune -o -name 'bower_components' -prune -o -type f -print0)
}

gpip () {
	PIP_REQUIRE_VIRTUALENV="" sudo -H pip "$@"
}

man () {
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

md5 () { /sbin/md5 "$@" | sed -e's/^MD5 (\(.*\)) = \([0-9a-f]*\)$/\2 \1/' | sort; }

pdfmerge () {
	if [ "$#" -lt 3 ]; then
		echo "Usage: ${FUNCNAME[0]} output.pdf 1.pdf 2.pdf ... N.pdf" >&2
		return 1
	fi

	local outpdf="$1"
	shift
	gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outpdf}" "$@"
}

pdfunprotect () {
	if [ "$#" -ne 1 ]; then
		echo "Usage: ${FUNCNAME[0]} tounlock.pdf" >&2
		return 1
	fi

	local tmppdf
	tmppdf=$(mktemp -t "pdf")
	gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${tmppdf}" -c .setpdfwrite -f "$1"
	if [ -s "${tmppdf}" ]; then
		mv "${tmppdf}" "$1"
	fi
}

projgrep () {
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
		cat >&2 <<EOF
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
servhttp () {
	local port="${1:-8000}"
	sleep 1 && open "http://localhost:${port}/" &
	# Set the default Content-Type to `text/plain` instead of `application/octet-stream`
	# And serve everything as UTF-8 (although not technically correct, this doesn’t break anything for binary files)
	python -c $'import SimpleHTTPServer;\nmap = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map;\nmap[""] = "text/plain";\nfor key, value in map.items():\n\tmap[key] = value + ";charset=UTF-8";\nSimpleHTTPServer.test();' "$port"
}

ssh () {
	osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "SSH"'
	/usr/bin/ssh "$@"
	tabname
	osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "Basic"'
}

sys_status () {
	### System Status
	echo -e "${txtbld}Uptime${txtrst}"
	w

	echo -e "\\n${txtbld}Disk Usage${txtrst}"
	df -h | grep "^Filesystem\\|^/" | grep --color=always " \\|9[0-9]%\\|100%"

	echo -e "\\n${txtbld}Network${txtrst}"
	hostname -f
	ifconfig | grep inet | grep -v "::1\\| 127\\.\\| fe80:\\| detached\\| deprecated" | cut -d" " -f2 | sort;

	local cols
	cols=$(tput cols)
	echo -ne "$txtbld"
	# shellcheck disable=SC2046
	printf '%.0s-' $(seq 1 "$cols")
	echo -e "$txtrst"
}

# Set MacOS Terminal.app tab name
tabname () {
	# call with a value to set the name, call without value to set to previous name.
	[ -n "$*" ] && terminal_tabname=$*
	[ -n "$terminal_tabname" ] && printf "\\e]1;%s\\a" "$terminal_tabname";
}

update_brew_install () {
	local installed
	installed=$(brew leaves | sed -e 's/^/  /' -e 's/$/ \\/' -e '$ s/ \\//' -e '1 s/^  //')
	echo "brew install ${installed}" > "${HOME}/Programming/homedir/brew-install.txt"
}

update_npm_install () {
	local installed
	installed=$(npm list --global --depth=0 --parseable | sed -e '1d' -e 's|.*/||' -e 's/^/  /' -e 's/$/ \\/' -e '$ s/ \\//' -e '2 s/^  //')
	echo "npm install --global ${installed}" > "${HOME}/Programming/homedir/npm-global-install.txt"
}

#### Implement configuration

trap __kill_jobs EXIT

# Reset Profile in case tab was opened from a different profile.
osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "Basic"'
tabname "$(hostname -s)"

# shellcheck disable=SC1091
source /usr/local/etc/bash_completion.d/git-prompt.sh
PS1="\\[$txtgrn$txtbld\\]\\h\\[$txtrst\\]:\\[$txtblu$txtbld\\]\\w\\[$txtpur\\]\$(__git_ps1)\\[$txtrst\\]\\[\$(__status_code)\\]\$\\[$txtrst\\] "

# Use bash-completion, if available
if [[ -r /usr/local/etc/profile.d/bash_completion.sh ]]; then
	# shellcheck disable=SC1091
	source /usr/local/etc/profile.d/bash_completion.sh
fi

if command -v pyenv 1>/dev/null 2>&1; then
	eval "$(pyenv init -)"
fi

if command -v rbenv 1>/dev/null 2>&1; then
	eval "$(rbenv init -)"
fi

# This updates the path, but I think homebrew already has it covered
# source '/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.bash.inc'
# pyenv and google cloud sdk from homebrew right now don't install completions correctly so don't do this:
# source '/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.bash.inc'
# Instead:
# cd /usr/local/etc/bash_completion.d/
# ln -s ../../Cellar/pyenv/*/completions/pyenv.bash
# ln -s ../../Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.bash.inc google-cloud-sdk

# Don't run this in tmux
if [ -z "$TMUX" ]; then
	# Manually activate .launchd.conf
	launchctl list | grep -q name.robgant || {
		<"$HOME/.launchd.conf" xargs launchctl
	}
fi

# Only init the agent if we are on a terminal
#test -t 0 && __init_agent

# Only display system status if we are on a terminal
test -t 0 && __init_status

alias bgc="osascript -e 'tell application \"Terminal\" to set background color of selected tab of the front window to {65535, 65232, 53533}'"
alias cp='cp -i'
alias df='df -h'
alias diff='diff --unified'
alias du='du -h'
alias funcs="compgen -A function"
alias headers='curl --verbose --silent 1> /dev/null'
alias htmlgrep="find ./ -name '*.html' -print0 | xargs -0 grep"
alias modem_tunnel='ssh home -L 2000:modem.home.robgant.com:80 -N'
alias mv='mv -i'
alias npmg="npm --global"
alias phpgrep="find ./ -name '*.php' -print0 | xargs -0 grep"
alias pygrep="find ./ -name '*.py' -print0 | xargs -0 grep"
alias rm='rm -i'
alias router_tunnel='ssh home -L 2000:router.home.robgant.com:80 -N'
alias tsgrep="find ./ -name '*.ts' -print0 | xargs -0 grep"
alias vnc_tunnel='ssh vnctunnel -N'

# Personal Projects
alias saas='develop ~/Programming/saas-api-boilerplate'

# Professional Projects are loaded from ~/.bash_profile.d/work.bash_profile

# Load local configurations
if [ -d ~/.bash_profile.d ]; then
	for profile in ~/.bash_profile.d/*.bash_profile; do
		# shellcheck disable=SC1090
		source "$profile"
	done
fi
