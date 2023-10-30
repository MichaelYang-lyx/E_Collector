import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Wallet.module.css";
import { db } from "../../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const IssueMore = (props) => {
  const [transferHash, setTransferHash] = useState(null);
  const [info, setInfo] = useState(null);
  const [hasInfo, setHasInfo] = useState(false);

  const databaseProcess = async (tokenUid, quantity) => {
    // process products database
    const docRef2 = doc(db, "products", tokenUid);
    const query2 = await query(
      collection(db, "products"),
      where("uid", "==", tokenUid)
    );


    const querySnapshot2 = await getDocs(query2);
    const seller_hold = Number(querySnapshot2.docs[0].data().seller_hold);
    const current_seller_hold = seller_hold + Number(quantity);

    await updateDoc(docRef2, {
      uid: tokenUid,
      seller_hold: current_seller_hold,
    });

    console.log(`Add {quantity} to seller_hold`);
 
  };

  const issueMoreHandler = async (e) => {
    e.preventDefault();
    try {
      await setHasInfo(true);
      await setInfo("Issue more tokens processing...");
      let issueAmount = e.target.issueAmount.value;
     
      let owner = await props.contract.owner();
      console.log('Contract owner: ', owner);

      

      
      
      
      let txt = await props.contract.mintToOwner(issueAmount);
      setTransferHash(txt.hash);
      let receipt = await txt.wait();
      if (receipt.status === 1) {
        await databaseProcess(props.tokenUid, issueAmount);
        await props.setUpdateInfo(props.updateInfo + 1);
        console.log("Issue more tokens finished!");
        await setInfo("Issue more tokens finished!");
      } else {
        console.log("Issue more tokens failed!");
        await setInfo("Issue more tokens failed!");
      }

      //-----
    } catch (err) {
      setHasInfo(true);
      setInfo("Issue more tokens failed!");
      console.log(err);
    }
  };

  return (
    <div className={styles.interactionsCard}>
      <form onSubmit={issueMoreHandler}>
        <h3> Issue More </h3>


        <p> Issue Amount </p>
        <input type="number" id="issueAmount" min="0" step="1" />

        <button type="submit" className={styles.button6}>
          Send
        </button>
        <div>{transferHash}</div>
        <div>{hasInfo && <span>{info}</span>}</div>
      </form>
    </div>
  );
};

export default IssueMore;
