import React, { useContext, useEffect, useState } from "react";
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

interface Product {
  uid: string;
  tName: string;
  ticker: string;
  contractAddress: string;
  photoURL: string;
}

interface SearchResult extends Product {
  consumerID: string;
  status: number;
  quantity: number;
}


declare global {
  interface Window {
    ethereum: any; 
  }
}

const ConsumerTrack: React.FC = () => {
  const token_abi: any = tokenData.abi;
  const { currentUser }:any = useContext(AuthContext);

  const [err, setErr] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [updateInfo, setUpdateInfo] = useState<number>(0);

  const getProducts = async (productID: string): Promise<Product> => {
    const q = query(collection(db, "products"), where("uid", "==", productID));
    try {
      const qSnapshot = await getDocs(q);
      const result = qSnapshot.docs[0].data() as Product;
      return result;
    } catch (err) {
      setErr(true);
      throw err;
    }
  };

  const handleSearch = async (): Promise<void> => {
    const q = query(
      collection(db, "tracks"),
      where("consumerID", "==", currentUser.uid)
    );

    try {
      const querySnapshot = await getDocs(q);
      const results: SearchResult[] = [];
      for (const doc of querySnapshot.docs) {
        let single_result = doc.data() as SearchResult;
        const product_info = await getProducts(doc.data().productID);
        let { tName, ticker, contractAddress, photoURL } = product_info;
        single_result = {
          ...single_result,
          tName,
          ticker,
          photoURL,
          contractAddress,
        };
        results.push(single_result);
      }
      setSearchResults(results);
      console.log(results[0].status);
    } catch (err) {
      setErr(true);
      console.log(err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [updateInfo]);

  const [contract, setContract] = useState<any>(null);
  const [tokenName, setTokenName] = useState<string>("Token");
  const [tokenUid, setTokenUid] = useState<string | null>(null);

  const handleTrack = async (result: SearchResult, e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    console.log(result);
    let tempContract = new ethers.Contract(
      result.contractAddress,
      token_abi,
      tempSigner
    );

    setContract(tempContract);
    setTokenName(result.tName);
    setTokenUid(result.uid);
  };

  useEffect(() => {
    if (contract != null) {
      // Do something
    }
  }, [contract]);

  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <GetBack />
          <span className="logo"> Tokens Track - Consumer</span>
          <form>
            {loading && "Creating Token.. Please wait..."}
            {err && <span>{errorMessage}</span>}
            {searchResults.map((result, index) => (
              <div key={index}>
                {result.tName} {result.ticker} {result.quantity} {result.status}{" "}
                <img src={result.photoURL} alt="" />
                {(() => {
                  switch (result.status) {
                    case 0:
                      return (
                        <button
                          disabled
                          style={{ backgroundColor: "grey", color: "white" }}
                        >
                          Waiting for confirmation
                        </button>
                      );
                    case 1:
                      return (
                        <button
                        >
                          Redeem
                        </button>
                      );
                    case 2:
                      return <button disabled>Another Status</button>;
                    default:
                      return null;
                  }
                })()}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsumerTrack;