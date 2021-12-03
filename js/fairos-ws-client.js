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
var FileDownload     = "/file/download"
var FileUpload       = "/file/upload"
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
var username = "user_"+(Date.now() / 1000).toFixed(0)
var password = "159263487"
var podName = "pod1"
var ws = new WebSocket("ws://localhost:9090/ws/v1/")

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
    ws.send(fileupload.files[0])
}

userSignUp = function() {
    var data = {
        "event": UserSignup,
        "params": {
            "user_name": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

userLogin = function() {
    var data = {
        "event": UserLogin,
        "params": {
            "user_name": username,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

userLoggedin = function() {
    var data = {
        "event": UserIsLoggedin,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}


userPresent = function() {
    var data = {
        "event": UserPresent,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

userExport = function() {
    var data = {
        "event": UserExport,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

userStat = function() {
    var data = {
        "event": UserStat,
        "params": {
            "user_name": username,
        }
    }
    ws.send(JSON.stringify(data))
}

podNew = function() {
    var data = {
        "event": PodNew,
        "params": {
            "pod_name": podName,
            "password": password
        }
    }
    ws.send(JSON.stringify(data))
}

podOpen = function() {
    var data = {
        "event": PodOpen,
        "params": {
            "pod_name": podName,
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
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

rmDir = function() {
    var data = {
        "event": DirRmdir,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

dirLs = function() {
    var data = {
        "event": DirLs,
        "params": {
            "pod_name": podName,
            "dir_path": "/"
        }
    }
    ws.send(JSON.stringify(data))
}

dirStat = function() {
    var data = {
        "event": DirStat,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

dirPresent = function() {
    var data = {
        "event": DirIsPresent,
        "params": {
            "pod_name": podName,
            "dir_path": "/d"
        }
    }
    ws.send(JSON.stringify(data))
}

stat = function() {
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
kvCreate = function() {
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

kvList = function() {
    var data = {
        "event": KVList,
        "params": {
            "pod_name": podName
        }
    }
    ws.send(JSON.stringify(data))
}

kvOpen = function() {
    var data = {
        "event": KVOpen,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

kvEntryPut = function() {
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

kvCount = function() {
    var data = {
        "event": KVCount,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

kvGet = function() {
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

kvSeek = function() {
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

kvSeekNext = function() {
    var data = {
        "event": KVSeekNext,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

kvEntryDel = function() {
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
docCreate = function() {
    var data = {
        "event": DocCreate,
        "params": {
            "pod_name": podName,
            "table_name": table,
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
            "pod_name": podName,
            "table_name": table
        }
    }
    ws.send(JSON.stringify(data))
}

docOpen = function() {
    var data = {
        "event": DocOpen,
        "params": {
            "pod_name": podName,
            "table_name": table
        }
    }
    ws.send(JSON.stringify(data))
}

docEntryPut = function() {
    var data = {
        "event": DocEntryPut,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "doc":  `{"id":"1", "first_name": "Hello1", "age": 11}`,
        }
    }
    ws.send(JSON.stringify(data))
}

docEntryGet = function() {
    var data = {
        "event": DocEntryGet,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "id":  "1",
        }
    }
    ws.send(JSON.stringify(data))
}

docFind = function() {
    var data = {
        "event": DocFind,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "expr":  `age>10`,
        }
    }
    ws.send(JSON.stringify(data))
}

docCount = function() {
    var data = {
        "event": DocCount,
        "params": {
            "pod_name": podName,
            "table_name": table,
        }
    }
    ws.send(JSON.stringify(data))
}

docEntryDel = function() {
    var data = {
        "event": DocEntryDel,
        "params": {
            "pod_name": podName,
            "table_name": table,
            "id":  "1",
        }
    }
    ws.send(JSON.stringify(data))
}

docDel = function() {
    var data = {
        "event": DocDelete,
        "params": {
            "pod_name": podName,
            "table_name": table,
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
        userSignUp()
        userLogin()
        userPresent()
        userLoggedin()
        userStat()
        userExport()
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
        if (data.event == FileDownload) {
            console.log("Download file size", data.params["content_length"])
        }
        console.log(data)
    };
    
    ws.onclose = function() { 
        console.log("closed")
    };
   
}

