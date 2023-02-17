import './App.css';

function App() {
  async function mConnect() {
    let resp = await window.connect("https://bee-1.fairdatasociety.org", "0000000000000000000000000000000000000000000000000000000000000000", "https://xdai.dev.fairdatasociety.org", "testnet")
    console.log(resp)
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={mConnect}> Connect</button>
      </header>
    </div>
  );
}

export default App;
