// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _defaultTranscriptLevel = "debugging";
module.exports.mainTranscriptLevel = _defaultTranscriptLevel;
module.exports.libTranscriptLevel = _defaultTranscriptLevel;

// ---------------------------------------

var _nodeIp = "127.0.155.1";
var _nodePort = 31808;
module.exports.nodeIp = _nodeIp;
module.exports.nodePort = _nodePort;

// ---------------------------------------
