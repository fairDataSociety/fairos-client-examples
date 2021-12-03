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

	dfsCommon "github.com/fairdatasociety/fairOS-dfs/cmd/common"
	"github.com/gorilla/websocket"
)

func main() {
	addr := "localhost:9090"

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	u := url.URL{Scheme: "ws", Host: addr, Path: "/ws/v1/"}
	log.Printf("connecting to %s\n", u.String())

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
				res := &dfsCommon.WebsocketResponse{}
				if err := json.Unmarshal(message, res); err != nil {
					fmt.Println("got error ", err)
					continue
				}
				if res.Event == dfsCommon.FileDownload {
					params := res.Params.(map[string]interface{})
					cl = fmt.Sprintf("%v", params["content_length"])
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
	sighup := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserSignup,
		Params: dfsCommon.UserRequest{
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
	login := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserLogin,
		Params: dfsCommon.UserRequest{
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
	uImport := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserImport,
		Params: dfsCommon.UserRequest{
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
	uPresent := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserPresent,
		Params: dfsCommon.UserRequest{
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
	uLoggedIn := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserIsLoggedin,
		Params: dfsCommon.UserRequest{
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
	userExport := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserExport,
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
	userStat := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.UserStat,
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
	podNew := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.PodNew,
		Params: dfsCommon.PodRequest{
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
	podOpen := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.PodOpen,
		Params: dfsCommon.PodRequest{
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
	podLs := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.PodLs,
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
	mkDir := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DirMkdir,
		Params: dfsCommon.FileRequest{
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
	rmDir := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DirRmdir,
		Params: dfsCommon.FileRequest{
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
	dirLs := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DirLs,
		Params: dfsCommon.FileRequest{
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
	dirStat := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DirStat,
		Params: dfsCommon.FileRequest{
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
	dirPresent := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DirIsPresent,
		Params: dfsCommon.FileRequest{
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
	upload := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.FileUpload,
		Params: dfsCommon.FileRequest{
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
	download := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.FileDownload,
		Params: dfsCommon.FileDownloadRequest{
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
	stat := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.FileStat,
		Params: dfsCommon.FileDownloadRequest{
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
	kvCreate := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVCreate,
		Params: dfsCommon.KVRequest{
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
	kvList := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVList,
		Params: dfsCommon.KVRequest{
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
	kvOpen := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVOpen,
		Params: dfsCommon.KVRequest{
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
	loadcsv := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVLoadCSV,
		Params: dfsCommon.FileRequest{
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
	kvEntryPut := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVEntryPut,
		Params: dfsCommon.KVRequest{
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
	kvCount := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVCount,
		Params: dfsCommon.KVRequest{
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
	kvGet := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVEntryGet,
		Params: dfsCommon.KVRequest{
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
	kvSeek := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVSeek,
		Params: dfsCommon.KVRequest{
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
	kvSeekNext := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVSeekNext,
		Params: dfsCommon.KVRequest{
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
	kvEntryDel := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.KVEntryDelete,
		Params: dfsCommon.KVRequest{
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
	docCreate := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocCreate,
		Params: dfsCommon.DocRequest{
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
	docLs := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocList,
		Params: dfsCommon.DocRequest{
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
	docOpen := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocOpen,
		Params: dfsCommon.DocRequest{
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
	docEntryPut := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocEntryPut,
		Params: dfsCommon.DocRequest{
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
	docEntryGet := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocEntryGet,
		Params: dfsCommon.DocRequest{
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
	loadjson := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocLoadJson,
		Params: dfsCommon.FileRequest{
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
	indexjson := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocIndexJson,
		Params: dfsCommon.DocRequest{
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
	docFind := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocFind,
		Params: dfsCommon.DocRequest{
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
	docCount := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocCount,
		Params: dfsCommon.DocRequest{
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
	docEntryDel := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocEntryDel,
		Params: dfsCommon.DocRequest{
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
	docDel := &dfsCommon.WebsocketRequest{
		Event: dfsCommon.DocDelete,
		Params: dfsCommon.DocRequest{
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
