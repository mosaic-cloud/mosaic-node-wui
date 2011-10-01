// ---------------------------------------

if (require.main !== module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var dust = require ("dust");
var express = require ("express");
var express_dust = require ("express-dust");
var path = require ("path");

var configuration = require ("./configuration");
var transcript = require ("./transcript") (module, configuration.mainTranscriptLevel);

var _views = ["cluster"];

// ---------------------------------------

function _main () {
	
	if (process.argv.length != 2) {
		transcript.traceError ("invalid arguments; aborting!");
		process.exit (1);
		return;
	}
	
	var _application = express.createServer ();
	
	_ (_views) .chain ()
			.map (function (_view) { return ("./views/" + _view); })
			.map (function (_module) { return (require (_module)); })
			.invoke ("configureApplication", _application);
	
	_application.listen (9999);
}

// ---------------------------------------

express_dust.getViewPathBase = path.join (path.dirname (module.filename), 'views');
express_dust.getViewPartialPathBase = path.join (path.dirname (module.filename), 'views', 'partial');

// ---------------------------------------

_main ();

// ---------------------------------------
