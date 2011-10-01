// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var dust = require ("dust");
var express = require ("express");

var controller = require ("../controller");

var configuration = require ("../configuration");
var transcript = require ("../transcript") (module, configuration.libTranscriptLevel);

// ---------------------------------------

function _handleFront (_request, _response) {
	_response.render ("front.dust");
}

function _handleConsole (_request, _response) {
	_response.render ("console.dust");
}

function _handleAbout (_request, _response) {
	_response.render ("about.dust");
}

function _handleInvalid (_request, _response) {
	_response.render ("invalid.dust", {path : _request.url, query : JSON.stringify (_request.query), method : _request.method});
}

// ---------------------------------------

function _handleQueryNodes (_request, _response) {
	controller.getClusterNodes (function (_error, _outcome) {
		if (_error === null)
			_response.render ("cluster_nodes.dust", {outcome : _outcome});
		else
			_response.render ("failed.dust", {error : _error});
	});
}

function _handleQueryRing (_request, _response) {
	controller.getClusterRing (function (_error, _outcome) {
		if (_error === null)
			_response.render ("cluster_ring.dust", {outcome : _outcome});
		else
			_response.render ("failed.dust", {error : _error});
	});
}

// ---------------------------------------

var _configureApplication = function  (_application) {
	
	_application.get ("/", _handleFront);
	_application.get ("/console", _handleConsole);
	_application.get ("/about", _handleAbout);
	_application.get ("/cluster/nodes", _handleQueryNodes);
	_application.get ("/cluster/ring", _handleQueryRing);
	
	_application.get ("*", _handleInvalid);
	_application.put ("*", _handleInvalid);
	_application.post ("*", _handleInvalid);
	_application.delete ("*", _handleInvalid);
};

// ---------------------------------------

module.exports.configureApplication = _configureApplication;

// ---------------------------------------
