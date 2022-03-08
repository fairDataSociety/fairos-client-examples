fs = require('fs');
var W3CWebSocket = require('websocket').w3cwebsocket;
const websocketStream = require('websocket-stream/stream');

// Establish a websocket connection
var ws = new W3CWebSocket("ws://localhost:9090/ws/v1/");

// Import events
var events = require('./events');

/*
    The following code block is for the demo only
    dont hard code password in your project
*/
var username = "user_"+(Date.now() / 1000).toFixed(0)
var password = "159263487"
var podName = "pod1"

function downloadFile() {
    var data = {
        "event": events.FileDownload,
        "params": {
            "pod_name": podName,
            "file_path": "/index.json"
        }
    }
    ws.send(JSON.stringify(data))
}

function uploadFile() {
    var pathOfFile = "../resources/somefile.json"
    var stat = fs.statSync(pathOfFile);
    var data = {
        "event": events.FileUpload,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "dir_path":"/",
            "block_size": "1Mb",
            "content_length": stat.size.toString()
        }
    }

    ws.send(JSON.stringify(data))

    const source = fs.createReadStream(pathOfFile)
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {

    });
    source.on('error', function (err) {
        console.log("error" + err);
    });
}

function loadCSV() {
    var pathOfFile = "../resources/somefile.csv"
    var stat = fs.statSync(pathOfFile);
    var data = {
        "event": events.KVLoadCSV,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "table_name": table,
            "content_length": stat.size.toString()
        }
    }

    ws.send(JSON.stringify(data))

    const source = fs.createReadStream(pathOfFile)
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {

    });
    source.on('error', function (err) {
        console.log("error" + err);
    });
}

function loadJSON() {
    var pathOfFile = "../resources/somefile.json"
    var stat = fs.statSync(pathOfFile);
    console.log(stat.size.toString())
    var data = {
        "event": events.DocLoadJson,
        "params": {
            "pod_name": podName,
            "file_name": "index.json",
            "table_name": docTable,
            "content_length": stat.size.toString()
        }
    }

    ws.send(JSON.stringify(data))

    const source = fs.createReadStream("../resources/somefile.json")
    source.on('data', function (chunk) {
        ws.send(chunk)
    });
    source.on('end', function () {

    });
    source.on('error', function (err) {
        console.log("error" + err);
    });
}


function userSignUp() {
    var data = {
        "event": events.UserSignup,
        "params": {
            "user_name": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function userLogin() {
    var data = {
        "event": events.UserLogin,
        "params": {
            "user_name": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function userLoggedin() {
    var data = {
        "event": events.UserIsLoggedin,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}


function userPresent() {
    var data = {
        "event": events.UserPresent,
        "params": {
            "user_name": username,
        }
    }
    console.log(data)
    ws.send(JSON.stringify(data))
}

function userExport() {
    var data = {
        "event": events.UserExport,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

function userStat() {
    var data = {
        "event": events.UserStat,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

function podNew() {
    var data = {
        "event": events.PodNew,
        "params": {
            "pod_name": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function podOpen() {
    var data = {
        "event": events.PodOpen,
        "params": {
            "pod_name": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

function podLs() {
    var data = {
        "event": events.PodLs,
    }
    ws.send(JSON.stringify(data))
}

function mkDir() {
    var data = {
        "event": events.DirMkdir,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function rmDir() {
    var data = {
        "event": events.DirRmdir,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function dirLs() {
    var data = {
        "event": events.DirLs,
        "params": {
            "pod_name": podName,
            "dir_path": "/"
        }
    }
    ws.send(JSON.stringify(data))
}

function dirStat() {
    var data = {
        "event": events.DirStat,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function dirPresent() {
    var data = {
        "event": events.DirIsPresent,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

function stat() {
    var data = {
        "event": events.FileStat,
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
        "event": events.KVCreate,
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
        "event": events.KVList,
        "params": {
            "pod_name": podName
        }
    }
    ws.send(JSON.stringify(data))
}

function kvOpen() {
    var data = {
        "event": events.KVOpen,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

function kvEntryPut() {
    var data = {
        "event": events.KVEntryPut,
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
        "event": events.KVCount,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

function kvGet() {
    var data = {
        "event": events.KVEntryGet,
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
        "event": events.KVSeek,
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
        "event": events.KVSeekNext,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

function kvEntryDel() {
    var data = {
        "event": events.KVEntryDelete,
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
        "event": events.DocCreate,
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
        "event": events.DocList,
        "params": {
            "pod_name": podName,
            "table_name": docTable
        }
    }
    ws.send(JSON.stringify(data))
}

function docOpen() {
    var data = {
        "event": events.DocOpen,
        "params": {
            "pod_name": podName,
            "table_name": docTable
        }
    }
    ws.send(JSON.stringify(data))
}

function docEntryPut() {
    var data = {
        "event": events.DocEntryPut,
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
        "event": events.DocEntryGet,
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
        "event": events.DocFind,
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
        "event": events.DocCount,
        "params": {
            "pod_name": podName,
            "table_name": docTable,
        }
    }
    ws.send(JSON.stringify(data))
}

function docEntryDel() {
    var data = {
        "event": events.DocEntryDel,
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
        "event": events.DocDelete,
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
        if (data.event == events.FileDownload) {
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