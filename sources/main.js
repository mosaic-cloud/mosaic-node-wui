// ---------------------------------------

if (require.main !== module)
	throw (new Error ());

// ---------------------------------------

var _ = require ("underscore");
var dust = require ("dust");
var express = require ("express");
var path = require ("path");
var querystring = require ("querystring");

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
	
	if (process.env["mosaic_node_ip"] !== undefined)
		configuration.nodeIp = process.env["mosaic_node_ip"];
	if (process.env["mosaic_node_port"] !== undefined)
		configuration.nodePort = parseInt (process.env["mosaic_node_port"]);
	
	if (process.env["mosaic_node_wui_ip"] !== undefined)
		configuration.serverIp = process.env["mosaic_node_wui_ip"];
	if (process.env["mosaic_node_wui_port"] !== undefined)
		configuration.serverPort = parseInt (process.env["mosaic_node_wui_port"]);
	
	process.stdin.on ("data", function (_data) {
		transcript.traceError ("unexpected data received on stdin; aborting!");
		process.exit (1);
	});
	process.stdin.on ("end", function () {
		transcript.traceInformation ("input stream closed; exiting!");
		process.exit (0);
	});
	process.stdin.resume ();
	
	var _application = express.createServer ();
	
	_application.configure (function () {
		views.configureApplication (_application);
	});
	
	transcript.traceInformation ("starting web server on `http://%s:%d/`...", configuration.serverIp, configuration.serverPort);
	_application.listen (configuration.serverPort, configuration.serverIp);
}

// ---------------------------------------

dust.filters.json = function (_value) {
	return (JSON.stringify (_value));
};
dust.filters.jsonp = function (_value) {
	return (JSON.stringify (_value, null, 4));
};
dust.filters.htmlpre = function (_value) {
	return (_value.replace (/</g, "&lt;") .replace (/>/g, "&gt;") .replace (/ /, "&nbsp;"));
};
dust.filters.insa = function (_value) {
	return (_value.replace (/((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g, "<a href='$1'>$1</a>"));
};

// ---------------------------------------

_main ();

// ---------------------------------------
