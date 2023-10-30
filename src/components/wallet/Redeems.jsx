import { React, useState, useEffect ,useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
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
import { v4 as uuid } from "uuid";

const Redeems = (props) => {
  const [transferHash, setTransferHash] = useState(null);
  const [info, setInfo] = useState(null);
  const [hasInfo, setHasInfo] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const databaseProcess = async (consumer_tokens_uid, quantity,shippingInfo) => {
    
    // process consumer_tokens database
    const uid = await uuid();

      const query1 = await query(
        collection(db, "consumer_tokens"),
        where("uid", "==", consumer_tokens_uid)
      );
      const querySnapshot1 = await getDocs(query1);
      const original_quantity1 = Number(querySnapshot1.docs[0].data().quantity);
      const current_quantity1 = original_quantity1 - Number(quantity);
      const productID = querySnapshot1.docs[0].data().productID;
      const merchantID = querySnapshot1.docs[0].data().merchantID;

      const docRef = doc(db, "consumer_tokens", consumer_tokens_uid);
      await updateDoc(docRef, {
        uid: consumer_tokens_uid,
        quantity: current_quantity1,
      });


      await setDoc(doc(db, "tracks", uid), {
        uid: uid,
        productID: productID,
        merchantID:merchantID,
        consumerID: currentUser.uid,
        quantity: Number(quantity),
        //status: 0 - waiting for confirmation, 1 - confirmed and in shipping, 2 - received 
        status: 0,
        shippingInfo: shippingInfo,
      });
     
    console.log(uid);
 
  };

  const redeemHandler = async (e) => {
    e.preventDefault();
    try {
      await setHasInfo(true);
      await setInfo("Redeem processing...");
      let redeemAmount = e.target.redeemAmount.value;
      const shippingInfo={
        phoneNumber:e.target.phoneNumber.value,
        shippingAddress:e.target.shippingAddress.value
      }
      
        await databaseProcess(props.tokenUid, redeemAmount,shippingInfo);
        await props.setUpdateInfo(props.updateInfo + 1);
        console.log("Redeem finished!");
        await setInfo("Redeem finished!");
      

      //-----
    } catch (err) {
      setHasInfo(true);
      setInfo("Redeem failed!");
      console.log(err);
    }
  };

  return (
    <div className={styles.interactionsCard}>
      <form onSubmit={redeemHandler}>
        <h3> Redeem Tokens </h3>
        

        <p> Redeem Amount </p>
        <input type="number" id="redeemAmount" min="0" step="1" />


        <p> Phone Number </p>
        <input type="text" id="phoneNumber" />
        <p> Address </p>
        <input type="text" id="shippingAddress" />

        <button type="submit" className={styles.button6}>
          Send
        </button>
        <div>{transferHash}</div>
        <div>{hasInfo && <span>{info}</span>}</div>
      </form>
    </div>
  );
};

export default Redeems;
