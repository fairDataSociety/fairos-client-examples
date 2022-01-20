package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"

	dfsCommon "github.com/fairdatasociety/fairOS-dfs/cmd/common"
)

func main() {

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	podName := "pod_16425667351"
	password := "159263487"
	username := "user_1642566083"
	c := http.Client{Timeout: time.Duration(1) * time.Minute}
	signupRequest := &dfsCommon.UserRequest{
		UserName: username,
		Password: password,
	}
	signupRequestData, err := json.Marshal(signupRequest)
	if err != nil {
		fmt.Println("Marshal:", err)
		return
	}

	// user signup
	signupRequestDataHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://localhost:9090/v1%s", string(dfsCommon.UserSignup)),  bytes.NewBuffer(signupRequestData))
	if err != nil {
		return
	}
	signupRequestDataHttpReq.Header.Add("Content-Type", "application/json")
	signupRequestDataHttpReq.Header.Add("Content-Length", strconv.Itoa(len(signupRequestData)))
	signupRequestResp, err := c.Do(signupRequestDataHttpReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	err = signupRequestResp.Body.Close()
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	if signupRequestResp.StatusCode != http.StatusCreated {
		fmt.Println("Signup failed")
	}


	// Login
	userLoginHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://localhost:9090/v1%s", string(dfsCommon.UserLogin)),  bytes.NewBuffer(signupRequestData))
	if err != nil {
		return
	}
	userLoginHttpReq.Header.Add("Content-Type", "application/json")
	userLoginHttpReq.Header.Add("Content-Length", strconv.Itoa(len(signupRequestData)))
	userLoginResp, err := c.Do(userLoginHttpReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	err = userLoginResp.Body.Close()
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	if userLoginResp.StatusCode != http.StatusOK {
		fmt.Println("Login failed")
	}

	cookie := userLoginResp.Header["Set-Cookie"]
	podReq := &dfsCommon.PodRequest{
		PodName:  podName,
		Password: password,
	}
	podReqData, err := json.Marshal(podReq)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}

	// pod new
	podHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://localhost:9090/v1%s", string(dfsCommon.PodNew)),  bytes.NewBuffer(podReqData,))
	if err != nil {
		return
	}
	podHttpReq.Header.Add("Content-Type", "application/json")
	podHttpReq.Header.Add("Content-Length", strconv.Itoa(len(podReqData)))
	podHttpReq.Header.Set("Cookie", cookie[0])
	podNewResp, err := c.Do(podHttpReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	err = podNewResp.Body.Close()
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	if podNewResp.StatusCode != http.StatusCreated {
		fmt.Println("Pod New failed")
	}

	// pod open
	podOpenHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://localhost:9090/v1%s", string(dfsCommon.PodOpen)),  bytes.NewBuffer(podReqData,))
	if err != nil {
		return
	}
	podOpenHttpReq.Header.Add("Content-Type", "application/json")
	podOpenHttpReq.Header.Add("Content-Length", strconv.Itoa(len(podReqData)))
	podOpenHttpReq.Header.Set("Cookie", cookie[0])
	podOpenResp, err := c.Do(podOpenHttpReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	err = podOpenResp.Body.Close()
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	if podOpenResp.StatusCode != http.StatusOK {
		fmt.Println("Pod Open failed")
		return
	}

	for {
		// upload
		uploadBuf := new(bytes.Buffer)
		fileName := fmt.Sprintf("file_%d", time.Now().Unix())
		uploadWriter := multipart.NewWriter(uploadBuf)
		dataBytes := []byte(fmt.Sprintf("Latest updates %d", time.Now().Unix()))
		uploadWriter.WriteField("pod_name", podName)
		uploadWriter.WriteField("dir_path", "/")
		uploadWriter.WriteField("block_size", "1Mb")
		uploadWriter.WriteField("content_length", fmt.Sprintf("%d", len(dataBytes)))
		uploadPart, err := uploadWriter.CreateFormFile("files", fileName)
		if err != nil {
			fmt.Println("Error ", err.Error(), time.Now())
			return
		}
		_, err = io.Copy(uploadPart, bytes.NewReader(dataBytes))
		if err != nil {
			fmt.Println("Error ", err.Error(), time.Now())
			return
		}
		err = uploadWriter.Close()
		if err != nil {
			fmt.Println("Error ", err.Error(), time.Now())
			return
		}
		contentType := fmt.Sprintf("multipart/form-data;boundary=%v", uploadWriter.Boundary())
		uploadHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://localhost:9090/v1%s", string(dfsCommon.FileUpload)), uploadBuf)
		if err != nil {
			fmt.Println("Error ", err.Error(), time.Now())
			return
		}
		uploadHttpReq.Header.Set("Content-Type", contentType)
		if cookie != nil {
			uploadHttpReq.Header.Set("Cookie", cookie[0])
		}
		uploadResp, err := c.Do(uploadHttpReq)
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		err =  uploadResp.Body.Close()
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		if uploadResp.StatusCode != http.StatusOK {
			fmt.Println("Upload failed")
			return
		}

		// download
		downloadBuf := new(bytes.Buffer)
		downloadWriter := multipart.NewWriter(downloadBuf)
		downloadWriter.WriteField("pod_name", podName)
		downloadWriter.WriteField("file_path", fmt.Sprintf("/%s", fileName))

		err = downloadWriter.Close()
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		contentType = fmt.Sprintf("multipart/form-data;boundary=%v", downloadWriter.Boundary())
		downloadHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://localhost:9090/v1%s", string(dfsCommon.FileDownload)), downloadBuf)
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		downloadHttpReq.Header.Set("Content-Type", contentType)
		if cookie != nil {
			downloadHttpReq.Header.Set("Cookie", cookie[0])
		}
		downloadResp, err := c.Do(downloadHttpReq)
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		err =  downloadResp.Body.Close()
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		if downloadResp.StatusCode != http.StatusOK {
			fmt.Println("Download failed")
			return
		}



		// FileStat
		fReq := &dfsCommon.FileDownloadRequest{
			PodName:  podName,
			Filepath: fileName,
		}
		fileStatHttpReq, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://localhost:9090/v1%s?file_path=/%s&pod_name=%s", string(dfsCommon.FileStat), fReq.Filepath, fReq.PodName), nil)
		if err != nil {
			return
		}
		fileStatHttpReq.Header.Add("Content-Type", "application/json")
		if cookie != nil {
			fileStatHttpReq.Header.Set("Cookie", cookie[0])
		}
		fileStatResp, err := c.Do(fileStatHttpReq)
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		err = fileStatResp.Body.Close()
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		if fileStatResp.StatusCode != http.StatusOK {
			fmt.Println("File Stat failed")
			return
		}

		// DirLs
		dirLsHttpReq, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://localhost:9090/v1%s?dir_path=/&pod_name=%s", string(dfsCommon.DirLs), fReq.PodName), nil)
		if err != nil {
			return
		}
		dirLsHttpReq.Header.Add("Content-Type", "application/json")
		if cookie != nil {
			dirLsHttpReq.Header.Set("Cookie", cookie[0])
		}
		dirLsResp, err := c.Do(dirLsHttpReq)
		if err != nil {
			fmt.Println("Error", err.Error(), time.Now())
			return
		}
		err = dirLsResp.Body.Close()
		if err != nil {
			fmt.Println("Error ", err.Error(), time.Now())
			return
		}
		if dirLsResp.StatusCode != http.StatusOK {
			fmt.Println("Dir LS failed")
			return
		}

		select {
			case <-interrupt:
				return
			case <-time.After(time.Second * 5):
		}
	}
}