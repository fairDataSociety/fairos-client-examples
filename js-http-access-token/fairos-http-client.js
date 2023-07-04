// Let us define properties needed for API calls
const username = "c565c97b2d5cb9d87059cb23ab4d9fcd"
const password = "756e3c095324"
const podName = "pod"
const hostv1 = "http://localhost:9090/v1";
const hostv2 = "http://localhost:9090/v2";
let token = "";

function downloadFile() {
    var data = {
        "podName": podName,
        "filePath": "/index.json"
    }
    return fetch(hostv1 + "file/download", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Authorization": "Bearer " + token,
        },
    });
}


function uploadFile() {
    const formData = new FormData();

    formData.append("files", fileupload.files[0]);
    formData.set("podName", podName);
    formData.append("fileName", "index.json");
    formData.set("dirPath", "/");
    formData.set("blockSize", "1Mb");

    fetch(hostv1 + "/file/upload", {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": "Bearer " + token,
        },
    });
}

userLogin = function() {
    var data = {
        "userName": username,
        "password": password
    };
    return fetch(hostv2 + "/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
}

userLoggedin = function() {
    var data = {
        "userName": username
    };
    return fetch(hostv1 + "/user/isloggedin" +  '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        
    });
}


userPresent = function() {
    var data = {
        "userName": username
    };
    return fetch(hostv2 + "/user/present" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        
    });
}

userStat = function() {
    var data = {
        "userName": username
    };
    return fetch(hostv1 + "/user/stat" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

podNew = function() {
    var data = {
        "podName": podName
    };
    return fetch(hostv1 + "/pod/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

podOpen = function() {
    var data = {
        "podName": podName
    };
    return fetch(hostv1 + "/pod/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

podLs = function() {
    var data = {
        "podName": podName,
        "password": password
    };
    return fetch(hostv1 + "/pod/ls", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

mkDir = function() {
    var data = {
        "podName": podName,
        "dirPath": "/d"
    };
    return fetch(hostv1 + "/dir/mkdir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

rmDir = function() {
    var data = {
        "podName": podName,
        "dirPath": "/d"
    };
    return fetch(hostv1 + "/dir/rmdir", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

dirLs = function() {
    var data = {
        "podName": podName,
        "dirPath": "/"
    };
    return fetch(hostv1 + "/dir/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

dirStat = function() {
    var data = {
        "podName": podName,
        "dirPath": "/d"
    };
    return fetch(hostv1 + "/dir/stat" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

dirPresent = function() {
    var data = {
        "podName": podName,
        "dirPath": "/d"
    };
    return fetch(hostv1 + "/dir/present" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

stat = function() {
    var data = {
        "podName": podName,
        "filePath": "/index.json"
    };
    return fetch(hostv1 + "/file/stat" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

var table = "kv_1"
kvCreate = function() {
    var data = {
        "podName": podName,
        "tableName": table,
        "indexType": "string"
    };
    return fetch(hostv1 + "/kv/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

kvList = function() {
    var data = {
        "podName": podName
    };
    return fetch(hostv1 + "/kv/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

kvOpen = function() {
    var data = {
        "podName": podName,
        "tableName": table,
    };
    return fetch(hostv1 + "/kv/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

kvEntryPut = function() {
    var data = {
        "podName": podName,
        "tableName": table,
        "key": "key1",
        "value": "value"
    };
    return fetch(hostv1 + "/kv/entry/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

kvCount = function() {
    var data = {
        "podName": podName,
        "tableName": table,
    };
    return fetch(hostv1 + "/kv/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

kvGet = function() {
    var data = {
        "podName": podName,
        "tableName": table,
        "key": "key1",
    };
    return fetch(hostv1 + "/kv/entry/get" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

kvSeek = function() {
    var data = {
        "podName": podName,
        "tableName": table,
        "startPrefix": "key",
    };
    return fetch(hostv1 + "/kv/seek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

kvSeekNext = function() {
    var data = {
        "podName": podName,
        "tableName": table,
    };
    return fetch(hostv1 + "/kv/seek/next" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

kvEntryDel = function() {
    var data = {
        "podName": podName,
        "tableName": table,
        "key": "key1",
    };
    return fetch(hostv1 + "/kv/entry/del", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

var docTable = "doc_1"
docCreate = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
        "si": "first_name=string,age=number",
        "mutable": true
    };
    return fetch(hostv1 + "/doc/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

docLs = function() {
    var data = {
        "podName": podName
    };
    return fetch(hostv1 + "/doc/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

docOpen = function() {
    var data = {
        "podName": podName,
        "tableName": docTable
    };
    return fetch(hostv1 + "/doc/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

docEntryPut = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
        "doc":  `{"id":"1", "first_name": "Hello1", "age": 11}`,
    };
    return fetch(hostv1 + "/doc/entry/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

docEntryGet = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
        "id":  "1",
    };
    return fetch(hostv1 + "/doc/entry/get" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

docFind = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
        "expr":  `age>10`,
    };
    return fetch(hostv1 + "/doc/find" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        
    });
}

docCount = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
    };
    return fetch(hostv1 + "/doc/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

docEntryDel = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
        "id":  "1",
    };
    return fetch(hostv1 + "/doc/entry/del", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

docDel = function() {
    var data = {
        "podName": podName,
        "tableName": docTable,
    };
    return fetch(hostv1 + "/doc/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
        
    });
}

function handleResponse(response) {
    console.log(response);
    response.text().then((received_msg) => {
        if (response.data instanceof Blob) {
            const a = document.createElement("a")
            a.href = window.URL.createObjectURL(response.data)
            a.download = "file"
            a.click()
            return
        }
    
        var data = JSON.parse(received_msg)
        if (data["accessToken"] != null) {
            token = data["accessToken"]
        }
        if (data.event == "/file/download" && data.params["content_length"] != null) {
            console.log("Download file size", data.params["content_length"])
        }
        console.log(data)
    });
};

function apiTest() {
    userPresent()
        .then(handleResponse)
        .then(userLoggedin)
        .then(handleResponse)
        .then(userStat)
        .then(handleResponse)
        .then(userLogin)
        .then(handleResponse)
        .then(userPresent)
        .then(handleResponse)
        .then(userLoggedin)
        .then(handleResponse)
        .then(userStat)
        .then(handleResponse)
        .then(podNew)
        .then(handleResponse)
        .then(podOpen)
        .then(handleResponse)
        .then(podLs)
        .then(handleResponse)
        .then(mkDir)
        .then(handleResponse)
        .then(dirLs)
        .then(handleResponse)
        .then(dirStat)
        .then(handleResponse)
        .then(dirPresent)
        .then(handleResponse)
        .then(rmDir)
        .then(handleResponse)
        .then(stat)
        .then(handleResponse)
        .then(kvCreate)
        .then(handleResponse)
        .then(kvList)
        .then(handleResponse)
        .then(kvOpen)
        .then(handleResponse)
        .then(kvEntryPut)
        .then(handleResponse)
        .then(kvCount)
        .then(handleResponse)
        .then(kvGet)
        .then(handleResponse)
        .then(kvSeek)
        .then(handleResponse)
        .then(kvSeekNext)
        .then(handleResponse)
        .then(kvEntryDel)
        .then(handleResponse)
        .then(docCreate)
        .then(handleResponse)
        .then(docLs)
        .then(handleResponse)
        .then(docOpen)
        .then(handleResponse)
        .then(docEntryPut)
        .then(handleResponse)
        .then(docEntryGet)
        .then(handleResponse)
        .then(docFind)
        .then(handleResponse)
        .then(docCount)
        .then(handleResponse)
        .then(docEntryDel)
        .then(handleResponse)
        .then(docDel)
        .then(handleResponse)
        .then(() => console.log('Complete'))
}

apiTest();
