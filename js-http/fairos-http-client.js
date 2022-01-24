// Let us define properties needed for API calls
var username = "user_"+(Date.now() / 1000).toFixed(0)
var password = "159263487"
var podName = "pod1"
var host = "https://localhost:9090/v1/";

function downloadFile() {
    var data = {
        "pod_name": podName,
        "file_path": "/index.json"
    }
    return fetch(host + "file/download", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include"
    });
}


function uploadFile() {
    const formData = new FormData();

    formData.append("files", fileupload.files[0]);
    formData.set("pod_name", podName);
    formData.append("file_name", "index.json");
    formData.set("dir_path", "/");
    formData.set("block_size", "1Mb");

    fetch(host + "/file/upload", {
        method: "POST",
        body: formData,
        credentials: "include"
    });
}

userSignUp = function() {
    var data = {
        "user_name": username,
        "password": password
    };
    return fetch(host + "/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

userLogin = function() {
    var data = {
        "user_name": username,
        "password": password
    };
    return fetch(host + "/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

userLoggedin = function() {
    var data = {
        "user_name": username
    };
    return fetch(host + "/user/isloggedin" +  '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}


userPresent = function() {
    var data = {
        "user_name": username
    };
    return fetch(host + "/user/present" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

userExport = function() {
    var data = {
        "user_name": username
    };
    return fetch(host + "/user/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

userStat = function() {
    var data = {
        "user_name": username
    };
    return fetch(host + "/user/stat" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

podNew = function() {
    var data = {
        "pod_name": podName,
        "password": password
    };
    return fetch(host + "/pod/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

podOpen = function() {
    var data = {
        "pod_name": podName,
        "password": password
    };
    return fetch(host + "/pod/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

podLs = function() {
    var data = {
        "pod_name": podName,
        "password": password
    };
    return fetch(host + "/pod/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

mkDir = function() {
    var data = {
        "pod_name": podName,
        "dir_path": "/d"
    };
    return fetch(host + "/dir/mkdir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

rmDir = function() {
    var data = {
        "pod_name": podName,
        "dir_path": "/d"
    };
    return fetch(host + "/dir/rmdir", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

dirLs = function() {
    var data = {
        "pod_name": podName,
        "dir_path": "/"
    };
    return fetch(host + "/dir/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

dirStat = function() {
    var data = {
        "pod_name": podName,
        "dir_path": "/d"
    };
    return fetch(host + "/dir/stat" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

dirPresent = function() {
    var data = {
        "pod_name": podName,
        "dir_path": "/d"
    };
    return fetch(host + "/dir/present" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

stat = function() {
    var data = {
        "pod_name": podName,
        "file_path": "/index.json"
    };
    return fetch(host + "/file/stat" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

var table = "kv_1"
kvCreate = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "index_type": "string"
    };
    return fetch(host + "/kv/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

kvList = function() {
    var data = {
        "pod_name": podName
    };
    return fetch(host + "/kv/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

kvOpen = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
    };
    return fetch(host + "/kv/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

kvEntryPut = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "key": "key1",
        "value": "value"
    };
    return fetch(host + "/kv/entry/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

kvCount = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
    };
    return fetch(host + "/kv/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

kvGet = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "key": "key1",
    };
    return fetch(host + "/kv/entry/get" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

kvSeek = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "start_prefix": "key",
    };
    return fetch(host + "/kv/seek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

kvSeekNext = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
    };
    return fetch(host + "/kv/seek/next" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

kvEntryDel = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "key": "key1",
    };
    return fetch(host + "/kv/entry/del", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

var docTable = "doc_1"
docCreate = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "si": "first_name=string,age=number",
        "mutable": true
    };
    return fetch(host + "/doc/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

docLs = function() {
    var data = {
        "pod_name": podName,
        "table_name": table
    };
    return fetch(host + "/doc/ls" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

docOpen = function() {
    var data = {
        "pod_name": podName,
        "table_name": table
    };
    return fetch(host + "/doc/open", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

docEntryPut = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "doc":  `{"id":"1", "first_name": "Hello1", "age": 11}`,
    };
    return fetch(host + "/doc/entry/put", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

docEntryGet = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "id":  "1",
    };
    return fetch(host + "/doc/entry/get" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

docFind = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "expr":  `age>10`,
    };
    return fetch(host + "/doc/find" + '?' + new URLSearchParams(data), {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

docCount = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
    };
    return fetch(host + "/doc/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

docEntryDel = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
        "id":  "1",
    };
    return fetch(host + "/doc/entry/del", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

docDel = function() {
    var data = {
        "pod_name": podName,
        "table_name": table,
    };
    return fetch(host + "/doc/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
    });
}

apiTest();

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
        .then(userSignUp)
        .then(handleResponse)
        .then(userLogin)
        .then(handleResponse)
        .then(userPresent)
        .then(handleResponse)
        .then(userLoggedin)
        .then(handleResponse)
        .then(userStat)
        .then(handleResponse)
        .then(userExport)
        .then(handleResponse)
        .then(podNew)
        .then(handleResponse)
        .then(podOpen)
        .then(handleResponse)
        .then(podLs)
        .then(handleResponse)
        .then(mkDir)
        .then(handleResponse)
        .then(rmDir)
        .then(handleResponse)
        .then(dirLs)
        .then(handleResponse)
        .then(dirStat)
        .then(handleResponse)
        .then(dirPresent)
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

