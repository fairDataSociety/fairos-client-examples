package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	dfsCommon "github.com/fairdatasociety/fairOS-dfs/cmd/common"
)

type PresentResponse struct {
	Present bool `json:"present"`
}

var (
	basev1 = "http://localhost:9090/v1"
	basev2 = "http://localhost:9090/v2"
)

func main() {
	podName := "pod"
	password := "756e3c095324"
	username := "c565c97b2d5cb9d87059cb23ab4d9fcd"
	c := http.Client{Timeout: time.Duration(1) * time.Minute}
	loginRequest := &dfsCommon.UserLoginRequest{
		UserName: username,
		Password: password,
	}
	loginRequestData, err := json.Marshal(loginRequest)
	if err != nil {
		fmt.Println("Marshal:", err)
		return
	}

	// is User present
	isUserPresentReq, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s%s?userName=%s", basev2, string(dfsCommon.UserPresentV2), loginRequest.UserName), nil)
	isUserPresentResp, err := c.Do(isUserPresentReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	bodyBytes, err := io.ReadAll(isUserPresentResp.Body)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	presentResp := &PresentResponse{}
	err = json.Unmarshal(bodyBytes, presentResp)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}

	// Login
	userLoginHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s%s", basev2, string(dfsCommon.UserLogin)), bytes.NewBuffer(loginRequestData))
	if err != nil {
		return
	}
	userLoginHttpReq.Header.Add("Content-Type", "application/json")
	userLoginHttpReq.Header.Add("Content-Length", strconv.Itoa(len(loginRequestData)))
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
		fmt.Println("Login failed", userLoginResp.StatusCode)
		return
	}

	cookie := userLoginResp.Header["Set-Cookie"]
	podReq := &dfsCommon.PodRequest{
		PodName: podName,
	}
	podReqData, err := json.Marshal(podReq)
	if err != nil {
		log.Println("Marshal:", err)
		return
	}

	// is pod present
	isPodPresentReq, err := http.NewRequest(http.MethodGet, fmt.Sprintf("%s/pod/present?podName=%s", basev1, podName), nil)
	if cookie != nil {
		isPodPresentReq.Header.Set("Cookie", cookie[0])
	}
	isPodPresentResp, err := c.Do(isPodPresentReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	podPresentBodyBytes, err := io.ReadAll(isPodPresentResp.Body)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	podPresentResp := &PresentResponse{}
	err = json.Unmarshal(podPresentBodyBytes, podPresentResp)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}

	if !podPresentResp.Present {
		// pod new
		podHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s%s", basev1, string(dfsCommon.PodNew)), bytes.NewBuffer(podReqData))
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
			return
		}
	} else {
		// pod open
		podOpenHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s%s", basev1, string(dfsCommon.PodOpen)), bytes.NewBuffer(podReqData))
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
	}

	// upload
	uploadBuf := new(bytes.Buffer)
	fileName := fmt.Sprintf("file_%d", time.Now().Unix())
	uploadWriter := multipart.NewWriter(uploadBuf)
	dataBytes := []byte(fmt.Sprintf("Latest updates %d", time.Now().Unix()))
	uploadWriter.WriteField("podName", podName)
	uploadWriter.WriteField("dirPath", "/")
	uploadWriter.WriteField("blockSize", "1Mb")
	uploadWriter.WriteField("contentLength", fmt.Sprintf("%d", len(dataBytes)))
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
	uploadHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s%s", basev1, string(dfsCommon.FileUpload)), uploadBuf)
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
	err = uploadResp.Body.Close()
	if err != nil {
		fmt.Println("Error", err.Error(), time.Now())
		return
	}
	if uploadResp.StatusCode != http.StatusOK {
		fmt.Println("Upload failed", uploadResp.StatusCode)
		return
	}

	// download
	downloadBuf := new(bytes.Buffer)
	downloadWriter := multipart.NewWriter(downloadBuf)
	downloadWriter.WriteField("podName", podName)
	downloadWriter.WriteField("filePath", fmt.Sprintf("/%s", fileName))

	err = downloadWriter.Close()
	if err != nil {
		fmt.Println("Error", err.Error(), time.Now())
		return
	}
	contentType = fmt.Sprintf("multipart/form-data;boundary=%v", downloadWriter.Boundary())
	downloadHttpReq, err := http.NewRequest(http.MethodPost, fmt.Sprintf("%s%s", basev1, string(dfsCommon.FileDownload)), downloadBuf)
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
	err = downloadResp.Body.Close()
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
	fileStatHttpReq, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://localhost:9090/v1%s?filePath=/%s&podName=%s", string(dfsCommon.FileStat), fReq.Filepath, fReq.PodName), nil)
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
	dirLsHttpReq, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://localhost:9090/v1%s?dirPath=/&podName=%s", string(dfsCommon.DirLs), fReq.PodName), nil)
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

	podDeleteHttpReq, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("%s%s", basev1, string(dfsCommon.PodDelete)), bytes.NewBuffer(podReqData))
	if err != nil {
		return
	}
	podDeleteHttpReq.Header.Add("Content-Type", "application/json")
	podDeleteHttpReq.Header.Add("Content-Length", strconv.Itoa(len(podReqData)))
	podDeleteHttpReq.Header.Set("Cookie", cookie[0])
	podDeleteResp, err := c.Do(podDeleteHttpReq)
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	err = podDeleteResp.Body.Close()
	if err != nil {
		fmt.Println("Error ", err.Error(), time.Now())
		return
	}
	if podDeleteResp.StatusCode != http.StatusOK {
		fmt.Println("Pod Delete failed", podDeleteResp.StatusCode)
		return
	}
}
