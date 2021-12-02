package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

type WebsocketRequest struct {
	Event  Event       `json:"event"`
	Params interface{} `json:"params,omitempty"`
}

type WebsocketResponse struct {
	Event      Event                  `json:"event"`
	StatusCode int                    `json:"code"`
	Params     map[string]interface{} `json:"params,omitempty"`
}

type Event string

var (
	UserSignup      Event = "/user/signup"
	UserLogin       Event = "/user/login"
	UserImport      Event = "/user/import"
	UserPresent     Event = "/user/present"
	UserIsLoggedin  Event = "/user/isloggedin"
	UserLogout      Event = "/user/logout"
	UserExport      Event = "/user/export"
	UserDelete      Event = "/user/delete"
	UserStat        Event = "/user/stat"
	PodNew          Event = "/pod/new"
	PodOpen         Event = "/pod/open"
	PodClose        Event = "/pod/close"
	PodSync         Event = "/pod/sync"
	PodDelete       Event = "/pod/delete"
	PodLs           Event = "/pod/ls"
	PodStat         Event = "/pod/stat"
	PodShare        Event = "/pod/share"
	PodReceive      Event = "/pod/receive"
	PodReceiveInfo  Event = "/pod/receiveinfo"
	DirIsPresent    Event = "/dir/present"
	DirMkdir        Event = "/dir/mkdir"
	DirRmdir        Event = "/dir/rmdir"
	DirLs           Event = "/dir/ls"
	DirStat         Event = "/dir/stat"
	FileDownload    Event = "/file/download"
	FileUpload      Event = "/file/upload"
	FileShare       Event = "/file/share"
	FileReceive     Event = "/file/receive"
	FileReceiveInfo Event = "/file/receiveinfo"
	FileDelete      Event = "/file/delete"
	FileStat        Event = "/file/stat"
	KVCreate        Event = "/kv/new"
	KVList          Event = "/kv/ls"
	KVOpen          Event = "/kv/open"
	KVDelete        Event = "/kv/delete"
	KVCount         Event = "/kv/count"
	KVEntryPut      Event = "/kv/entry/put"
	KVEntryGet      Event = "/kv/entry/get"
	KVEntryDelete   Event = "/kv/entry/del"
	KVLoadCSV       Event = "/kv/loadcsv"
	KVSeek          Event = "/kv/seek"
	KVSeekNext      Event = "/kv/seek/next"
	DocCreate       Event = "/doc/new"
	DocList         Event = "/doc/ls"
	DocOpen         Event = "/doc/open"
	DocCount        Event = "/doc/count"
	DocDelete       Event = "/doc/delete"
	DocFind         Event = "/doc/find"
	DocEntryPut     Event = "/doc/entry/put"
	DocEntryGet     Event = "/doc/entry/get"
	DocEntryDel     Event = "/doc/entry/del"
	DocLoadJson     Event = "/doc/loadjson"
	DocIndexJson    Event = "/doc/indexjson"
)

type UserRequest struct {
	UserName string `json:"user_name,omitempty"`
	Password string `json:"password,omitempty"`
	Address  string `json:"address,omitempty"`
	Mnemonic string `json:"mnemonic,omitempty"`
}

type PodRequest struct {
	PodName   string `json:"pod_name,omitempty"`
	Password  string `json:"password,omitempty"`
	Reference string `json:"reference,omitempty"`
}

type FileRequest struct {
	PodName   string `json:"pod_name,omitempty"`
	TableName string `json:"table_name,omitempty"`
	DirPath   string `json:"dir_path,omitempty"`
	BlockSize string `json:"block_size,omitempty"`
	FileName  string `json:"file_name,omitempty"`
}

type FileDownloadRequest struct {
	PodName  string `json:"pod_name,omitempty"`
	Filepath string `json:"file_path,omitempty"`
}

type KVRequest struct {
	PodName     string `json:"pod_name,omitempty"`
	TableName   string `json:"table_name,omitempty"`
	IndexType   string `json:"index_type,omitempty"`
	Key         string `json:"key,omitempty"`
	Value       string `json:"value,omitempty"`
	StartPrefix string `json:"start_prefix,omitempty"`
	EndPrefix   string `json:"end_prefix,omitempty"`
	Limit       string `json:"limit,omitempty"`
	Memory      string `json:"memory,omitempty"`
}

type DocRequest struct {
	PodName       string `json:"pod_name,omitempty"`
	TableName     string `json:"table_name,omitempty"`
	ID            string `json:"id,omitempty"`
	Document      string `json:"doc,omitempty"`
	SimpleIndex   string `json:"si,omitempty"`
	CompoundIndex string `json:"ci,omitempty"`
	Expression    string `json:"expr,omitempty"`
	Mutable       bool   `json:"mutable,omitempty"`
	Limit         string `json:"limit,omitempty"`
	FileName      string `json:"file_name,omitempty"`
}

func main() {
	addr := "localhost:9090"
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	u := url.URL{Scheme: "ws", Host: addr, Path: "/ws/v1/"}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}
	defer c.Close()

	downloadFn := func(cl string) {
		mt2, reader, err := c.NextReader()
		if mt2 != websocket.BinaryMessage {
			log.Println("non binary message while download")
			return
		}
		if err != nil {
			log.Println("got error ", err)
			return
		}
		fo, err := os.Create(fmt.Sprintf("../resources/%d", time.Now().Unix()))
		if err != nil {
			log.Println("got error ", err)
			return
		}
		// close fo on exit and check for its returned error
		defer func() {
			if err := fo.Close(); err != nil {
				log.Println("got error ", err)
				return
			}
		}()
		n, err := io.Copy(fo, reader)
		if fmt.Sprintf("%d", n) == cl {
			log.Println("download finished ")
			return
		}
	}

	go func() {
		for {
			cl := "0"
			mt, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", mt, err)
				return
			}
			switch mt {
			case 1:
				res := &WebsocketResponse{}
				if err := json.Unmarshal(message, res); err != nil {
					fmt.Println("got error ", err)
					continue
				}
				if res.Event == FileDownload {
					cl = fmt.Sprintf("%v", res.Params["content_length"])
					downloadFn(cl)
					continue
				}
				if res.StatusCode != 200 && res.StatusCode != 201 {
					fmt.Printf("%s failed: %s\n", res.Event, res.Params)
					continue
				}
				fmt.Printf("%s ran successfully : %s\n", res.Event, res.Params)
			}
		}
	}()

	// userSignup
	podName := "pod1"
	password := "159263487"
	username := fmt.Sprintf("user_%d", time.Now().Unix())
	sighup := &WebsocketRequest{
		Event: UserSignup,
		Params: UserRequest{
			UserName: username,
			Password: password,
		},
	}

	data, err := json.Marshal(sighup)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// userLogin
	login := &WebsocketRequest{
		Event: UserLogin,
		Params: UserRequest{
			UserName: username,
			Password: password,
		},
	}
	data, err = json.Marshal(login)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// userImport
	uImport := &WebsocketRequest{
		Event: UserImport,
		Params: UserRequest{
			UserName: "asabya3",
			Password: "159263487",
			Address:  "e22505220696B51E269274443E31C8cf97DBccAE",
			Mnemonic: "scene axis age olympic mixed crystal diary tilt swallow pluck leader desk",
		},
	}
	data, err = json.Marshal(uImport)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// userPresent
	uPresent := &WebsocketRequest{
		Event: UserPresent,
		Params: UserRequest{
			UserName: username,
		},
	}
	data, err = json.Marshal(uPresent)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// userLoggedIN
	uLoggedIn := &WebsocketRequest{
		Event: UserIsLoggedin,
		Params: UserRequest{
			UserName: username,
		},
	}
	data, err = json.Marshal(uLoggedIn)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// userExport
	userExport := &WebsocketRequest{
		Event: UserExport,
	}
	data, err = json.Marshal(userExport)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// userStat
	userStat := &WebsocketRequest{
		Event: UserStat,
	}
	data, err = json.Marshal(userStat)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// podNew
	podNew := &WebsocketRequest{
		Event: PodNew,
		Params: PodRequest{
			PodName:  podName,
			Password: password,
		},
	}
	data, err = json.Marshal(podNew)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// podOpen
	podOpen := &WebsocketRequest{
		Event: PodOpen,
		Params: PodRequest{
			PodName:  podName,
			Password: password,
		},
	}
	data, err = json.Marshal(podOpen)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// podLs
	podLs := &WebsocketRequest{
		Event: PodLs,
	}
	data, err = json.Marshal(podLs)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// mkdir
	mkDir := &WebsocketRequest{
		Event: DirMkdir,
		Params: FileRequest{
			PodName: podName,
			DirPath: "/d",
		},
	}
	data, err = json.Marshal(mkDir)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// rmDir
	rmDir := &WebsocketRequest{
		Event: DirRmdir,
		Params: FileRequest{
			PodName: podName,
			DirPath: "/d",
		},
	}
	data, err = json.Marshal(rmDir)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// dirLs
	dirLs := &WebsocketRequest{
		Event: DirLs,
		Params: FileRequest{
			PodName: podName,
			DirPath: "/",
		},
	}
	data, err = json.Marshal(dirLs)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// dirStat
	dirStat := &WebsocketRequest{
		Event: DirStat,
		Params: FileRequest{
			PodName: podName,
			DirPath: "/",
		},
	}
	data, err = json.Marshal(dirStat)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// dirPresent
	dirPresent := &WebsocketRequest{
		Event: DirIsPresent,
		Params: FileRequest{
			PodName: podName,
			DirPath: "/d",
		},
	}
	data, err = json.Marshal(dirPresent)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// Upload
	upload := &WebsocketRequest{
		Event: FileUpload,
		Params: FileRequest{
			PodName:   podName,
			DirPath:   "/",
			BlockSize: "1Mb",
			FileName:  "index.json",
		},
	}
	data, err = json.Marshal(upload)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}
	file, err := os.Open("../resources/index.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	body := &bytes.Buffer{}
	_, err = io.Copy(body, file)
	if err != nil {
		panic(err)
	}
	err = c.WriteMessage(websocket.BinaryMessage, body.Bytes())
	if err != nil {
		log.Println("write:", err)
		return
	}

	// Download
	download := &WebsocketRequest{
		Event: FileDownload,
		Params: FileDownloadRequest{
			PodName:  podName,
			Filepath: "/index.json",
		},
	}
	data, err = json.Marshal(download)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// stat
	stat := &WebsocketRequest{
		Event: FileStat,
		Params: FileDownloadRequest{
			PodName:  podName,
			Filepath: "/index.json",
		},
	}
	data, err = json.Marshal(stat)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	table := "kv_1"
	// kvCreate
	kvCreate := &WebsocketRequest{
		Event: KVCreate,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
			IndexType: "string",
		},
	}
	data, err = json.Marshal(kvCreate)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvList
	kvList := &WebsocketRequest{
		Event: KVList,
		Params: KVRequest{
			PodName: podName,
		},
	}
	data, err = json.Marshal(kvList)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvOpen
	kvOpen := &WebsocketRequest{
		Event: KVOpen,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
		},
	}
	data, err = json.Marshal(kvOpen)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// loadcsv
	loadcsv := &WebsocketRequest{
		Event: KVLoadCSV,
		Params: FileRequest{
			PodName:   podName,
			TableName: table,
			DirPath:   "/",
			BlockSize: "1Mb",
			FileName:  "somefile.csv",
		},
	}
	data, err = json.Marshal(loadcsv)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}
	file, err = os.Open("../resources/somefile.csv")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	body = &bytes.Buffer{}
	_, err = io.Copy(body, file)
	if err != nil {
		panic(err)
	}
	err = c.WriteMessage(websocket.BinaryMessage, body.Bytes())
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvEntryPut
	kvEntryPut := &WebsocketRequest{
		Event: KVEntryPut,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
			Key:       "key1",
			Value:     "value1",
		},
	}
	data, err = json.Marshal(kvEntryPut)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvCount
	kvCount := &WebsocketRequest{
		Event: KVCount,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
		},
	}
	data, err = json.Marshal(kvCount)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvGet
	kvGet := &WebsocketRequest{
		Event: KVEntryGet,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
			Key:       "key1",
		},
	}
	data, err = json.Marshal(kvGet)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvSeek
	kvSeek := &WebsocketRequest{
		Event: KVSeek,
		Params: KVRequest{
			PodName:     podName,
			TableName:   table,
			StartPrefix: "key",
		},
	}
	data, err = json.Marshal(kvSeek)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvSeek
	kvSeekNext := &WebsocketRequest{
		Event: KVSeekNext,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
		},
	}
	data, err = json.Marshal(kvSeekNext)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// kvEntryDel
	kvEntryDel := &WebsocketRequest{
		Event: KVEntryDelete,
		Params: KVRequest{
			PodName:   podName,
			TableName: table,
			Key:       "key1",
		},
	}
	data, err = json.Marshal(kvEntryDel)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	docTable := "doc_1"
	// docCreate
	docCreate := &WebsocketRequest{
		Event: DocCreate,
		Params: DocRequest{
			PodName:     podName,
			TableName:   docTable,
			SimpleIndex: "first_name=string,age=number",
			Mutable:     true,
		},
	}
	data, err = json.Marshal(docCreate)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docLs
	docLs := &WebsocketRequest{
		Event: DocList,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
		},
	}
	data, err = json.Marshal(docLs)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docOpen
	docOpen := &WebsocketRequest{
		Event: DocOpen,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
		},
	}
	data, err = json.Marshal(docOpen)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docEntryPut
	docEntryPut := &WebsocketRequest{
		Event: DocEntryPut,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
			Document:  `{"id":"1", "first_name": "Hello1", "age": 11}`,
		},
	}
	data, err = json.Marshal(docEntryPut)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docEntryGet
	docEntryGet := &WebsocketRequest{
		Event: DocEntryGet,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
			ID:        "1",
		},
	}
	data, err = json.Marshal(docEntryGet)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// loadjson
	loadjson := &WebsocketRequest{
		Event: DocLoadJson,
		Params: FileRequest{
			PodName:   podName,
			TableName: docTable,
			DirPath:   "/",
			BlockSize: "1Mb",
			FileName:  "somefile.json",
		},
	}
	data, err = json.Marshal(loadjson)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}
	file, err = os.Open("../resources/somefile.json")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	body = &bytes.Buffer{}
	_, err = io.Copy(body, file)
	if err != nil {
		panic(err)
	}
	err = c.WriteMessage(websocket.BinaryMessage, body.Bytes())
	if err != nil {
		log.Println("write:", err)
		return
	}

	// indexjson
	indexjson := &WebsocketRequest{
		Event: DocIndexJson,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
			FileName:  "/index.json",
		},
	}
	data, err = json.Marshal(indexjson)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docFind
	docFind := &WebsocketRequest{
		Event: DocFind,
		Params: DocRequest{
			PodName:    podName,
			TableName:  docTable,
			Expression: `age>10`,
		},
	}
	data, err = json.Marshal(docFind)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docCount
	docCount := &WebsocketRequest{
		Event: DocCount,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
		},
	}
	data, err = json.Marshal(docCount)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docEntryGet
	docEntryDel := &WebsocketRequest{
		Event: DocEntryDel,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
			ID:        "1",
		},
	}
	data, err = json.Marshal(docEntryDel)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}

	// docDel
	docDel := &WebsocketRequest{
		Event: DocDelete,
		Params: DocRequest{
			PodName:   podName,
			TableName: docTable,
		},
	}
	data, err = json.Marshal(docDel)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}
	err = c.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		log.Println("write:", err)
		return
	}
	<-interrupt
}
