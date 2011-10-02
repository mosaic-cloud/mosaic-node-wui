// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _processTypes = {
		"#mosaic-components:rabbitmq" : null,
		"#mosaic-components:riak-kv" : null,
		"#mosaic-components:httpg" : null,
		"#mosaic-components:java-container" : ["<<ComponentCallback>>", "http://<<host>>/<<component>>.jar"],
		"#mosaic-components:java-cloudlet-container" : ["<<http://<host>/<<cloudlet>>.jar", "<<configuration>>.properties"],
		"#mosaic-components:java-driver" : "<<type>>",
		"#mosaic-examples-realtime-feeds:fetcher" : null,
		"#mosaic-examples-realtime-feeds:indexer" : null,
		"#mosaic-examples-realtime-feeds:frontend" : null,
		"#mosaic-examples-realtime-feeds:scavanger" : null,
		"#mosaic-examples-realtime-feeds:leacher" : null,
		"#mosaic-examples-realtime-feeds:pusher" : null,
		"#mosaic-tests:dummy" : null,
		"#mosaic-tests:rabbitmq" : null,
		"#mosaic-tests:riak-kv" : null,
		"#mosaic-tests:httpg" : null,
		"#mosaic-tests:java-container" : ["<<ComponentCallback>>", "http://<<host>>/<<component>>.jar"],
		"#mosaic-tests:java-component" : ["<<ComponentMain>>", "http://<<host>>/<<component>>.jar"],
		"#mosaic-tests:jetty-hello-world" : null,
};

// ---------------------------------------

module.exports.processTypes = _processTypes;

// ---------------------------------------
