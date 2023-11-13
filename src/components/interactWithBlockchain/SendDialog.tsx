import React, { useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../../context/AuthContext";
import tokenData from "../wallet/Contracts/Token.json";
import { ethers } from "ethers";
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
import { updatePassiveOperations } from "../queryDatabase/BasicQuery";

export function SendDialog({
  open,
  onClose,
  productId,
  productName,
  tokenContract,
  updateInfo,
  setUpdateInfo,
}) {
  const [quantity, setQuantity] = useState(1);
  const [recipientEmail, setRecipientEmail] = useState("");

  const [transferHash, setTransferHash] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [hasInfo, setHasInfo] = useState<boolean | null>(false);

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

    const merchantID = querySnapshot2.docs[0].data().merchant;
    //更新 products
    await updateDoc(docRef2, {
      uid: tokenUid,
      seller_hold: current_seller_hold,
      buyer_hold: current_buyer_hold,
    });

    // process consumer_tokens database
    const uid = tokenUid + userID;

    const docRef = doc(db, "consumer_tokens", uid);
    const docSnapshot = await getDoc(docRef);
    //更新 consumer_tokens
    //如果有就加上去
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
      
      
      //如果沒有就新增
      console.log("Document does not exist!");
      await setDoc(doc(db, "consumer_tokens", uid), {
        uid: uid,
        productID: tokenUid,
        userID: userID,
        quantity: Number(quantity),
        merchantID: merchantID,
      });
    }
    await updatePassiveOperations(userID)
    console.log(uid);
  };

  const handleSend = async () => {
    onClose();
    console.log({ productId, quantity, recipientEmail });
    const token_abi: any = tokenData.abi;
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(
      tokenContract,
      token_abi,
      tempSigner
    );

    try {
      await setHasInfo(true);
      await setInfo("Transaction processing...");

      const query1 = await query(
        collection(db, "users"),
        where("email", "==", recipientEmail)
      );
      const querySnapshot1 = await getDocs(query1);
      const recieverAddress = querySnapshot1.docs[0].data().address;
      console.log(recieverAddress);
      let txt = await tempContract.transfer(recieverAddress, quantity);

      setTransferHash(txt.hash);
      let receipt = await txt.wait();
      if (receipt.status === 1) {
        const userID = querySnapshot1.docs[0].data().uid;
        await databaseProcess(productId, userID, quantity);
        await setUpdateInfo(updateInfo + 1);
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send {productName}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Recipient Email"
          type="email"
          fullWidth
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend}>Send</Button>
      </DialogActions>
    </Dialog>
  );
}
