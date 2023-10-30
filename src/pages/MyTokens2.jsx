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
import Redeems from "../components/wallet/Redeems";

const MyTokens2 = () => {
  const token_abi = tokenData.abi;
  const { currentUser } = useContext(AuthContext);

  const [err, setErr] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [updateInfo, setUpdateInfo] = useState(0);

  const getProducts = async (productID) => {
    const q = query(collection(db, "products"), where("uid", "==", productID));
    try {
      
      const qSnapshot = await getDocs(q);
      const result = qSnapshot.docs[0].data();
      return result;
    } catch (err) {
      setErr(true);
    }
  };

  const handleSearch = async () => {
    const q = query(
      collection(db, "consumer_tokens"),
      where("userID", "==", currentUser.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      const results = [];
      for (const doc of querySnapshot.docs) {
        let single_result=doc.data();
        const product_info = await getProducts(doc.data().productID);
        let{tName, ticker, contractAddress, photoURL}=product_info;
        single_result={...single_result, tName, ticker, photoURL, contractAddress};
        results.push(single_result);
      }
      
      setSearchResults(results);
    } catch (err) {
      setErr(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [updateInfo]);

  const [contract, setContract] = useState(null);
  const [tokenName, setTokenName] = useState("Token");
  const [tokenUid, setTokenUid] = useState(null);

  const handleOpenRedeem = async (result, e) => {
    e.preventDefault();

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    console.log(result)
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

  const handleCloseRedeem = () => {
    setShowTransfer(false);
  };

  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <GetBack />
          <span className="logo"> My Tokens - Consumer</span>
          <form>
            {loading && "Creating Token.. Please wait..."}
            {err && <span>{errorMessage}</span>}
            {searchResults.map((result, index) => (
              <div key={index}>
                {result.tName} {result.ticker} {result.quantity}{" "}
                <img src={result.photoURL} alt="" />
                <button onClick={(event) => handleOpenRedeem(result, event)}>
                  Redeem
                </button>
              </div>
            ))}
          </form>
        </div>

        {showTransfer && (
          <div className="transfer">
            <div className="transfer-content">
              <button onClick={handleCloseRedeem}>×</button>
              <Redeems
                contract={contract}
                tokenUid={tokenUid}
                updateInfo={updateInfo}
                setUpdateInfo={setUpdateInfo}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTokens2;
