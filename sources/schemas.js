// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var child_process = require ("child_process");
var fs = require ("fs");
var path = require ("path");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.libTranscriptLevel);

// ---------------------------------------

var _schemasPy = path.join (path.dirname (module.filename), "schemas.py");
var _schemasPyInterval = 500;
var _schemasJsonPath = path.join (path.dirname (module.filename), "schemas.json");
var _schemasYamlPath = path.join (path.dirname (module.filename), "schemas.yaml");

function _schemasRefresh () {
	var _jsonTimestamp = fs.statSync (_schemasJsonPath) .mtime;
	var _yamlTimestamp = fs.statSync (_schemasYamlPath) .mtime;
	if (_jsonTimestamp < _yamlTimestamp) {
		transcript.traceInformation ("`schemas.yaml` seems to be newer than `schemas.json`; reprocessing...");
		var _devNull = fs.openSync ("/dev/null", "r+")
		var _child = child_process.spawn ("python2", [_schemasPy], {cwd : process.cwd (), env : process.env, customFds : [_devNull, _devNull, process.stderr]});
		fs.close (_devNull)
		_child.on ("exit", function (_code) {
			if (_code == 0)
				setTimeout (_schemasRefresh, _schemasPyInterval);
			else {
				transcript.traceError ("`schemas.yaml` seems to be invalid; rescheduling...");
				setTimeout (_schemasRefresh, _schemasPyInterval * 4);
			}
		});
	} else {
		setTimeout (_schemasRefresh, _schemasPyInterval);
	}
}

_schemasRefresh ();

function _processes () {
	var _schemas = fs.readFileSync (_schemasJsonPath, "utf8");
	_schemas = JSON.parse (_schemas);
	return (_schemas);
}

// ---------------------------------------

module.exports.processes = _processes;

// ---------------------------------------
