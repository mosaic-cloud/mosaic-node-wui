// ---------------------------------------

if (require.main !== module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var dust = require ("dust");
var express = require ("express");
var path = require ("path");

var views = require ("./views");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.mainTranscriptLevel);

// ---------------------------------------

function _main ()
{
	if (process.argv.length != 2) {
		transcript.traceError ("invalid arguments; aborting!");
		process.exit (1);
		return;
	}
	
	var _application = express.createServer ();
	
	_application.configure (function () {
		views.configureApplication (_application);
	});
	
	_application.listen (9999, "127.0.0.1");
}

// ---------------------------------------

dust.filters.json = function (_value) {
	return (JSON.stringify (_value));
};

dust.filters.jsonp = function (_value) {
	return (JSON.stringify (_value, null, 4));
};

dust.filters.htmlpre = function (_value) {
	return (_value.replace (/</g, "&lt;") .replace (/>/g, "&gt;"));
};

// ---------------------------------------

_main ();

// ---------------------------------------
