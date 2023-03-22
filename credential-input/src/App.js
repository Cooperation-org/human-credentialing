import GithubAuth from "./containers/GithubAuth";
import React, { useState, useEffect } from "react";
import getWeb3 from "./web3";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FiverrPage from "./containers/FiverrPage";
import PlatformRating from "./containers/PlatformRating";
import "./App.css";
import FiverrAuth from "./containers/FiverrAuth";

function App() {
  const web3 = getWeb3();
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [mainAccount, setMainAccount] = useState();

  const init = async () => {
    const { ethereum } = window;
    if (typeof ethereum !== "undefined" && ethereum.isMetaMask) {
      setIsMetamaskInstalled(true);
      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        setMainAccount(accounts[0]);
        setIsMetamaskConnected(true);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  const connect = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    setMainAccount(accounts[0]);
    setIsMetamaskConnected(true);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <GithubAuth userAccount={mainAccount} />
          <br />
          <FiverrAuth />
        </>
      ),
    },
    {
      path: "/cred/fiverr",
      element: <FiverrPage userAccount={mainAccount} />,
    },
    {
      path: "/cred/platform",
      element: <PlatformRating userAccount={mainAccount} />,
    },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        {!isMetamaskInstalled && <p> Metamask not installed</p>}
        {!isMetamaskConnected && <button onClick={connect}> Connect </button>}
        {isMetamaskConnected && mainAccount && (
          <RouterProvider router={router} />
        )}
      </header>
    </div>
  );
}

export default App;
