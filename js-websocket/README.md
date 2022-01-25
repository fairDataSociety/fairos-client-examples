# fairos-websocket-client (js websocket implementation)

This directory contains examples of communicating with FairOS using websockets in JavaScript.

In the example, we opened a new websocket connection and send various events to the FairOS server. 
There is a message handler that is executed whenever a new message is received from the server. 
That handler prints the response of the server to console.

# fairos-websocket-client

FairOS websocket clients should be an extension on the [FairOS OpenAPI specification](https://docs.fairos.fairdatasociety.org/api/),
with introduction of events for seamless communication over a websocket connection.

### Events
All the events correspond to similar REST api calls as in the OpenAPI Specification.

Available events

```
    "/user/signup"
    "/user/login"
    "/user/import"
    "/user/present"
    "/user/isloggedin"
    "/user/logout"
    "/user/export"
    "/user/delete"
    "/user/stat"
    "/pod/new"
    "/pod/open"
    "/pod/close"
    "/pod/sync"
    "/pod/delete"
    "/pod/ls"
    "/pod/stat"
    "/pod/share"
    "/pod/receive"
    "/pod/receiveinfo"
    "/dir/present"
    "/dir/mkdir"
    "/dir/rmdir"
    "/dir/ls"
    "/dir/stat"
    "/file/download"
    "/file/download/stream"
    "/file/upload"
    "/file/upload/stream"
    "/file/share"
    "/file/receive"
    "/file/receiveinfo"
    "/file/delete"
    "/file/stat"
    "/kv/new"
    "/kv/ls"
    "/kv/open"
    "/kv/delete"
    "/kv/count"
    "/kv/entry/put"
    "/kv/entry/get"
    "/kv/entry/del"
    "/kv/loadcsv"
    "/kv/loadcsv/stream"
    "/kv/seek"
    "/kv/seek/next"
    "/doc/new"
    "/doc/ls"
    "/doc/open"
    "/doc/count"
    "/doc/delete"
    "/doc/find"
    "/doc/entry/put"
    "/doc/entry/get"
    "/doc/entry/del"
    "/doc/loadjson"
    "/doc/loadjson/stream"
    "/doc/indexjson"
```

### Connection

To make a successful websocket connection we need to dial the following

```
    var base = localhost:9090
    
    // replace base with a running fairOS server api endpoint
    var uri = ws://base/ws/v1/
```

### Requests & Responses

FairOS websocket communication relies on request-response model. After a successful connection is made, we can
send an event request with its required payload and expect an event response with associated payload.

> **_NOTE:_** we can relate each event with a REST api and refer to that request and response body from the OpenAPI Specification

Here is how an event request should look like
```
{
    "event": "/user/signup",
    "params": {
        "user_name": "brand_new_user",
        "password": "VerySecretPassword"
    }
}
```

For each event request, server will send the response associated with the request along with the same event and `status_code`.
The `status_code` will indicate the same as if it were a REST api call.


For the above event request we will get the following response if the is no error.
```
{
    "event":"/user/signup",
    "code":201,
    "params":{
        "address":"0x268d2Ec795ea7677981135DE235e49FfD5634C46",
        "mnemonic":"network purse sudden loop forget accuse autumn win weird glow father unique"
    }
}
```

### File upload

Currently, we have a total of three events that deals with file upload.
```
    "/file/upload"
    "/doc/loadjson"
    "/kv/loadcsv"
```

To upload a file via a websocket connection we need to first request for the event then send the file as `BinaryMessage`
in following request.

> **_NOTE:_** Please refer to the client implementation for more details.

### File upload (stream)

Currently, we have a total of three events that deals with file upload via streaming.
```
    "/file/upload/stream"
    "/doc/loadjson/stream"
    "/kv/loadcsv/stream"
```

To upload a file via streaming using a websocket connection we need to first request for the event then send the file as `BinaryMessage`
in subsequent requests. The first request must have `content_length` as a parameter stating the size of the file, otherwise upload will fail.

> **_NOTE:_** Please refer to the client implementation for more details.

### File download

Event `/file/download` deals with file download. Server will first send event response for `/event/download`
then send the file content as `BinaryMessage` or `Blob` in the following response.

### File download (stream)

Event `/file/download/stream` will stream file to be downloaded. Server will first send event response for `/event/download`
then send the file content as `BinaryMessage` or `Blob` in the subsequent responses. The first response will contain the `content_length`.
We can compare the `content_length` with the data being sent with the responses and know how much we have downloaded.

> **_NOTE:_** Please refer to the client implementation for more details.

### Authentication

These following events do not need any authentication/cookie for getting an event response.

 ```
    "/user/signup"
    "/user/login"
    "/user/import"
    "/user/present"
    "/user/isloggedin"
    "/pod/receive"
    "/pod/receiveinfo"
 ```

All the other events must have a valid cookie to operate. The cookie is handled internally in the server.
To get response from other events we need to authenticate the with a valid user credential first after a
successful websocket connection. i.e., To get a valid response we have to call the login event in each
websocket connection before calling events other than the above ones.

### Ping-Pong

To close long-running idle connections we have a PING-Pong check. The maximum deadline for an idle connection is 4 seconds.
The server sends a PING every 3.6 second interval, to which the client needs to send PONG. If the client does not reply with a PONG
withing that time, the connection will be terminated.