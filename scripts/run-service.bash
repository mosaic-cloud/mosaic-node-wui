#!/dev/null

if ! test "${#}" -le 1 ; then
	echo "[ee] invalid arguments; aborting!" >&2
	exit 1
fi

_identifier="${1:-0000000054d5b2b2b06341e1a788a2eea3733b90}"

if test -n "${mosaic_service_temporary:-}" ; then
	_tmp="${mosaic_service_temporary:-}"
elif test -n "${mosaic_temporary:-}" ; then
	_tmp="${mosaic_temporary}/services/${_identifier}"
else
	_tmp="${TMPDIR:-/tmp/mosaic}/services/${_identifier}"
fi

_node_env+=(
		mosaic_service_identifier="${_identifier}"
		mosaic_service_temporary="${_tmp}"
)

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

mkdir -p -- "${_tmp}"
cd -- "${_tmp}"

if test "${mosaic_service_restart:-false}" != true ; then
	exec env -i "${_node_env[@]}" "${_node_bin}" "${_node_args[@]}"
else
	while true ; do
		_outcome=0
		env -i "${_node_env[@]}" "${_node_bin}" "${_node_args[@]}" || _outcome="${?}"
		if test "${_outcome}" -ne 2 ; then
			break
		fi
	done
	exit "${_outcome}"
fi

exit 1
