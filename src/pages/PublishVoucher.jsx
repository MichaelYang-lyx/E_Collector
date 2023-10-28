import React, { useContext, useEffect, useState } from "react";
import Add from "../img/addAvatar.png";
import { v4 as uuid } from "uuid";

import { useNavigate, Link } from "react-router-dom";

import tokenfactoryData from "../components/wallet/Contracts/TokenFactory.json";
import { contractAddress } from "../Global";
import "../style.scss";
import styles from "../components/wallet/Wallet.module.css";
import { AuthContext } from "../context/AuthContext";
import {ethers} from 'ethers'

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

const PublishVoucher = () => {
  const tokenfactory_abi = tokenfactoryData.abi;

  const [err, setErr] = useState(false);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const [contract, setContract] = useState(null);

  const [loading, setLoading] = useState(false);

  const [fileUploaded, setFileUploaded] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileUploaded(true);
  };

  //handle submit voucher
  const handleSubmit = async (e) => {
    e.preventDefault();
    //check Wallet First
    
    await checkWallet();
    console.log(contract)
    setLoading(true);

    
    const tName = e.target[0].value;
    const ticker = e.target[1].value;
    const quantity = e.target[2].value;
    const available_quantity = quantity;
    const file = e.target[3].files[0];
    let contractAddress = "";

    

    try {
      // blockchain activity
      console.log("Create Token");
      console.log(contract)
      const tx = await contract.createToken(quantity, tName, ticker);
      
      await tx.wait();
      
      console.log(tx);

      const tokenCount = await contract.tokenCount();
      const tokenAddress = await contract.list_of_tokens(tokenCount - 1);
      contractAddress = tokenAddress;
      console.log("address", contractAddress);
      console.log("Create Token in blockchain");

      // firebase backend activity
      // generate productID
      const productID = uuid();
      console.log("productId", productID);
      const merchant=currentUser.uid;


      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${ticker + date}`);
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await setDoc(doc(db, "products", productID), {
              uid: productID,
              tName,
              ticker,
              merchant,
              quantity,
              available_quantity,
              contractAddress,
              photoURL: downloadURL,
            });
            console.log("Create Token in firebase");
          } catch (err) {
            console.log(err);
            setErrorMessage(err.message);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
      console.error(err);
    }
  };

  const updateEthers = async () => {
    console.log("UpdateEthers");
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = await tempProvider.getSigner();
    let tempContract = new ethers.Contract(
      contractAddress,
      tokenfactory_abi,
      tempSigner
    );
    setContract(tempContract);
    console.log("tempContract", tempContract);
    console.log("contract",contract);
  };
  useEffect(() => {
    updateEthers();
  }, []);
  
  //check the wallet condition
  const checkWallet = async () => {
    const emailQuery = await query(
      collection(db, "users"),
      where("email", "==", currentUser.email)
    );
    const emailQuerySnapshot = await getDocs(emailQuery);
    const address = emailQuerySnapshot.docs[0].data().address;
    let currentAddress = "";
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        currentAddress = result[0];
        setConnButtonText("Wallet is valid");
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
    if (address != currentAddress) {
      setErr(true);
      setErrorMessage("You should use your own Metamask wallet");
      throw new Error("You should use your own Metamask wallet");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">


      <GetBack/>

        <div>
          <h2> {"Check your Wallet"} </h2>
          <button className={styles.button6} onClick={checkWallet}>
            <h3>Check Wallet</h3>
            {connButtonText}
          </button>
        </div>

        <span className="logo"> Create Your Token</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Token Name" />
          <input required type="text" placeholder="Token Ticker" />
          <input required type="number" placeholder="Initial Supply" />
          <input
            required
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleFileUpload}
          />
          {fileUploaded && <p>Picture uploaded successfully!</p>}
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an picture for your token</span>
          </label>
          <button disabled={loading}>Create Token</button>
          {loading && "Creating Token.. Please wait..."}
          {err && <span>{errorMessage}</span>}
        </form>
      </div>
    </div>
  );
};

export default PublishVoucher;
