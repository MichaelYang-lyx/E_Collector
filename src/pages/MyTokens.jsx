import React, { useContext, useEffect, useState } from "react";

import tokenfactoryData from "../components/wallet/Contracts/TokenFactory.json";

import "../style.scss";

import { AuthContext } from "../context/AuthContext";
import tokenData from "../components/wallet/Contracts/Token.json";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import GetBack from "../components/GetBack";
import { ethers } from "ethers";
import Interactions from "../components/wallet/Interactions";

const MyTokens = () => {
  const token_abi = tokenData.abi;

  const [err, setErr] = useState(false);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [showTransfer, setShowTransfer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const merchant = currentUser.uid;
    const q = query(
      collection(db, "products"),
      where("merchant", "==", merchant)
    );

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSearchResults(results);
    } catch (err) {
      setErr(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const [contract, setContract] = useState(null);
  const [tokenName, setTokenName] = useState("Token");
  const [tokenUid, setTokenUid] = useState(null);

  const handleOpenTransfer = async (result, e) => {
    e.preventDefault();

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(
      result.contractAddress,
      token_abi,
      tempSigner
    );

    setContract(tempContract);
    setTokenName(result.tName);
    setTokenUid(result.uid);
    setShowTransfer(true);
  };

  useEffect(() => {
    if (contract != null) {

    }
  }, [contract]);

  const handleCloseTransfer = () => {
    setShowTransfer(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里处理表单提交
    handleCloseModal();
  };

  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <GetBack />
          <span className="logo"> My Tokens</span>
          <form>
            {loading && "Creating Token.. Please wait..."}
            {err && <span>{errorMessage}</span>}
            {searchResults.map((result, index) => (
              <div key={index}>
                {result.tName} {result.ticker} {result.buyer_hold}{" "}
                {result.seller_hold} {result.redeemed}
                <img src={result.photoURL} alt="" />
                <button onClick={(event) => handleOpenTransfer(result, event)}>
                  Transfer
                </button>
              </div>
            ))}
          </form>
        </div>
     
        {showTransfer && (
           <div className="transfer">
           <div className="transfer-content">
           <button onClick={handleCloseTransfer}>×</button>
            <Interactions contract={contract} tokenUid={tokenUid} />
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTokens;
