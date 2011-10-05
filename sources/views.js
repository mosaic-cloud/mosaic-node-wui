// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var dust = require ("dust");
var express = require ("express");
var fs = require ("fs");
var path = require ("path");
var printf = require ("printf");
var querystring = require ("querystring");
var request = require ("request");

var controller = require ("./controller");
var schemas = require ("./schemas");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.libTranscriptLevel);

// ---------------------------------------

function _handleFront (_request, _response, _next)
{
	_renderView ("front", _request, _response, _next, _mixinContext (_request, true, {}));
}

function _handleConsole (_request, _response, _next)
{
	_renderView ("console", _request, _response, _next, _mixinContext (_request, true, {}));
}

function _handleConsoleProxy (_request, _response, _next)
{
	_handleProxy (_request.url.replace (/^\/console\/proxy\//, "/"), _request, _response, _next);
}

function _handleLog (_request, _response, _next)
{
	_renderView ("log", _request, _response, _next, _mixinContext (_request, true, {}));
}

function _handleLogStream (_request, _response, _next)
{
	_handleProxy ("/log/stream", _request, _response, _next);
}

function _handleLogContent (_request, _response, _next)
{
	_handleProxy ("/log/content", _request, _response, _next);
}

function _handleAbout (_request, _response, _next)
{
	_renderView ("about", _request, _response, _next, _mixinContext (_request, true, {}));
}

function _handleProxy (_path, _request, _response, _next)
{
	request.get (printf ("http://mosaic-1.loopback.vnet:31808%s", _path), function (_error) {
		if (_error)
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
				error : {
						reason : "unexpected-http-client-error",
						message : _error.toString (),
						messageExtra : _error.stack.toString (),
						error : _error,
						path : _path,
				},
		}));
	}) .pipe (_response);
}

// ---------------------------------------

function _handleInvalid (_request, _response, _next)
{
	_renderView ("invalid", _request, _response, _next, _mixinContext (_request, false, {
			path : _request.url, query : _request.query, method : _request.method, body : _request.body,
	}));
}

// ---------------------------------------

function _handleQueryClusterNodes (_request, _response, _next)
{
	controller.getClusterNodes (function (_error, _outcome) {
		if (_error === null)
			_renderView ("cluster_nodes", _request, _response, _next, _mixinContext (_request, true, {
					outcome : _outcome,
			}));
		else
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleQueryClusterRing (_request, _response, _next)
{
	controller.getClusterRing (function (_error, _outcome) {
		if (_error === null)
			_renderView ("cluster_ring", _request, _response, _next, _mixinContext (_request, true, {
					outcome : _outcome,
			}));
		else
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

// ---------------------------------------

function _handleQueryProcesses (_request, _response, _next)
{
	controller.getProcesses (function (_error, _outcome) {
		if (_error === null) {
			_outcome.processes = _ (_outcome.processes)
					.chain ()
					.sortBy (function (_process) { return (_process.key); })
					.sortBy (function (_process) { return (_process.type); })
					.value ();
			_renderView ("processes", _request, _response, _next, _mixinContext (_request, true, {
					outcome : _outcome,
			}));
		} else
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleCreateProcessPre (_request, _response, _next)
{
	var _type = _request.param ("type") || undefined;
	var _configuration = _request.param ("configuration") || undefined;
	var _count = _request.param ("count") || undefined;
	var _typeTemplate = _request.param ("typeTemplate") || undefined;
	var _configurationTemplate = _request.param ("configurationTemplate") || undefined;
	var _description = undefined;
	if (_type !== undefined)
		_typeTemplate = _type;
	if (_configuration !== undefined)
		_configurationTemplate = _configuration;
	if (_typeTemplate === undefined)
		_typeTemplate = "[Custom...]";
	var _processSchemas = schemas.processes ();
	var _processSchema = undefined;
	if (_processSchemas !== undefined)
		_processSchema = _processSchemas [_typeTemplate];
	if (_processSchema !== undefined) {
		if (_configurationTemplate === undefined)
			_configurationTemplate = JSON.stringify (_processSchema.configurationTemplate, null, 4);
		_description = _processSchema.description;
	} else {
		if (_configurationTemplate === undefined)
			_configurationTemplate = JSON.stringify (null, null, 4);
	}
	var _typeOptions = undefined;
	if (_processSchemas !== undefined)
		_typeOptions = _ (["[Custom...]"] .concat (_ (_processSchemas) .keys () .sort ()))
				.map (function (_type) { return ({name : _type, selected : (_type == _typeTemplate)}); });
	else
		_typeOptions = [{name : "[Custom...]", selected : true}];
	var _typeInputable = (_typeTemplate == "[Custom...]");
	_renderView ("process_create", _request, _response, _next, _mixinContext (_request, false, {
			type : _type, configuration : _configuration, count : _count,
			typeOptions : _typeOptions, typeInputable : _typeInputable,
			typeTemplate : _typeTemplate, configurationTemplate : _configurationTemplate,
			description : _description,
	}));
}

function _handleCreateProcess (_request, _response, _next)
{
	controller.createProcess (_request.param ("type"), _request.param ("configuration"), _request.param ("count", 1), function (_error, _outcome) {
		if (_error === null)
			_renderView ("succeeded", _request, _response, _next, _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

function _handleCallProcessPre (_request, _response, _next)
{
	_handleCallCastProcessPre ("call", _request, _response, _next);
}

function _handleCallProcess (_request, _response, _next)
{
	_handleCallCastProcess ("call", _request, _response, _next);
}

function _handleCastProcessPre (_request, _response, _next)
{
	_handleCallCastProcessPre ("cast", _request, _response, _next);
}

function _handleCastProcess (_request, _response, _next)
{
	_handleCallCastProcess ("cast", _request, _response, _next);
}

function _handleCallCastProcessPre (_action, _request, _response, _next)
{
	var _key = _request.param ("key") || undefined;
	var _operation = _request.param ("operation") || undefined;
	var _inputs = _request.param ("inputs") || undefined;
	var _type = _request.param ("type") || undefined;
	var _typeTemplate = _request.param ("typeTemplate") || undefined;
	var _operationTemplate = _request.param ("operationTemplate") || undefined;
	var _inputsTemplate = _request.param ("inputsTemplate") || undefined;
	var _description = undefined;
	if (_type !== undefined)
		_typeTemplate = _type;
	if (_operation !== undefined)
		_operationTemplate = _operation;
	if (_inputs !== undefined)
		_inputsTemplate = _inputs;
	if (_typeTemplate === undefined)
		_typeTemplate = "[Custom...]";
	if (_operationTemplate === undefined)
		_operationTemplate = "[Custom...]";
	var _processSchemas = schemas.processes ();
	var _processSchema = undefined;
	if (_processSchemas !== undefined)
		_processSchema = _processSchemas[_typeTemplate];
	var _operationSchemas = undefined;
	var _operationSchema = undefined;
	if (_processSchema !== undefined) {
		if (_action == "call")
			_operationSchemas = _processSchema.callOperations;
		else
			_operationSchemas = _processSchema.castOperations;
	}
	if (_operationSchemas !== undefined)
		_operationSchema = _operationSchemas[_operationTemplate];
	if (_operationSchema !== undefined) {
		if (_operationSchema !== null) {
			if (_inputsTemplate === undefined)
				_inputsTemplate = JSON.stringify (_operationSchema.inputsTemplate, null, 4);
			_description = _operationSchema.description;
		}
	} else {
		if (_inputsTemplate === undefined)
			_inputsTemplate = JSON.stringify (null, null, 4);
	}
	var _typeOptions = undefined;
	if (_processSchemas !== undefined)
		_typeOptions = _ (["[Custom...]"] .concat (_ (_processSchemas) .keys () .sort ()))
				.map (function (_type) { return ({name : _type, selected : (_type == _typeTemplate)}); });
	else
		_typeOptions = [{name : "[Custom...]", selected : true}];
	var _operationOptions = undefined;
	var _operationInputable = undefined;
	if (_operationSchemas !== undefined && ! _ (_operationSchemas) .isEmpty ()) {
		_operationOptions = _ (["[Custom...]"] .concat (_ (_operationSchemas) .keys () .sort ()))
				.map (function (_operation) { return ({name : _operation, selected : (_operation == _operationTemplate)}); });
	} else
		_operationOptions = [{name : "[Custom...]", selected : true}];
	_operationInputable = (_operationTemplate == "[Custom...]");
	_renderView ("process_call_cast", _request, _response, _next, _mixinContext (_request, false, {
			key : _key, operation : _operation, inputs : _inputs, type : _type,
			typeOptions : _typeOptions, operationOptions : _operationOptions, operationInputable : _operationInputable,
			typeTemplate : _typeTemplate, operationTemplate : _operationTemplate, inputsTemplate : _inputsTemplate,
			description : _description,
			call : (_action == "call"), cast : (_action == "cast")
	}));
}

function _handleCallCastProcess (_action, _request, _response, _next)
{
	var _callback = function (_error, _outcome) {
		if (_error === null)
			_renderView ("succeeded", _request, _response, _next, _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
					error : _error,
			}));
	};
	if (_action == "call")
		controller.callProcess (_request.param ("key"), _request.param ("operation"), _request.param ("inputs"), _callback);
	else
		controller.castProcess (_request.param ("key"), _request.param ("operation"), _request.param ("inputs"), _callback);
}

function _handleStopProcessPre (_request, _response, _next)
{
	_renderView ("process_stop", _request, _response, _next, _mixinContext (_request, false, {
			key : _request.param ("key"),
	}));
}

function _handleStopProcess (_request, _response, _next)
{
	controller.stopProcess (_request.param ("key"), function (_error, _outcome) {
		if (_error === null)
			_renderView ("succeeded", _request, _response, _next, _mixinContext (_request, false, {
					outcome : _outcome,
			}));
		else
			_renderView ("failed", _request, _response, _next, _mixinContext (_request, false, {
					error : _error,
			}));
	});
}

// ---------------------------------------

function _mixinContext (_request, _pushReturn, _context)
{
	var _quickCreate = _ (schemas.processes ())
			.chain ()
			.map (function (_schema, _type) { return ({type : _type, name : _schema.quickCreateName, enabled : (_schema.quickCreate || false), order : (_schema.quickCreateOrder || 0)}); })
			.select (function (_option) { return (_option.enabled); })
			.sortBy (function (_option) { return (_option.name); })
			.sortBy (function (_option) { return (_option.order); })
			.value ();
	var _back = _request.param ("return") || undefined;
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
			"quickCreate" : _quickCreate,
			"return" : _back,
			"returnStacked" : _stacked,
		}));
	else
		return (_.extend (_context, {
			"quickCreate" : _quickCreate,
			"return" : _back,
			"returnStacked" : _back,
		}));
}

// ---------------------------------------

function _renderView (_view, _request, _response, _next, _attributes)
{
	var _context = dust.makeBase ({}) .push (_attributes);
	dust.render (_view, _context, function (_error, _output) {
		if (_error)
			_next (_error);
		else
			_response.send (_output, {}, 200);
	});
}

// ---------------------------------------

function _configureApplication (_application)
{
	_application.use (express.bodyParser ());
	_application.use ("/static", express.static (path.join (path.dirname (module.filename), "../static")));
	_application.use (_application.router);
	_application.use (function (_error, _request, _response, _next) {
		_renderView ("failed", _request, _response, _next, {
				error : {reason : "unexpected-internal-error", message : _error.toString (), messageExtra : _error.stack.toString ()},
		});
	});
	_application.use (express.errorHandler ({showStack: true, dumpExceptions: false}));
	
	_application.get ("/", _handleFront);
	_application.get ("/console", _handleConsole);
	_application.get ("/console/proxy/*", _handleConsoleProxy);
	_application.get ("/log", _handleLog);
	_application.get ("/log/stream", _handleLogStream);
	_application.get ("/log/content", _handleLogContent);
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
	
	dust.onLoad = function (_view, _callback) {
		fs.readFile (path.join (path.dirname (module.filename), _view + ".dust"), "utf8", function (_error, _output) {
			if (_error)
				_callback (_error);
			try {
				_callback (undefined, _output);
			} catch (_error) {
				_callback (_error);
			}
		});
	};
	dust.register = function (_view, _renderer) {
		dust.cache[_view] = _renderer;
		process.nextTick (function () {
			delete dust.cache[_view];
		});
	};
	dust.optimizers.format = function (_context, _node) {
		return _node;
	};
}

// ---------------------------------------

module.exports.configureApplication = _configureApplication;

// ---------------------------------------
