#!/dev/null

if ! test "${#}" -le 1 ; then
	echo "[ee] invalid arguments; aborting!" >&2
	exit 1
fi

_identifier="${1:-0000000054d5b2b2b06341e1a788a2eea3733b90}"

if test -n "${mosaic_component_temporary:-}" ; then
	_tmp="${mosaic_component_temporary:-}"
elif test -n "${mosaic_temporary:-}" ; then
	_tmp="${mosaic_temporary}/components/${_identifier}"
else
	_tmp="/tmp/mosaic/components/${_identifier}"
fi

_node_args+=(
		"${_node_sources}/main.js"
)

if test "${_identifier}" != 0000000054d5b2b2b06341e1a788a2eea3733b90 ; then
	_node_env+=(
			mosaic_component_identifier="${_identifier}"
			mosaic_component_temporary="${_tmp}"
	)
fi

mkdir -p "${_tmp}"
cd "${_tmp}"

exec env "${_node_env[@]}" "${_node_bin}" "${_node_args[@]}"
