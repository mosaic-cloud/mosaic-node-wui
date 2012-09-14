// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var printf = require ("printf");
var querystring = require ("querystring");
var request = require ("request");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.libTranscriptLevel);

// ---------------------------------------

function _getClusterNodes (_callback) {
	return (_invokeGetJson ("/v1/cluster/nodes", {}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _getClusterRing (_callback) {
	return (_invokeGetJson ("/v1/cluster/ring", {}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _getProcesses (_callback) {
	return (_invokeGetJson ("/v1/processes/descriptors", {}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _createProcess (_type, _configuration, _annotation, _count, _callback) {
	return (_invokeGetJson ("/v1/processes/create", {type : _type, configuration : _configuration, annotation : _annotation, count : _count}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _callProcess (_key, _operation, _inputs, _callback) {
	return (_invokeGetJson ("/v1/processes/call", {key : _key, operation : _operation, inputs : _inputs}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _castProcess (_key, _operation, _inputs, _callback) {
	return (_invokeGetJson ("/v1/processes/cast", {key : _key, operation : _operation, inputs : _inputs}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _stopProcess (_key, _callback) {
	return (_invokeGetJson ("/v1/processes/stop", {key : _key}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

function _getConfigurators (_callback) {
	return (_invokeGetJson ("/v1/processes/configurators", {}, function (_error, _response, _outcome) {
		_callback (_error, _outcome);
	}));
}

// ---------------------------------------

function _invokeGetJson (_path, _query, _callback) {
	var _url = printf ("http://%s:%d%s?%s", configuration.nodeIp, configuration.nodePort, _path, querystring.stringify (_query));
	transcript.traceDebugging ("invocking get request for: `%s`...", _url);
	var _options = {
			uri : _url,
			method : "GET",
			headers : {
				"Accept-Type" : "application/json",
			},
			timeout : 6 * 1000,
	};
	request (_options, function (_error, _response, _body) {
		if (_callback === undefined)
			return;
		if (_error) {
			var _outcome = {
					reason : "unexpected-http-client-error",
					message : _error.toString (),
					messageExtra : _error.stack.toString (),
					error : _error,
					path : _path,
			};
			_callback (_outcome, undefined, undefined);
			_callback = undefined;
		} else if (_response.statusCode != 200) {
			var _outcome = {
					reason : "unexpected-http-response-status-code",
					message : printf ("Unexpected status code `%d`", _response.statusCode),
					messageExtra : _body,
					statusCode : _response.statusCode,
					path : _path,
			};
			_callback (_outcome, undefined, undefined);
			_callback = undefined;
		} else if (_response.headers["content-type"] != "application/json") {
			var _outcome = {
					reason : "unexpected-http-response-content-type",
					message : printf ("Unexpected content type `%s`", _response.headers["content-type"]),
					messageExtra : _body,
					contentType : _response.headers["content-type"],
					path : _path,
			};
			_callback (_outcome, undefined, undefined);
			_callback = undefined;
		} else {
			var _outcome = JSON.parse (_body);
			_callback (null, _response, _outcome);
			_callback = undefined;
		}
	});
}

// ---------------------------------------

function _proxy (_path, _originalRequest, _originalResponse, _callback)
{
	var _url = printf ("http://%s:%d%s", configuration.nodeIp, configuration.nodePort, _path);
	transcript.traceDebugging ("proxying get request for: `%s`...", _url);
	var _proxyRequest = request.get (_url, function (_error) {
		if (_callback === undefined)
			return;
		if (_error) {
			var _outcome = {
					reason : "unexpected-http-client-error",
					message : _error.toString (),
					messageExtra : _error.stack.toString (),
					error : _error,
					path : _path,
			};
			_callback (_outcome);
			_callback = undefined;
		}
	});
	_originalRequest.on ("close", function () {
		if (_callback === undefined)
			return;
		transcript.traceWarning ("failed proxying get request for: `%s` (upstream closed); ignoring!", _url);
		_proxyRequest.req.abort ();
		_callback = undefined;
	});
	_proxyRequest.on ("close", function () {
		if (_callback === undefined)
			return;
		transcript.traceWarning ("failed proxying get request for: `%s` (downstream closed); ignoring!", _url);
		_originalResponse.end ();
		_callback = undefined;
	});
	_proxyRequest.pipe (_originalResponse);
}

// ---------------------------------------

module.exports.getClusterNodes = _getClusterNodes;
module.exports.getClusterRing = _getClusterRing;
module.exports.getProcesses = _getProcesses;
module.exports.createProcess = _createProcess;
module.exports.callProcess = _callProcess;
module.exports.castProcess = _castProcess;
module.exports.stopProcess = _stopProcess;
module.exports.proxy = _proxy;

// ---------------------------------------
