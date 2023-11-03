import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db, storage } from "../firebase";
import GetBack from "../components/GetBack";
import Transfers from "../components/wallet/Transfers";
import IssueMore from "../components/wallet/IssueMore";
import tokenData from "../components/wallet/Contracts/Token.json";
import tokenfactoryData from "../components/wallet/Contracts/TokenFactory.json";
import "../style.scss";

interface Token {
  tName: string;
  ticker: string;
  buyer_hold: number;
  seller_hold: number;
  redeemed: boolean;
  photoURL: string;
  contractAddress: string;
  uid: string;
}

const MyTokens: React.FC = () => {
  const token_abi: any = tokenData.abi;
  const { currentUser }: any = useContext(AuthContext);

  const [err, setErr] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTransfer, setShowTransfer] = useState<boolean>(false);
  const [showIssueMore, setShowIssueMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [updateInfo, setUpdateInfo] = useState<number>(0);

  const handleSearch = async (): Promise<void> => {
    const merchant: string = currentUser.uid;
    const q = query(collection(db, "products"), where("merchant", "==", merchant));

    try {
      const querySnapshot = await getDocs(q);
      const results: Token[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as Token);
      });
      setSearchResults(results);
    } catch (err) {
      setErr(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [updateInfo]);

  const [contract, setContract] = useState<any>(null);
  const [tokenName, setTokenName] = useState<string>("Token");
  const [tokenUid, setTokenUid] = useState<string | null>(null);

  const handleOpenTransfer = async (result: Token, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(result.contractAddress, token_abi, tempSigner);

    setContract(tempContract);
    setTokenName(result.tName);
    setTokenUid(result.uid);
    setShowTransfer(true);
  };

  const handleOpenIssueMore = async (result: Token, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault();

    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(result.contractAddress, token_abi, tempSigner);

    setContract(tempContract);
    setTokenName(result.tName);
    setTokenUid(result.uid);
    setShowIssueMore(true);
  };

  useEffect(() => {
    if (contract != null) {
      // Do something
    }
  }, [contract]);

  const handleCloseTransfer = (): void => {
    setShowTransfer(false);
  };

  const handleCloseIssueMore = (): void => {
    setShowIssueMore(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // Handle form submission here
    //handleCloseModal();
  };

  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <GetBack />
          <span className="logo"> My Tokens - Merchant</span>
          <form onSubmit={handleSubmit}>
            {loading && "Creating Token.. Please wait..."}
            {err && <span>{errorMessage}</span>}
            {searchResults.map((result, index) => (
              <div key={index}>
                {result.tName} {result.ticker} {result.buyer_hold} {result.seller_hold} {result.redeemed}
                <img src={result.photoURL} alt="" />
                <button onClick={(event) => handleOpenTransfer(result, event)}>Transfer</button>
                <span> -- </span>
                <button onClick={(event) => handleOpenIssueMore(result, event)}>Issue More</button>
              </div>
            ))}
          </form>
        </div>

        {showTransfer && (
          <div className="transfer">
            <div className="transfer-content">
              <button onClick={handleCloseTransfer}>×</button>
              <Transfers
                contract={contract}
                tokenUid={tokenUid}
                updateInfo={updateInfo}
                setUpdateInfo={setUpdateInfo}
              />
            </div>
          </div>
        )}
        {showIssueMore && (
          <div className="transfer">
            <div className="transfer-content">
              <button onClick={handleCloseIssueMore}>×</button>
              <IssueMore
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

export default MyTokens;