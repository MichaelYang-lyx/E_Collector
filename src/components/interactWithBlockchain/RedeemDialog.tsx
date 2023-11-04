import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { v4 as uuid } from "uuid";
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
import { db } from "../../firebase";


export default function RedeemDialog({
  open,
  onClose,
  productId,
  productName,
  updateInfo,
  setUpdateInfo,
}: {
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  productName: string | undefined;
  updateInfo:number;
  setUpdateInfo:(value: number) => void;
}) {
  const [redeemInfo, setRedeemInfo] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    quantity: 1,
  });


  const [info, setInfo] = useState<string | null>(null);
  const [hasInfo, setHasInfo] = useState<boolean>(false);
  const { currentUser }: any = useContext(AuthContext);
  
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
  
   /*
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  productName: string | undefined;
  updateInfo:number;
  setUpdateInfo:(value: number) => void;
  const redeemInfo: {
    name: string;
    phoneNumber: string;
    address: string;
    quantity: number;

*/


  const handleRedeem = async() => {
    
    try {
      await setHasInfo(true);
      await setInfo("Redeem processing...");
      let redeemAmount: number = redeemInfo.quantity;
      const shippingInfo: { phoneNumber: string; shippingAddress: string } = {
        phoneNumber: redeemInfo.phoneNumber,
        shippingAddress: redeemInfo.address,
      };
  
      await databaseProcess(productId, redeemAmount, shippingInfo);
      await setUpdateInfo(updateInfo + 1);
      console.log("Redeem finished!");
      await setInfo("Redeem finished!");
      onClose();
    } catch (err) {
      setHasInfo(true);
      setInfo("Redeem failed!");
      console.log(err);
    }

    

  };
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>
        Redeem {productName} {productId}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="outlined-required"
          label="Name"
          value={redeemInfo.name}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, name: e.target.value });
          }}
          fullWidth
        />
        <TextField
          margin="dense"
          id="outlined-required"
          label="Phone Number"
          value={redeemInfo.phoneNumber}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, phoneNumber: e.target.value });
          }}
          fullWidth
        />
        <TextField
          margin="dense"
          id="outlined-multiline-static"
          label="Address"
          multiline
          rows={3}
          value={redeemInfo.address}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, address: e.target.value });
          }}
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="standard-number"
          label="Quantity"
          value={redeemInfo.quantity}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, quantity: +e.target.value });
          }}
          type="number"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRedeem}>Redeem</Button>
      </DialogActions>
    </Dialog>
  );
}
