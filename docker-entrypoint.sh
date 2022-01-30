#!/bin/sh

set -x

BOLD="\e[1m"
RESET="\e[0m"
LIGHT_RED="\e[91m"
LIGHT_GREEN="\e[92m"
LIGHT_CYAN="\e[96m"

logging(){
	local type=$1; shift
	printf "${LIGHT_CYAN}${BOLD}Entrypoint${RESET} [%b] : %b\n" "$type" "$*"
}
log_info(){
	logging "${LIGHT_GREEN}info${RESET}" "$@"
}
log_error(){
	logging "${LIGHT_RED}error${RESET}" "$@" >&2
	exit 1
}
id
if [ "$(id -u)" = "0" ]; then
	log_info "Switch from root:root to node:node, aka $(id -u node):$(id -g node) must be the same uid and gid from your host to work ! "
	log_info 'If not, then provide arguments HOST_UID and HOST_GID with your uid and gid (man id)'
	chown -R node:node /app
	ls -l
	id
	exec su-exec node "$0" "$@"
fi

exec "$@"