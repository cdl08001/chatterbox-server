/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/
// Do some basic logging.
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.
// See the note below about CORS headers.
// Tell the client we are sending them plain text.
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.
var dummyDate = new Date('Tue Jul 03 2018 15:19:16 GMT-0700 (PDT)');
var id = 2;
var resultsArr = [{ username: 'Jono', text: 'Do my bidding!', objectID: 1, createdAt: dummyDate}];

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';
  var statusCode;
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  
  
  // If URL contains '/classes/messages', move forward:
  if (request.url.includes('/classes/messages')) {
    // Response to OPTIONS:
    if (request.method === 'OPTIONS') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end();
    }

    // Response to GET:
    if (request.method === 'GET') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: resultsArr}));
    }

    //Response to POST
    if (request.method === 'POST') {
      statusCode = 201;
      var arr = [];
      request.on('data', (chunk) => {
        arr.push(chunk);
        var readable = Buffer.concat(arr).toString();
        var chatObj = JSON.parse(readable);
        chatObj.objectId = id;
        chatObj.createdAt = new Date();
        id++;
        resultsArr.push(chatObj);
      });
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: resultsArr}));
    }
  } else {
  // Otherwise, generate a 404 error:
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }

};
module.exports.requestHandler = requestHandler;









