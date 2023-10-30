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

const Redeems = (props) => {
  const [transferHash, setTransferHash] = useState(null);
  const [info, setInfo] = useState(null);
  const [hasInfo, setHasInfo] = useState(false);

  const databaseProcess = async (tokenUid, userID, quantity) => {
    // process products database
    const docRef2 = doc(db, "products", tokenUid);
    const query2 = await query(
      collection(db, "products"),
      where("uid", "==", tokenUid)
    );

    const querySnapshot2 = await getDocs(query2);
    const seller_hold = Number(querySnapshot2.docs[0].data().seller_hold);
    const current_seller_hold = seller_hold - Number(quantity);

    const buyer_hold = Number(querySnapshot2.docs[0].data().buyer_hold);
    const current_buyer_hold = buyer_hold + Number(quantity);
    await updateDoc(docRef2, {
      uid: tokenUid,
      seller_hold: current_seller_hold,
      buyer_hold: current_buyer_hold,
    });

    // process consumer_tokens database
    const uid = tokenUid + userID;

    const docRef = doc(db, "consumer_tokens", uid);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("Document exists!");

      const query1 = await query(
        collection(db, "consumer_tokens"),
        where("uid", "==", uid)
      );
      const querySnapshot1 = await getDocs(query1);
      const original_quantity1 = Number(querySnapshot1.docs[0].data().quantity);
      const current_quantity1 = original_quantity1 + Number(quantity);

      await updateDoc(docRef, {
        uid: uid,
        quantity: current_quantity1,
      });
    } else {
      console.log("Document does not exist!");
      await setDoc(doc(db, "consumer_tokens", uid), {
        uid: uid,
        productID: tokenUid,
        userID: userID,
        quantity: Number(quantity),
      });
    }

    console.log(uid);
 
  };

  const transferHandler = async (e) => {
    e.preventDefault();
    try {
      await setHasInfo(true);
      await setInfo("Transaction processing...");
      let transferAmount = e.target.sendAmount.value;
      let recieverEmail = e.target.recieverEmail.value;
      const query1 = await query(
        collection(db, "users"),
        where("email", "==", recieverEmail)
      );
      const querySnapshot1 = await getDocs(query1);
      const recieverAddress = querySnapshot1.docs[0].data().address;
      console.log(recieverAddress);
      let txt = await props.contract.transfer(recieverAddress, transferAmount);

      setTransferHash(txt.hash);
      let receipt = await txt.wait();
      if (receipt.status === 1) {
        const userID = querySnapshot1.docs[0].data().uid;
        await databaseProcess(props.tokenUid, userID, transferAmount);
        await props.setUpdateInfo(props.updateInfo + 1);
        console.log("Transfer finished!");
        await setInfo("Transaction finished!");
      } else {
        console.log("Transfer failed!");
        await setInfo("Transaction failed!");
      }

      //-----
    } catch (err) {
      setHasInfo(true);
      setInfo("Transaction failed!");
      console.log(err);
    }
  };

  return (
    <div className={styles.interactionsCard}>
      <form onSubmit={transferHandler}>
        <h3> Redeem Tokens </h3>
        <p> Reciever Email </p>
        <input type="text" id="recieverEmail" />

        <p> Send Amount </p>
        <input type="number" id="sendAmount" min="0" step="1" />

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
