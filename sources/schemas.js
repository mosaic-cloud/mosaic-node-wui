// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var child_process = require ("child_process");
var fs = require ("fs");
var path = require ("path");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.libTranscriptLevel);
var controller = require ("./controller");

// ---------------------------------------

var _schemasPy = path.join (path.dirname (module.filename), "schemas.py");
var _schemasPyInterval = 500;
var _schemasPyCache = null;
var _schemasJsonPath = path.join (path.dirname (module.filename), "schemas.json");
var _schemasYamlPath = path.join (path.dirname (module.filename), "schemas.yaml");

// ---------------------------------------

function _schemasPyRefresh () {
	if (true || !fs.existsSync (_schemasYamlPath)) {
		_schemasPyLoad ();
		return;
	}
	var _jsonTimestamp = fs.statSync (_schemasJsonPath) .mtime;
	var _yamlTimestamp = fs.statSync (_schemasYamlPath) .mtime;
	if (_jsonTimestamp < _yamlTimestamp) {
		transcript.traceInformation ("`schemas.yaml` seems to be newer than `schemas.json`; reprocessing...");
		var _devNull = fs.openSync ("/dev/null", "r+")
		var _child = child_process.spawn ("python2", [_schemasPy], {cwd : process.cwd (), env : process.env, customFds : [_devNull, _devNull, process.stderr]});
		fs.close (_devNull)
		_child.on ("exit", function (_code) {
			if (_code == 0) {
				setTimeout (_schemasPyRefresh, _schemasPyInterval);
				_schemasPyLoad ();
			} else {
				transcript.traceError ("`schemas.yaml` seems to be invalid; rescheduling...");
				setTimeout (_schemasPyRefresh, _schemasPyInterval * 4);
			}
		});
	} else {
		setTimeout (_schemasPyRefresh, _schemasPyInterval);
	}
}

function _schemasPyLoad () {
	var _schemas = fs.readFileSync (_schemasJsonPath, "utf8");
	_schemas = JSON.parse (_schemas);
	_schemasPyCache = _schemas;
	_schemasCache = null;
}

_schemasPyLoad ();
_schemasPyRefresh ();

// ---------------------------------------

var _schemasCtlInterval = 1000;
var _schemasCtlCache = null;

function _schemasCtlRefresh () {
	controller.getConfigurators (function (_error, _outcome) {
		if (_error == null) {
			if (_outcome.ok) {
				setTimeout (_schemasCtlRefresh, _schemasCtlInterval);
				var _schemas = {};
				_ (_outcome.configurators) .each (function (_configurator) {
					_schemas[_configurator.type] = {
							configurationTemplate : null,
							callOperations : {},
							castOperations : {},
					};
				});
				_schemasCtlCache = _schemas;
				_schemasCache = null;
			} else {
				transcript.traceError ("controller failed; rescheduling...");
				setTimeout (_schemasCtlRefresh, _schemasCtlInterval * 4);
			}
		} else {
			transcript.traceError ("controller failed; rescheduling...");
			setTimeout (_schemasCtlRefresh, _schemasCtlInterval * 4);
		}
	});
}

_schemasCtlRefresh ();

// ---------------------------------------

var _schemasCache = null;

function _processes () {
	var _schemas = _schemasCache;
	if (_schemas == null) {
		_schemas = {};
		if (_schemasCtlCache != null)
			_ (_schemas) .extend (_schemasCtlCache);
		if (_schemasPyCache != null)
			_ (_schemas) .extend (_schemasPyCache);
	}
	return (_schemas);
}

// ---------------------------------------

module.exports.processes = _processes;

// ---------------------------------------
