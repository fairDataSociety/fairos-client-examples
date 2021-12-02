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
    "/file/upload"
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
send an event request with their required payload and expect an event response with associated payload.

> **_NOTE:_** we can relate each event with a REST api and refer to that request and response body from the OpenAPI Specification

Here is how an event request body should look like
```
{
    "event": "/user/signup"
    "params": {
        "user_name": "brand_new_user",
        "password": "VerySecretPassword"
    }
}
```

For each event request, server will send the response associated with the request along with the event and `status_code`.
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

To upload a file via a websocket connection we need to first request for the event then send the file in `BinaryMessage`
in subsequent requests.

> **_NOTE:_** Please refer to the client for implementation more details. 

### File download

Event `/file/download` deals with file download. Server will first send event response for `/event/download` 
then send the file content in `BinaryMessage` in subsequent responses.

> **_NOTE:_** Please refer to the client for implementation more details. 
 
