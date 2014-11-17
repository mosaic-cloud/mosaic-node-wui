#!/dev/null

if ! test "${#}" -eq 0 ; then
	echo "[ee] invalid arguments; aborting!" >&2
	exit 1
fi

_identifier="${mosaic_service_identifier:-0000000054d5b2b2b06341e1a788a2eea3733b90}"

## chunk::be1d894b132982aa08a6adf7e406c9a9::begin ##
if test -n "${mosaic_service_temporary:-}" ; then
	_tmp="${mosaic_service_temporary:-}"
elif test -n "${mosaic_temporary:-}" ; then
	_tmp="${mosaic_temporary}/services/${_identifier}"
else
	_tmp="${TMPDIR:-/tmp}/mosaic/services/${_identifier}"
fi
## chunk::be1d894b132982aa08a6adf7e406c9a9::end ##

if test -n "${mosaic_node_wui_ip:-}" ; then
	_node_env+=(
			mosaic_node_wui_ip="${mosaic_node_wui_ip}"
	)
fi
if test -n "${mosaic_node_wui_port:-}" ; then
	_node_env+=(
			mosaic_node_wui_port="${mosaic_node_wui_port}"
	)
fi

if test -n "${mosaic_node_ip:-}" ; then
	_node_env+=(
			mosaic_node_ip="${mosaic_node_ip}"
	)
fi
if test -n "${mosaic_node_port:-}" ; then
	_node_env+=(
			mosaic_node_port="${mosaic_node_port}"
	)
fi

_node_args+=(
		"${_node_sources}/main.js"
)

_node_env+=(
		mosaic_service_identifier="${_identifier}"
		mosaic_service_temporary="${_tmp}"
)

## chunk::da43d7ef47da796de30612bd22b4e475::begin ##
mkdir -p -- "${_tmp}"
cd -- "${_tmp}"

exec {_lock}<"${_tmp}"
if ! flock -x -n "${_lock}" ; then
	echo '[ee] failed to acquire lock; aborting!' >&2
	exit 1
fi
## chunk::da43d7ef47da796de30612bd22b4e475::end ##

exec env -i "${_node_env[@]}" "${_node_bin}" "${_node_args[@]}"

exit 1
