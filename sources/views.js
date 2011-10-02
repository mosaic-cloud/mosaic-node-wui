// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var dust = require ("dust");
var express = require ("express");
var printf = require ("printf");
var querystring = require ("querystring");

var controller = require ("./controller");
var schemas = require ("./schemas");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.libTranscriptLevel);

// ---------------------------------------

function _handleFront (_request, _response) {
	_response.render ("front.dust", _mixinContext (_request, true, {}));
}

function _handleConsole (_request, _response) {
	_response.render ("console.dust", _mixinContext (_request, true, {}));
}

function _handleLog (_request, _response) {
	_response.render ("log.dust", _mixinContext (_request, true, {}));
}

function _handleAbout (_request, _response) {
	_response.render ("about.dust", _mixinContext (_request, true, {}));
}

// ---------------------------------------

function _handleInvalid (_request, _response) {
	_response.render ("invalid.dust", _mixinContext (_request, false, {
			path : _request.url, query : _request.query, method : _request.method, body : _request.body,
	}));
}

// ---------------------------------------

function _handleQueryClusterNodes (_request, _response) {
	controller.getClusterNodes (function (_error, _outcome) {
		if (_error === null)
			_response.render ("cluster_nodes.dust", _mixinContext (_request, true, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleQueryClusterRing (_request, _response) {
	controller.getClusterRing (function (_error, _outcome) {
		if (_error === null)
			_response.render ("cluster_ring.dust", _mixinContext (_request, true, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

// ---------------------------------------

function _handleQueryProcesses (_request, _response) {
	controller.getProcesses (function (_error, _outcome) {
		if (_error === null)
			_response.render ("processes.dust", _mixinContext (_request, true, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleCreateProcessPre (_request, _response) {
	var _templateType = _request.param ("templateType");
	var _templateConfiguration = JSON.stringify (schemas.processTypes[_request.param ("type", _templateType)], null, 4)
	_response.render ("process_create.dust", _mixinContext (_request, false, {
			type : _request.param ("type"), configuration : _request.param ("configuration"), count : _request.param ("count"),
			types : _ (schemas.processTypes) .chain () .keys () .map (function (_type) { return ({type : _type, selected : (_type == _templateType)}); }) .value (),
			templateType : _templateType,
			templateConfiguration : _templateConfiguration,
	}));
}

function _handleCreateProcess (_request, _response) {
	controller.createProcess (_request.param ("type"), _request.param ("configuration"), _request.param ("count", 1), function (_error, _outcome) {
		if (_error === null)
			_response.render ("succeeded.dust", _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleCallProcessPre (_request, _response) {
	_response.render ("process_call_cast.dust", _mixinContext (_request, false, {
			call : true, key : _request.param ("key"), operation : _request.param ("operation"), inputs : _request.param ("inputs"),
	}));
}

function _handleCallProcess (_request, _response) {
	controller.callProcess (_request.param ("key"), _request.param ("operation"), _request.param ("inputs"), function (_error, _outcome) {
		if (_error === null)
			_response.render ("succeeded.dust", _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleCastProcessPre (_request, _response) {
	_response.render ("process_call_cast.dust", _mixinContext (_request, false, {
			cast : true, key : _request.param ("key"), operation : _request.param ("operation"), inputs : _request.param ("inputs"),
	}));
}

function _handleCastProcess (_request, _response) {
	controller.castProcess (_request.param ("key"), _request.param ("operation"), _request.param ("inputs"), function (_error, _outcome) {
		if (_error === null)
			_response.render ("succeeded.dust", _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleStopProcessPre (_request, _response) {
	_response.render ("process_stop.dust", _mixinContext (_request, false, {
			key : _request.param ("key"),
	}));
}

function _handleStopProcess (_request, _response) {
	controller.stopProcess (_request.param ("key"), function (_error, _outcome) {
		if (_error === null)
			_response.render ("succeeded.dust", _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_response.render ("failed.dust", _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

// ---------------------------------------

function _mixinContext (_request, _pushReturn, _context) {
	var _back = _request.param ("return");
	if (_back)
		_back = querystring.unescape (_back);
	else
		_back = null;
	var _self = _request.url;
	if (_back)
		var _stacked = printf ("%s?%s", _self, querystring.stringify (
				_ (_request.query) .chain () .clone () .extend ({"return" : _back}) .values ()));
	else
		if (_ (_request.query) .isEmpty ())
			var _stacked = _self;
		else
			var _stacked = printf ("%s?%s", _self, querystring.stringify (_request.query));
	if (_pushReturn)
		return (_.extend (_context, {
			"return" : _back,
			"returnStacked" : _stacked
		}));
	else
		return (_.extend (_context, {
			"return" : _back,
			"returnStacked" : _back
		}));
}

// ---------------------------------------

var _configureApplication = function  (_application) {
	
	_application.use (express.bodyParser ());
	_application.use (function (_error, _request, _response, _next) {
		_response.render ("failed.dust", {
				error : {reason : "unexpected-internal-error", message : _error.toString (), messageExtra : _error.stack.toString ()},
		});
	});
	
	_application.get ("/", _handleFront);
	_application.get ("/console", _handleConsole);
	_application.get ("/log", _handleLog);
	_application.get ("/about", _handleAbout);
	
	_application.get ("/cluster/nodes", _handleQueryClusterNodes);
	_application.get ("/cluster/ring", _handleQueryClusterRing);
	
	_application.get ("/processes", _handleQueryProcesses);
	_application.get ("/processes/:key/call/:operation?", _handleCallProcessPre);
	_application.post ("/processes/:key/call/:operation?", _handleCallProcess);
	_application.get ("/processes/:key/cast/:operation?", _handleCastProcessPre);
	_application.post ("/processes/:key/cast/:operation?", _handleCastProcess);
	_application.get ("/processes/:key/stop", _handleStopProcessPre);
	_application.post ("/processes/:key/stop", _handleStopProcess);
	
	_application.get ("/process/create", _handleCreateProcessPre);
	_application.post ("/process/create", _handleCreateProcess);
	_application.get ("/process/call", _handleCallProcessPre);
	_application.post ("/process/call", _handleCallProcess);
	_application.get ("/process/cast", _handleCastProcessPre);
	_application.post ("/process/cast", _handleCastProcess);
	_application.get ("/process/stop", _handleStopProcessPre);
	_application.post ("/process/stop", _handleStopProcess);
	
	_application.get ("*", _handleInvalid);
	_application.put ("*", _handleInvalid);
	_application.post ("*", _handleInvalid);
	_application.delete ("*", _handleInvalid);
};

// ---------------------------------------

module.exports.configureApplication = _configureApplication;

// ---------------------------------------
