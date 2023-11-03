import React, { useContext, useEffect, useState } from "react";
import { FC } from "react";
import { AuthContext } from "../context/AuthContext";
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
import tokenData from '../components/wallet/Contracts/Token.json';
interface Product {
  tName: string;
  ticker: string;
  contractAddress: string;
  photoURL: string;
}

interface SearchResult {
  uid: string;
  productID: string;
  userID: string;
  quantity: number;
}

interface MyTokens2Props {}

const MyTokens2: FC<MyTokens2Props> = () => {
  const token_abi = tokenData.abi;
  const { currentUser }:any = useContext(AuthContext);

  const [err, setErr] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRedeem, setShowRedeem] = useState<boolean>(false);
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
    }
  };

  const handleSearch = async (): Promise<void> => {
    const q = query(
      collection(db, "consumer_tokens"),
      where("userID", "==", currentUser.uid)
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
    } catch (err) {
      setErr(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [updateInfo]);

  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenName, setTokenName] = useState<string>("Token");
  const [tokenUid, setTokenUid] = useState<string | null>(null);

  const handleOpenRedeem = async (result: SearchResult, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
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
    setShowRedeem(true);
  };

  useEffect(() => {
    if (contract != null) {
    }
  }, [contract]);

  const handleCloseRedeem = (): void => {
    setShowRedeem(false);
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

        {showRedeem && (
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