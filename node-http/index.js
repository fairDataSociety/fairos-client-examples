const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data')
let pathv1 = "http://localhost:9090/v1"
let pathv2 = "http://localhost:9090/v2"
// Import events
var events = require('./events');

/*
    The following code block is for the demo only
    dont hard code password in your project
*/
var username = "example"
var password = "password"
var podName = "pod"

const cookieJar = {
    myCookies: undefined,
};

function downloadFile() {
    let formData = new FormData()
    formData.append("pod_name", podName);
    formData.append("file_path", "/somefile.json");
    return axios.post(pathv1+events.FileDownload,  formData, {
        withCredentials: true,
        headers: {
            "Content-Type" : `multipart/form-data; boundary=${formData._boundary}`,
            "User-Agent" : "client-examples",
            cookie: cookieJar.myCookies,
        }
    })
}

function uploadFile() {
    var pathOfFile = "../resources/somefile.json"
    let formData = new FormData()
    formData.append("files", fs.createReadStream(pathOfFile), "somefile.json");
    formData.append("pod_name", podName);
    formData.append("dir_path", "/");
    formData.append("block_size", "1Mb");
    return axios.post(pathv1+events.FileUpload,  formData, {
        withCredentials: true,
        headers: {
            "Content-Type" : `multipart/form-data; boundary=${formData._boundary}`,
            "User-Agent" : "client-examples",
            cookie: cookieJar.myCookies,
        }
    })
}
/*
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
*/

function userLogin() {
    return axios.post(pathv2+events.UserLogin,  {
        "user_name": username,
        "password": password
    }, {
        withCredentials: true,
        headers: {
            "Content-Type" : "application/json",
            "User-Agent" : "client-examples",
        }
    })
}

function userLoggedin() {
    return axios.get(pathv1+events.UserIsLoggedin+"?user_name="+username, {
        withCredentials: true,
        headers: {
            "Content-Type" : "application/json",
            "User-Agent" : "client-examples",
        }
    })
}

function podNew() {
    return axios.post(pathv1+events.PodNew,  {
        "pod_name": podName,
        "password": password
    }, {
        headers: {
            "Content-Type" : "application/json",
            "User-Agent" : "client-examples",
            cookie: cookieJar.myCookies,
        },
        withCredentials: true,
    })
}

function podOpen() {
    return axios.post(pathv1+events.PodOpen,  {
        "pod_name": podName,
        "password": password
    }, {
        headers: {
            "Content-Type" : "application/json",
            "User-Agent" : "client-examples",
            cookie: cookieJar.myCookies,
        },
        withCredentials: true,
    })
}

async function apiTest() {
    console.log(username)
    let res
    res = await userLogin()
    cookieJar.myCookies = res.headers['set-cookie'];
    console.log(res)
    res = await userLoggedin()
    console.log(res)
    res = await podOpen()
    console.log(res)
    res = await uploadFile()
    console.log(res)
    res = await downloadFile()
    console.log(res)
}

apiTest()
