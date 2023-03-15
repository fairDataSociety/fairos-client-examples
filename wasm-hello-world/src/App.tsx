import './App.css';
import Web3 from 'web3';


function App() {

  async function connectWallet() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        let accounts = await web3.eth.getAccounts()
        console.log(accounts)
        web3.eth.defaultAccount = accounts[0];
        console.log(web3.eth.defaultAccount.toString())
        const signature = await web3.eth.personal.sign(web3.eth.defaultAccount, web3.eth.defaultAccount, '')
        console.log(signature)
        let resp = await window.connectWallet("check", "passwordpassword", web3.eth.defaultAccount, signature)
        console.log(resp)
      } catch (error) {
          console.error(error);
      }
    } else {
      console.error('No Metamask found');
    }
  }

  async function loginWallet() {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        let accounts = await web3.eth.getAccounts()
        console.log(accounts)
        web3.eth.defaultAccount = accounts[0];
        console.log(web3.eth.defaultAccount.toString())
        const signature = await web3.eth.personal.sign(web3.eth.defaultAccount, web3.eth.defaultAccount, '')
        console.log(signature)
        let resp = await window.walletLogin(web3.eth.defaultAccount.toString(), signature)
        console.log(resp)

        let userPresent= await window.userPresent("check")
        console.log(userPresent)

        let userIsLoggedIn= await window.userIsLoggedIn("check")
        console.log(userIsLoggedIn)

        let respstat= await window.userStat(resp.sessionId)
        console.log(respstat)

        let resp2 = await window.podList(resp.sessionId)
        console.log(resp2)

        let resp3 = await window.podOpen(resp.sessionId, resp2.pods[0])
        console.log(resp3)

        let resp4 = await window.dirList(resp.sessionId, resp2.pods[0], "/")
        console.log(resp4)

        let podShare = await window.podShare(resp.sessionId, resp2.pods[0], '')
        console.log(podShare)

        console.log(resp4.files[0].name)
        let fileStat = await window.fileStat(resp.sessionId, resp2.pods[0], "/"+resp4.files[0].name)
        console.log(fileStat)

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('No Metamask found');
    }
  }

  async function mConnect() {
    let respConnect = await window.connect("http://localhost:1633", "51987f7304b419d8aa184d35d46b3cfeb1b00986ad937b3151c7ade699c81338", "http://localhost:9545", "play", "http://localhost:9545", "")
    console.log(respConnect)


    let respLogin = await window.login("check", "1234567812345678")
    console.log(respLogin)


    let resp2 = await window.podList(respLogin.sessionId)
    console.log(resp2)

    let respOpen = await window.podOpen(respLogin.sessionId, resp2.pods[0])
    console.log(respOpen)
  }



  return (
    <div className="App">
      <header className="App-header">
        <button onClick={mConnect}> Connect</button>
        <button onClick={connectWallet}> Connect wallet</button>
        <button onClick={loginWallet}> Login with wallet</button>
      </header>
    </div>
  );
}

export default App;
