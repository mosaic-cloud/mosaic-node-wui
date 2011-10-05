// ---------------------------------------

if (require.main === module)
	throw (new Error ());

// ---------------------------------------

var _processes = {
		"#mosaic-components:rabbitmq" : {
			configurationTemplate : null,
			callOperations : {
				"mosaic-rabbitmq:get-management-endpoint" : {
					inputsTemplate : null,
					description : "<div class='row'>\
						<div class='span2 center'><a href='http://www.rabbitmq.com/'><img src='/static/rabbitmq-logo-small.png' width='80px' alt='RabbitMQ' /></a></div>\
						<div class='offset2'>\
							<h5>mosaic-rabbitmq:get-management-endpoint</h5>\
							<p>Returns the RabbitMQ management plug-in endpoint (an URL accessible through a web-browser). (For details please consult the <a href='http://www.rabbitmq.com/management.html'>dedicated page</a>.)</p>\
						</div>\
					</div>",
				},
				"mosaic-rabbitmq:get-broker-endpoint" : {
					inputsTemplate : null,
					description : "<div class='row'>\
						<div class='span2 center'><a href='http://www.rabbitmq.com/'><img src='/static/rabbitmq-logo-small.png' width='80px' alt='RabbitMQ' /></a></div>\
						<div class='offset2'>\
							<h5>mosaic-rabbitmq:get-broker-endpoint</h5>\
							<p>Returns the RabbitMQ broker endpoint (IP and port) which can be accessed with any <a href='http://www.rabbitmq.com/devtools.html'>compatible client</a>.</p>\
						</div>\
					</div>",
				},
			},
			castOperations : {},
			description : "<div class='row'>\
				<div class='span2 center'><a href='http://www.rabbitmq.com/'><img src='/static/rabbitmq-logo-small.png' width='80px' alt='RabbitMQ' /></a></div>\
				<div class='offset2'>\
					<h5>mosaic-components:rabbitmq</h5>\
					<p>RabbitMQ is an <a href='http://amqp.org/'>AMQP</a> compliant message queue broker. (For details please consult the <a href='http://www.rabbitmq.com/'>dedicated page</a>.)</p>\
					<p>This is a customized version of RabbitMQ which presents itself as an integrated mOSAIC component, allowing the user to easily control and monitor the broker as a uniform mOSAIC component.</p>\
				</div>\
			</div>",
		},
		"#mosaic-components:riak-kv" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
			description : "<div class='row'>\
				<div class='span2 center'><a href='http://www.basho.com/products_riak_overview.php'><img src='/static/riak-logo-small.png' width='80px' alt='Riak' /></a></div>\
				<div class='offset2'>\
					<h5>mosaic-components:riak-kv</h5>\
					<p>Riak is a Dynamo-inspired key / value store. (For details please consult the <a href='http://www.basho.com/products_riak_overview.php'>dedicated page</a>.)</p>\
					<p>This is a customized version of Riak which presents itself as an integrated mOSAIC component, allowing the user to easily control and monitor the broker as a uniform mOSAIC component.</p>\
				</div>\
			</div>",
		},
		"#mosaic-components:httpg" : {
			configurationTemplate : null,
			callOperations : {},
			castOperations : {},
			description : "<div class='row'>\
				<div class='span2 center'><a href='http://www.mosaic-cloud.eu/'><img src='/static/mosaic-logo-small.png' width='80px' alt='mOSAIC' /></a></div>\
				<div class='offset2'>\
					<h5>mosaic-components:httpg</h5>\
					<p>...</p>\
				</div>\
			</div>",
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
