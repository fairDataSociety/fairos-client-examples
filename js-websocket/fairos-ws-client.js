var UserLoginV2        = "/user/loginV2"
var UserPresentV2      = "/user/presentV2"
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
var FileDownload     = "/file/download"
var FileUpload       = "/file/upload"
var FileUploadStream = "/file/upload/stream"
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
var KVLoadCSV        = "/kv/loadcsv"
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
var DocLoadJson      = "/doc/loadjson"
var DocIndexJson     = "/doc/indexjson"

// Let us open a web socket
var username = "c565c97b2d5cb9d87059cb23ab4d9fcd"
var password = "756e3c095324"
var podName = "pod"
var ws = new WebSocket("ws://localhost:9090/ws/v1/")

function downloadFile() {
    var data = {
        "event": FileDownload,
        "params": {
            "pod_name": podName,
            "file_path": "/image.pdf"
        }
    }
    ws.send(JSON.stringify(data))
}


function uploadFileStream() {
    var oFile = document.getElementById('fileupload').files[0]
    var reader = new FileReader();
    var read = 0;
    var unit = 1024 * 512;
    var blob;

    var data = {
        "event": FileUploadStream,
        "params": {
            "podName": podName,
            "fileName": "image.pdf",
            "dirPath":"/",
            "blockSize": "1Mb",
            "contentLength": oFile.size.toString()
        }
    }
    ws.send(JSON.stringify(data))


    if (oFile.size < read + unit) {
        blob = oFile.slice(read, oFile.size);
        console.log(blob)
        ws.send(blob)
    } else {
        while (1) {
            if (read < oFile.size && read + unit < oFile.size) {
                blob = oFile.slice(read, read + unit);
                console.log(blob)
                ws.send(blob)
                read += unit;
            } else {
                blob = oFile.slice(read, oFile.size);
                console.log(blob)
                ws.send(blob)
                break
            }
        }
    }
}

function uploadFile() {
    var data = {
        "event": FileUpload,
        "params": {
            "podName": podName,
            "fileName": "index.json",
            "dirPath":"/",
            "blockSize": "1Mb"
        }
    }
    ws.send(JSON.stringify(data))
    ws.send(fileupload.files[0])
    ws.send("done")
}

userLogin = function() {
    var data = {
        "event": UserLoginV2,
        "params": {
            "userName": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

userLoggedin = function() {
    var data = {
        "event": UserIsLoggedin,
        "params": {
            "userName": username,
        }
    }
    ws.send(JSON.stringify(data))
}


userPresent = function() {
    var data = {
        "event": UserPresentV2,
        "params": {
            "userName": username,
        }
    }
    ws.send(JSON.stringify(data))
}

userStat = function() {
    var data = {
        "event": UserStat,
        "params": {
            "userName": username,
        }
    }
    ws.send(JSON.stringify(data))
}

podNew = function() {
    var data = {
        "event": PodNew,
        "params": {
            "podName": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

podOpen = function() {
    var data = {
        "event": PodOpen,
        "params": {
            "podName": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

podLs = function() {
    var data = {
        "event": PodLs,
    }
    ws.send(JSON.stringify(data))
}

mkDir = function() {
    var data = {
        "event": DirMkdir,
        "params": {
            "podName": podName,
            "dirPath": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

rmDir = function() {
    var data = {
        "event": DirRmdir,
        "params": {
            "podName": podName,
            "dirPath": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

dirLs = function() {
    var data = {
        "event": DirLs,
        "params": {
            "podName": podName,
            "dirPath": "/"
        }
    }
    ws.send(JSON.stringify(data))
}

dirStat = function() {
    var data = {
        "event": DirStat,
        "params": {
            "podName": podName,
            "dirPath": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

dirPresent = function() {
    var data = {
        "event": DirIsPresent,
        "params": {
            "podName": podName,
            "dirPath": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

stat = function() {
    var data = {
        "event": FileStat,
        "params": {
            "podName": podName,
            "filePath": "/index.json"
        }
    }
    ws.send(JSON.stringify(data))
}

var table = "kv_1"
kvCreate = function() {
    var data = {
        "event": KVCreate,
        "params": {
            "podName": podName,
            "tableName": table,
            "indexType": "string"
        }
    }
    ws.send(JSON.stringify(data))
}

kvList = function() {
    var data = {
        "event": KVList,
        "params": {
            "podName": podName
        }
    }
    ws.send(JSON.stringify(data))
}

kvOpen = function() {
    var data = {
        "event": KVOpen,
        "params": {
            "podName": podName,
            "tableName": table,
        }
    }
    ws.send(JSON.stringify(data))
}

kvEntryPut = function() {
    var data = {
        "event": KVEntryPut,
        "params": {
            "podName": podName,
            "tableName": table,
            "key": "key1",
            "value": "value"
        }
    }
    ws.send(JSON.stringify(data))
}

kvCount = function() {
    var data = {
        "event": KVCount,
        "params": {
            "podName": podName,
            "tableName": table,
        }
    }
    ws.send(JSON.stringify(data))
}

kvGet = function() {
    var data = {
        "event": KVEntryGet,
        "params": {
            "podName": podName,
            "tableName": table,
            "key": "key1",
        }
    }
    ws.send(JSON.stringify(data))
}

kvSeek = function() {
    var data = {
        "event": KVSeek,
        "params": {
            "podName": podName,
            "tableName": table,
            "start_prefix": "key",
        }
    }
    ws.send(JSON.stringify(data))
}

kvSeekNext = function() {
    var data = {
        "event": KVSeekNext,
        "params": {
            "podName": podName,
            "tableName": table,
        }
    }
    ws.send(JSON.stringify(data))
}

kvEntryDel = function() {
    var data = {
        "event": KVEntryDelete,
        "params": {
            "podName": podName,
            "tableName": table,
            "key": "key1",
        }
    }
    ws.send(JSON.stringify(data))
}

var docTable = "doc_1"
docCreate = function() {
    var data = {
        "event": DocCreate,
        "params": {
            "podName": podName,
            "tableName": table,
            "si": "first_name=string,age=number",
            "mutable": true
        }
    }
    ws.send(JSON.stringify(data))
}

docLs = function() {
    var data = {
        "event": DocList,
        "params": {
            "podName": podName,
            "table_name": table
        }
    }
    ws.send(JSON.stringify(data))
}

docOpen = function() {
    var data = {
        "event": DocOpen,
        "params": {
            "podName": podName,
            "tableName": table
        }
    }
    ws.send(JSON.stringify(data))
}

docEntryPut = function() {
    var data = {
        "event": DocEntryPut,
        "params": {
            "podName": podName,
            "tableName": table,
            "doc":  `{"id":"1", "first_name": "Hello1", "age": 11}`,
        }
    }
    ws.send(JSON.stringify(data))
}

docEntryGet = function() {
    var data = {
        "event": DocEntryGet,
        "params": {
            "podName": podName,
            "tableName": table,
            "id":  "1",
        }
    }
    ws.send(JSON.stringify(data))
}

docFind = function() {
    var data = {
        "event": DocFind,
        "params": {
            "podName": podName,
            "tableName": table,
            "expr":  `age>10`,
        }
    }
    ws.send(JSON.stringify(data))
}

docCount = function() {
    var data = {
        "event": DocCount,
        "params": {
            "podName": podName,
            "tableName": table,
        }
    }
    ws.send(JSON.stringify(data))
}

docEntryDel = function() {
    var data = {
        "event": DocEntryDel,
        "params": {
            "podName": podName,
            "tableName": table,
            "id":  "1",
        }
    }
    ws.send(JSON.stringify(data))
}

docDel = function() {
    var data = {
        "event": DocDelete,
        "params": {
            "podName": podName,
            "tableName": table,
        }
    }
    ws.send(JSON.stringify(data))
}

WebSocketTest()

function WebSocketTest() {
    ws.onopen = function() {  
        userPresent()
        userLoggedin()
        userStat()
        userLogin()
        userPresent()
        userLoggedin()
        userStat()
        podNew()
        podOpen()
        podLs()
        mkDir()
        rmDir()
        dirLs()
        dirStat()
        dirPresent()
        stat()
        kvCreate()
        kvList()
        kvOpen()
        kvEntryPut()
        kvCount()
        kvGet()
        kvSeek()
        kvSeekNext()
        kvEntryDel()
        docCreate()
        docLs()
        docOpen()
        docEntryPut()
        docEntryGet()
        docFind()
        docCount()
        docEntryDel()
        docDel()
        console.log("connected")
    };
    ws.onmessage = function (evt) {
        var received_msg = evt.data
        if (evt.data instanceof Blob) {
            const a = document.createElement('a')
            a.href = window.URL.createObjectURL(evt.data)
            a.download = 'file'
            a.click()
            return
        }

        var data = JSON.parse(received_msg) 
        if (data.event == FileDownload && data.params["content_length"] != null) {
            console.log("Download file size", data.params["content_length"])
        }
        console.log(data)
    };
    
    ws.onclose = function() { 
        console.log("closed")
    };
   
}

