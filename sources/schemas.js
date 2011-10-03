// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _processTypes = {
		"#mosaic-components:rabbitmq" : {
			configurationTemplate : null,
		},
		"#mosaic-components:riak-kv" : {
			configurationTemplate : null,
		},
		"#mosaic-components:httpg" : {
			configurationTemplate : null,
		},
		"#mosaic-components:java-container" : {
			configurationTemplate : ["<<ComponentCallback>>", "http://<<host>>/<<component>>.jar"],
		},
		"#mosaic-components:java-cloudlet-container" : {
			configurationTemplate : ["<<http://<host>/<<cloudlet>>.jar", "<<configuration>>.properties"],
		},
		"#mosaic-components:java-driver" : {
			configurationTemplate : "<<type>>",
		},
		"#mosaic-examples-realtime-feeds:fetcher" : {
			configurationTemplate : null,
		},
		"#mosaic-examples-realtime-feeds:indexer" : {
			configurationTemplate : null,
		},
		"#mosaic-examples-realtime-feeds:frontend" : {
			configurationTemplate : null,
		},
		"#mosaic-examples-realtime-feeds:scavanger" : {
			configurationTemplate : null,
		},
		"#mosaic-examples-realtime-feeds:leacher" : {
			configurationTemplate : null,
		},
		"#mosaic-examples-realtime-feeds:pusher" : {
			configurationTemplate : null,
		},
		"#mosaic-tests:dummy" : {
			configurationTemplate : null,
		},
		"#mosaic-tests:rabbitmq" : {
			configurationTemplate : null,
		},
		"#mosaic-tests:riak-kv" : {
			configurationTemplate : null,
		},
		"#mosaic-tests:httpg" : {
			configurationTemplate : null,
		},
		"#mosaic-tests:java-container" : {
			configurationTemplate : ["<<ComponentCallback>>", "http://<<host>>/<<component>>.jar"],
		},
		"#mosaic-tests:java-component" : {
			configurationTemplate : ["<<ComponentMain>>", "http://<<host>>/<<component>>.jar"],
		},
		"#mosaic-tests:jetty-hello-world" : {
			configurationTemplate : null,
		},
};

// ---------------------------------------

module.exports.processTypes = _processTypes;

// ---------------------------------------
