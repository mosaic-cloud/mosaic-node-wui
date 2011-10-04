// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _processes = {
		"#mosaic-components:rabbitmq" : {
			configurationTemplate : null,
			callOperations : {
				"mosaic-rabbitmq:get-management-endpoint" : null,
				"mosaic-rabbitmq:get-broker-endpoint" : null,
			},
			castOperations : {},
			description : "<p>Some text here...</p><p>Some other text there...</p>",
		},
		"#mosaic-components:riak-kv" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-components:httpg" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-components:java-container" : {
			configurationTemplate : ["<<ComponentCallback>>", "http://<<host>>/<<component>>.jar"],
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-components:java-cloudlet-container" : {
			configurationTemplate : ["<<http://<host>/<<cloudlet>>.jar", "<<configuration.properties>>"],
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-components:java-driver" : {
			configurationTemplate : "<<type>>",
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-examples-realtime-feeds:fetcher" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-examples-realtime-feeds:indexer" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-examples-realtime-feeds:frontend" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-examples-realtime-feeds:scavanger" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-examples-realtime-feeds:leacher" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-examples-realtime-feeds:pusher" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-tests:dummy" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-tests:java-container" : {
			configurationTemplate : ["<<ComponentCallback>>", "http://<<host>>/<<component.jar>>"],
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-tests:java-component" : {
			configurationTemplate : ["<<ComponentMain>>", "http://<<host>>/<<component.jar>>"],
			callOperations : {},
			castOperations : {},
		},
		"#mosaic-tests:jetty-hello-world" : {
			configurationTemplate : null,
		},
};

_processes["#mosaic-tests:rabbitmq"] = _processes["#mosaic-components:rabbitmq"];
_processes["#mosaic-tests:riak-kv"] = _processes["#mosaic-components:riak-kv"];
_processes["#mosaic-tests:httpg"] = _processes["#mosaic-components:httpg"];

// ---------------------------------------

module.exports.processes = _processes;

// ---------------------------------------
