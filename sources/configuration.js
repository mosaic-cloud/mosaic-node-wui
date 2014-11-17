// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _defaultTranscriptLevel = "information";
module.exports.mainTranscriptLevel = _defaultTranscriptLevel;
module.exports.libTranscriptLevel = _defaultTranscriptLevel;

// ---------------------------------------

var _nodeIp = "127.0.155.0";
var _nodePort = 31808;

if (process.env["mosaic_node_ip"] !== undefined)
	_nodeIp = process.env["mosaic_node_ip"];
if (process.env["mosaic_node_port"] !== undefined)
	_nodePort = parseInt (process.env["mosaic_node_port"]);

module.exports.nodeIp = _nodeIp;
module.exports.nodePort = _nodePort;

// ---------------------------------------

var _serverIp = "127.0.155.0";
var _serverPort = 31804;

if (process.env["mosaic_node_wui_ip"] !== undefined)
	_serverIp = process.env["mosaic_node_wui_ip"];
if (process.env["mosaic_node_wui_port"] !== undefined)
	_serverPort = parseInt (process.env["mosaic_node_wui_port"]);

module.exports.serverIp = _serverIp;
module.exports.serverPort = _serverPort;

// ---------------------------------------
