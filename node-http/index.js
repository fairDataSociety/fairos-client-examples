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
var username = "c565c97b2d5cb9d87059cb23ab4d9fcd"
var password = "756e3c095324"
var podName = "pod"

const cookieJar = {
    myCookies: undefined,
};

function downloadFile() {
    let formData = new FormData()
    formData.append("podName", podName);
    formData.append("filePath", "/somefile.json");
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
    formData.append("podName", podName);
    formData.append("dirPath", "/");
    formData.append("blockSize", "1Mb");
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
            "podName": podName,
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
            "podName": podName,
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
        "userName": username,
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
    return axios.get(pathv1+events.UserIsLoggedin+"?userName="+username, {
        withCredentials: true,
        headers: {
            "Content-Type" : "application/json",
            "User-Agent" : "client-examples",
        }
    })
}

function podNew() {
    return axios.post(pathv1+events.PodNew,  {
        "podName": podName
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
        "podName": podName
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
