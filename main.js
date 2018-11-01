var http = require("http");
var data = require("fs");

http.createServer(function(request, response){
	
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end("Hello World\n");
}).listen(8001);

console.log("Server is running");
