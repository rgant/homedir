#!/bin/bash
# Reset Profile in case tab was opened from a different profile.
osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "Basic"';

#txtund=$(tput sgr 0 1)	# Underline
txtbld=$(tput bold)		# Bold
#txtblk=$(tput setaf 0)	# Black
#txtred=$(tput setaf 1)	# Red
txtgrn=$(tput setaf 2)	# Green
#txtylw=$(tput setaf 3)	# Yellow
txtblu=$(tput setaf 4)	# Blue
txtpur=$(tput setaf 5)	# Purple
#txtcyn=$(tput setaf 6)	# Cyan
#txtwht=$(tput setaf 7)	# White
txtrst=$(tput sgr0)		# Text reset

source /usr/local/etc/bash_completion.d/git-prompt.sh
PS1="\\[$txtgrn$txtbld\\]\\h\\[$txtrst\\]:\\[$txtblu$txtbld\\]\\w\\[$txtpur\\]\$(__git_ps1)\\[$txtrst\\]\$ "

# Use bash-completion, if available
if [[ $PS1 && -f /usr/local/share/bash-completion/bash_completion ]]; then
	source /usr/local/share/bash-completion/bash_completion
fi

HISTCONTROL=ignoreboth
HISTSIZE=20000
HISTFILESIZE=20000
shopt -s histappend
#export PROMPT_COMMAND="history -a; history -c; history -r; $PROMPT_COMMAND"

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias df='df -h'
alias du='du -h'
alias diff='diff --unified'
alias movsync='rsync --archive --compress --delete --exclude=.DS_Store --fuzzy --progress rsync://media-center.home.robgant.com/rgant/Movies/ ~/Movies/'
alias newmusic='rsync --archive --compress --progress rsync://media-center.home.robgant.com/rgant/Music/new/ ./Music/new/'
alias modem_tunnel='ssh home -L 2000:modem.home.robgant.com:80 -N'
alias router_tunnel='ssh home -L 2000:router.home.robgant.com:80 -N'
#alias deluge_tunnel='ssh home -L 2080:localhost:8080 -N deluge-web -p 8080'
#alias vnc_tunnel='ssh home -L 5900:localhost:5900 -N'
alias funcs="grep -o '^[a-z0-9_]* () {' ~/.bash_profile | sed -e's/ () {//'"
alias pygrep="find ./ -name '*.py' -print0 | xargs -0 grep"
alias phpgrep="find ./ -name '*.php' -print0 | xargs -0 grep"
alias htmlgrep="find ./ -name '*.html' -print0 | xargs -0 grep"
alias headers='curl --verbose --silent 1> /dev/null'

export CLICOLOR=1
export EDITOR=nano
export GREP_OPTIONS='--color=auto --no-messages'
#export MAGICK_HOME='/opt/ImageMagick'
#export DYLD_LIBRARY_PATH="$MAGICK_HOME/lib"
export PYTHONSTARTUP="$HOME/.pythonrc.py"
export PIP_REQUIRE_VIRTUALENV=true

#PATH="${PATH}:/usr/local/php5/bin:/usr/local/mysql/bin:$MAGICK_HOME/bin"
export PATH="/Users/rgant/bin:${PATH}:."

if command -v pyenv 1>/dev/null 2>&1; then
	eval "$(pyenv init -)"

	if command -v pyenv-virtualenv-init > /dev/null; then
		eval "$(pyenv virtualenv-init -)";
		# Try to make pipenv work with pyenv-virtualenv so we get automatic activation.
		# pipenv --completion > /usr/local/etc/bash_completion.d/pipenv.bash
		export PIPENV_USE_SYSTEM=1
		PYROOT=$(pyenv root)
		export WORKON_HOME=$PYROOT/versions/
	fi
fi

# Don't run this in tmux
if [ -z "$TMUX" ]; then
	# Manually activate .launchd.conf
	launchctl list | grep -q name.robgant || {
		<"$HOME/.launchd.conf" xargs launchctl;
	}
fi

gpip () {
	PIP_REQUIRE_VIRTUALENV="" sudo -H pip "$@";
}

dl () {
	if [ "$#" -lt 1 ]; then
		echo "Usage: ${FUNCNAME[0]} URL_TO_DOWNLOAD [DIR_OR_NAME_TO_SAVE_AS]" >&2;
		return 1;
	fi;

	if [ -n "$2" ]; then
		# Download file into specified directory
		if [ -d "$2" ]; then
			cd "$2" || exit;
		# Download the file to specified name
		elif [ ! -e "$2" ]; then
			curl --output "$2" "$1";
			return;
		fi;
	fi;

	# Download the file using the remote name
	curl --location --remote-name "$1";

	if [ -n "$2" ]; then
		cd - || exit;
	fi;
}

# Start an HTTP server from a directory, optionally specifying the port
servhttp () {
	local port="${1:-8000}";
	sleep 1 && open "http://localhost:${port}/" &
	# Set the default Content-Type to `text/plain` instead of `application/octet-stream`
	# And serve everything as UTF-8 (although not technically correct, this doesn’t break anything for binary files)
	python -c $'import SimpleHTTPServer;\nmap = SimpleHTTPServer.SimpleHTTPRequestHandler.extensions_map;\nmap[""] = "text/plain";\nfor key, value in map.items():\n\tmap[key] = value + ";charset=UTF-8";\nSimpleHTTPServer.test();' "$port";
}

# call with a value to set the name, call without value to set to previous name.
tabname () {
	[ -n "$1" ] && terminal_tabname=$1
	#echo -n -e "\033]0;$1\007";
	#echo "#### $terminal_tabname"
	[ -n "$terminal_tabname" ] && printf "\\e]1;%s\\a" "$terminal_tabname";
}
tabname "$(hostname -s)"

man () {
	if [ $# -eq 1 ]; then
		open "x-man-page://$1";
	elif [ $# -eq 2 ]; then
		open "x-man-page://$1/$2";
	fi
}

pdfunprotect () {
	if [ "$#" -ne 1 ]; then
		echo "Usage: ${FUNCNAME[0]} tounlock.pdf" >&2;
		return 1;
	fi

	TMPPDF=$(mktemp -t "pdf");
	gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${TMPPDF}" -c .setpdfwrite -f "$1";
	if [ -s "${TMPPDF}" ]; then
		mv "${TMPPDF}" "$1";
	fi
}

pdfmerge () {
	if [ "$#" -lt 3 ]; then
		echo "Usage: ${FUNCNAME[0]} output.pdf 1.pdf 2.pdf ... N.pdf" >&2;
		return 1;
	fi

	OUT="$1";
	shift;
	gs -q -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${OUT}" "$@";
}

#SSH Agent function
SSH_ENV="$HOME/.ssh/environment";
start_agent () {
	/usr/bin/ssh-agent -t 14400 | sed 's/^echo/#echo/' > "${SSH_ENV}";
	chmod 600 "${SSH_ENV}";
	source "${SSH_ENV}";
}
init_agent () {
	if [ -f "${SSH_ENV}" ]; then
		source "${SSH_ENV}";
		echo "${SSH_AGENT_PID}" > "$HOME/.ssh/ssh-agent.pid";
		pgrep -u "$USER" -F "$HOME/.ssh/ssh-agent.pid" -q ssh-agent || {
			start_agent;
		}
	else
		start_agent;
	fi;
}
ssh () {
	osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "SSH"';
	/usr/bin/ssh "$@";
	tabname;
	osascript -e 'tell application "Terminal" to set current settings of selected tab of the front window to settings set "Basic"';
}

# Only init the agent if we are on a terminal
test -t 0 && init_agent;

md5 () { /sbin/md5 "$@" | sed -e's/^MD5 (\(.*\)) = \([0-9a-f]*\)$/\2 \1/' | sort; }

sys_status () {
	### System Status
	echo -e "${txtbld}Uptime${txtrst}";
	w;

	echo -e "\\n${txtbld}Disk Usage${txtrst}";
	df | grep "^Filesystem\\|^/" | grep --color=always " \\|9[0-9]%\\|100%";

	echo -e "\\n${txtbld}Network${txtrst}";
	hostname -f;
	ifconfig | grep inet | grep -v "::1\\| 127\\." | cut -d" " -f2;

	COLS=$(tput cols);
	echo -ne "$txtbld";
	# shellcheck disable=SC2046
	printf '%.0s-' $(seq 1 "$COLS");
	echo -e "$txtrst"
}

# Only display system status if we are on a terminal
test -t 0 && {
	FILE="$HOME/.hrly_info";
	HR=$(date +"%F %H");
	# shellcheck disable=SC2143
	if [[ ! -f "$FILE" || ! $(grep "$HR" "$FILE") ]]; then
		echo "$HR" > "$FILE";
		sys_status;
	fi
}

develop () {
	cd "$1" || exit;
#	tmux new-session \; \
#		send-keys '_develop' C-m \; \
#		split-window -h;
#}
#
#_develop () {
	tabname "$(basename "$PWD")";
	if [[ -d node_modules/.bin/ ]]; then
		export PATH="$1/node_modules/.bin:${PATH}";
	fi
	if [[ -d vendor/bin/ ]]; then
		export PATH="$1/vendor/bin:${PATH}";
	fi
	# https://www.derekgourlay.com/blog/git-when-to-merge-vs-when-to-rebase/
	git fetch;
	git status;
}

kill_jobs () {
	for ID in $(jobs -p); do
		GID=$(ps -o pgid= -p "$ID");
		pkill -g "$GID";
	done
}
trap kill_jobs EXIT;

# Change the indentation of files with 2 space indentation to 4 spaces.
redent () {
	find "${1-'./'}" -path '*/.git/*' -prune \
		-o -path '*/assets/*' -prune \
		-o -name 'favicon.ico' -prune \
		-o -type f \
		-exec sh -c 'grep -q "^  [^ ]" $1 && unexpand -t 2 $1 | expand -t 4 > $1.tmp && mv $1.tmp $1' _ '{}' \;
}

# Find Windows Line Endings files in git repo, ignoring any gitignored files.
fixwin () {
	while IFS= read -r -d '' F; do
		if file "$F" | grep -q 'ASCII text, with CRLF line terminators' && ! git check-ignore -q "$F"; then
			echo -n "Converting $F from crlf to ";
			sed -e $'s/\r$//' -i '' "$F";
			echo 'lf';
		fi
	done <   <(find ./ -name '.git' -prune -o -name 'node_modules' -prune -o -name 'bower_components' -prune -o -type f -print0)
}

# This updates the path, but I think homebrew already has it covered
# source '/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.bash.inc';
# pyenv and google cloud sdk from homebrew right now don't install completions correctly so don't do this:
# source '/usr/local/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.bash.inc';
# Instead:
# cd /usr/local/etc/bash_completion.d/
# ln -s ../../Cellar/pyenv/*/completions/pyenv.bash
# ln -s ../../Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.bash.inc google-cloud-sdk

# Personal Projects
alias saas='develop ~/Programming/saas-api-boilerplate';
