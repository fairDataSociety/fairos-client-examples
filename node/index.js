fs = require('fs');
var W3CWebSocket = require('websocket').w3cwebsocket;
const websocketStream = require('websocket-stream/stream');


var UserSignup       = "/user/signup"
var UserLogin        = "/user/login"
var UserImport       = "/user/import"
var UserPresent      = "/user/present"
var UserIsLoggedin   = "/user/isloggedin"
var UserLogout       = "/user/logout"
var UserExport       = "/user/export"
var UserDelete       = "/user/delete"
var UserStat         = "/user/stat"
var PodNew           = "/pod/new"
var PodOpen          = "/pod/open"
var PodClose         = "/pod/close"
var PodSync          = "/pod/sync"
var PodDelete        = "/pod/delete"
var PodLs            = "/pod/ls"
var PodStat          = "/pod/stat"
var PodShare         = "/pod/share"
var PodReceive       = "/pod/receive"
var PodReceiveInfo   = "/pod/receiveinfo"
var DirIsPresent     = "/dir/present"
var DirMkdir         = "/dir/mkdir"
var DirRmdir         = "/dir/rmdir"
var DirLs            = "/dir/ls"
var DirStat          = "/dir/stat"
var FileDownload     = "/file/download/stream"
var FileUpload       = "/file/upload/stream"
var FileShare        = "/file/share"
var FileReceive      = "/file/receive"
var FileReceiveInfo  = "/file/receiveinfo"
var FileDelete       = "/file/delete"
var FileStat         = "/file/stat"
var KVCreate         = "/kv/new"
var KVList           = "/kv/ls"
var KVOpen           = "/kv/open"
var KVDelete         = "/kv/delete"
var KVCount          = "/kv/count"
var KVEntryPut       = "/kv/entry/put"
var KVEntryGet       = "/kv/entry/get"
var KVEntryDelete    = "/kv/entry/del"
var KVLoadCSV        = "/kv/loadcsv/stream"
var KVSeek           = "/kv/seek"
var KVSeekNext       = "/kv/seek/next"
var DocCreate        = "/doc/new"
var DocList          = "/doc/ls"
var DocOpen          = "/doc/open"
var DocCount         = "/doc/count"
var DocDelete        = "/doc/delete"
var DocFind          = "/doc/find"
var DocEntryPut      = "/doc/entry/put"
var DocEntryGet      = "/doc/entry/get"
var DocEntryDel      = "/doc/entry/del"
var DocLoadJson      = "/doc/loadjson/stream"
var DocIndexJson     = "/doc/indexjson"

var ws = new W3CWebSocket("ws://localhost:9090/ws/v1/");

// Let us open a web socket
var username = "user_"+(Date.now() / 1000).toFixed(0)
var password = "159263487"
var podName = "pod1"

function downloadFile() {
    var data = {
        "event": FileDownload,
        "params": {
            "pod_name": podName,
            "file_path": "/index.json"
        }
    }
    ws.send(JSON.stringify(data))
}


function uploadFile() {
    var data = {
        "event": FileUpload,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "dir_path":"/",
            "block_size": "1Mb"
        }
    }

    ws.send(JSON.stringify(data))


    // in this case we read only one pice from the file in every given time
    const source = fs.createReadStream("../resources/somefile.json")
    //after that we set the stream variable we can start geting the file data
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {
        ws.send("done")
    });
    source.on('error', function (err) {
        console.log("error" + err);//cant find file or something like that
    });
}

function loadCSV() {
    var data = {
        "event": KVLoadCSV,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "table_name": table,
        }
    }

    ws.send(JSON.stringify(data))


    // in this case we read only one pice from the file in every given time
    const source = fs.createReadStream("../resources/somefile.csv")
    //after that we set the stream variable we can start geting the file data
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {
        ws.send("done")
    });
    source.on('error', function (err) {
        console.log("error" + err);//cant find file or something like that
    });
}

function loadJSON() {
    var data = {
        "event": DocLoadJson,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "table_name": docTable,
        }
    }

    ws.send(JSON.stringify(data))


    // in this case we read only one pice from the file in every given time
    const source = fs.createReadStream("../resources/somefile.json")
    //after that we set the stream variable we can start geting the file data
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {
        ws.send("done")
    });
    source.on('error', function (err) {
        console.log("error" + err);//cant find file or something like that
    });
}


function uploadFile() {
    var data = {
        "event": FileUpload,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "dir_path":"/",
            "block_size": "1Mb"
        }
    }

    ws.send(JSON.stringify(data))


    // in this case we read only one pice from the file in every given time
    const source = fs.createReadStream("../resources/somefile.json")
    //after that we set the stream variable we can start geting the file data
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {
        ws.send("done")
    });
    source.on('error', function (err) {
        console.log("error" + err);//cant find file or something like that
    });
}


function userSignUp() {
    var data = {
        "event": UserSignup,
        "params": {
            "user_name": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function userLogin() {
    var data = {
        "event": UserLogin,
        "params": {
            "user_name": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function userLoggedin() {
    var data = {
        "event": UserIsLoggedin,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}


function userPresent() {
    var data = {
        "event": UserPresent,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

function userExport() {
    var data = {
        "event": UserExport,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

function userStat() {
    var data = {
        "event": UserStat,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

function podNew() {
    var data = {
        "event": PodNew,
        "params": {
            "pod_name": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function podOpen() {
    var data = {
        "event": PodOpen,
        "params": {
            "pod_name": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function podLs() {
    var data = {
        "event": PodLs,
    }
    ws.send(JSON.stringify(data))
}

function mkDir() {
    var data = {
        "event": DirMkdir,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function rmDir() {
    var data = {
        "event": DirRmdir,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function dirLs() {
    var data = {
        "event": DirLs,
        "params": {
            "pod_name": podName,
            "dir_path": "/"
        }
    }
    ws.send(JSON.stringify(data))
}

function dirStat() {
    var data = {
        "event": DirStat,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function dirPresent() {
    var data = {
        "event": DirIsPresent,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function stat() {
    var data = {
        "event": FileStat,
        "params": {
            "pod_name": podName,
            "file_path": "/index.json"
        }
    }
    ws.send(JSON.stringify(data))
}

var table = "kv_1"
function kvCreate() {
    var data = {
        "event": KVCreate,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "index_type": "string"
        }
    }
    ws.send(JSON.stringify(data))
}

function kvList() {
    var data = {
        "event": KVList,
        "params": {
            "pod_name": podName
        }
    }
    ws.send(JSON.stringify(data))
}

function kvOpen() {
    var data = {
        "event": KVOpen,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

function kvEntryPut() {
    var data = {
        "event": KVEntryPut,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "key": "key1",
            "value": "value"
        }
    }
    ws.send(JSON.stringify(data))
}

function kvCount() {
    var data = {
        "event": KVCount,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

function kvGet() {
    var data = {
        "event": KVEntryGet,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "key": "key1",
        }
    }
    ws.send(JSON.stringify(data))
}

function kvSeek() {
    var data = {
        "event": KVSeek,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "start_prefix": "key",
        }
    }
    ws.send(JSON.stringify(data))
}

function kvSeekNext() {
    var data = {
        "event": KVSeekNext,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

function kvEntryDel() {
    var data = {
        "event": KVEntryDelete,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "key": "key1",
        }
    }
    ws.send(JSON.stringify(data))
}

var docTable = "doc_1"
function docCreate() {
    var data = {
        "event": DocCreate,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
            "si": "first_name=string,age=number",
            "mutable": true
        }
    }
    ws.send(JSON.stringify(data))
}

function docLs() {
    var data = {
        "event": DocList,
        "params": {
            "pod_name": podName,
            "table_name": docTable
        }
    }
    ws.send(JSON.stringify(data))
}

function docOpen() {
    var data = {
        "event": DocOpen,
        "params": {
            "pod_name": podName,
            "table_name": docTable
        }
    }
    ws.send(JSON.stringify(data))
}

function docEntryPut() {
    var data = {
        "event": DocEntryPut,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
            "doc":  `{"id":"1", "first_name": "Hello1", "age": 11}`,
        }
    }
    ws.send(JSON.stringify(data))
}

function docEntryGet() {
    var data = {
        "event": DocEntryGet,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
            "id":  "1",
        }
    }
    ws.send(JSON.stringify(data))
}

function docFind() {
    var data = {
        "event": DocFind,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
            "expr":  `age>10`,
        }
    }
    ws.send(JSON.stringify(data))
}

function docCount() {
    var data = {
        "event": DocCount,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
        }
    }
    ws.send(JSON.stringify(data))
}

function docEntryDel() {
    var data = {
        "event": DocEntryDel,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
            "id":  "1",
        }
    }
    ws.send(JSON.stringify(data))
}

function docDel() {
    var data = {
        "event": DocDelete,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
        }
    }
    ws.send(JSON.stringify(data))
}

WebSocketTest()
functions = [
    userPresent,
    userLoggedin,
    userStat,         
    userSignUp,
    userLogin,
    userPresent,
    userLoggedin,
    userStat,
    userExport,
    podNew,
    podOpen,
    podLs,
    mkDir,
    rmDir,
    dirLs,
    dirStat,
    dirPresent,
    stat,
    kvCreate,
    kvList,
    kvOpen,
    kvEntryPut,
    kvCount,
    kvGet,
    kvSeek,
    kvSeekNext,
    loadCSV,
    kvEntryDel,
    docCreate,
    docLs,
    docOpen,
    docEntryPut,
    docEntryGet,
    docFind,
    loadJSON,
    docCount,
    docEntryDel,
    docDel,
    uploadFile,
    downloadFile,
]

function WebSocketTest() {
    var count = 0
    ws.onopen = function() {  
       console.log("connected")
       functions[count]()
    };
    let writer
    downloadStarted = false
    file_name = ""
    ws.onmessage = function(evt) { 
        var received_msg = evt.data
        if (evt.data instanceof ArrayBuffer) {
            writer.write(Buffer.from(evt.data))
            return
        }
        var data = JSON.parse(received_msg) 
        if (data.event == FileDownload) {
            if (downloadStarted == false) {
                console.log("Download starting", data.params["content_length"])
                file_name = data.params["file_name"]
                writer = fs.createWriteStream("../resources/"+file_name) 
                downloadStarted = true
            } else {
                writer.end()
                downloadStarted = false
            }
        } else {
            count++
        functions[count]()
        }
        console.log(data)
        
    };
    
    ws.onclose = function() { 
        console.log("closed")
    };
   
}