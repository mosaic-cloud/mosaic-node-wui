// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var printf = require ("printf");
var request = require ("request");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.libTranscriptLevel);

// ---------------------------------------

function _getClusterNodes (_callback) {
	return (_invokeGetJson ("/cluster/nodes", function (_error, _response, _body) {
		_callback (_error, _body);
	}));
}

function _getClusterRing (_callback) {
	return (_invokeGetJson ("/cluster/ring", function (_error, _response, _body) {
		_callback (_error, _body);
	}));
}

// ---------------------------------------

function _invokeGetJson (_path, _callback) {
	var _options = {
			uri : "http://mosaic-1.loopback.vnet:31808" + _path,
			method : "GET",
			headers : {
				"Accept-Type" : "application/json",
			},
			timeout : 1000,
	};
	request (_options, function (_error, _response, _body) {
		if (_callback === undefined)
			return;
		if (_error) {
			var _outcome = {
					reason : "unexpected-http-client-error",
					message : _error.toString (),
					error : _error,
					path : _path,
			};
			_callback (_outcome, undefined, undefined);
			_callback = undefined;
		} else if (_response.statusCode != 200) {
			var _outcome = {
					reason : "unexpected-http-response-status-code",
					message : printf ("Unexpected status code `%d`", _response.statusCode),
					statusCode : _response.statusCode,
					path : _path,
			};
			_callback (_outcome, undefined, undefined);
			_callback = undefined;
		} else if (_response.headers["content-type"] != "application/json") {
			var _outcome = {
					reason : "unexpected-http-response-content-type",
					message : printf ("Unexpected content type `%s`", _response.headers["content-type"]),
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

module.exports.getClusterNodes = _getClusterNodes;
module.exports.getClusterRing = _getClusterRing;

// ---------------------------------------
