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
import { ethers } from "ethers";
import tokenData from "../wallet/Contracts/Token.json";

export default function RedeemDialog({
  open,
  onClose,
  productId,
  productName,
  tokenContract,
  updateInfo,
  setUpdateInfo,
}: {
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  productName: string | undefined;
  tokenContract: string | undefined;
  updateInfo: number;
  setUpdateInfo: (value: number) => void;
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

  const databaseProcess = async (
    consumer_tokens_uid,
    quantity,
    shippingInfo
  ) => {
    // process consumer_tokens database
    const uid = await uuid();

    const query1 = await query(
      collection(db, "consumer_tokens"),
      where("uid", "==", consumer_tokens_uid)
    );
    const querySnapshot1 = await getDocs(query1);
    const original_quantity1 = Number(querySnapshot1.docs[0].data().quantity);
    if (original_quantity1 < Number(quantity)) {
      setHasInfo(true);
      setInfo("Insufficient quantity");
      throw new Error("Insufficient quantity");
    }

    const current_quantity1 = original_quantity1 - Number(quantity);
    const productID = querySnapshot1.docs[0].data().productID;
    const merchantID = querySnapshot1.docs[0].data().merchantID;

    const docRef = doc(db, "consumer_tokens", consumer_tokens_uid);
    await updateDoc(docRef, {
      uid: consumer_tokens_uid,
      quantity: current_quantity1,
    });


    //operate on products database
    const query2 = await query(
      collection(db, "products"),
      where("uid", "==", productID)
    );
    const querySnapshot2 = await getDocs(query2);
    const original_buyer_hold = Number(
      querySnapshot2.docs[0].data().buyer_hold
    );
    const original_redeemed = Number(querySnapshot2.docs[0].data().redeemed);
    const docRef2 = doc(db, "products", productID);
    await updateDoc(docRef2, {
      uid: productID,
      redeemed: original_redeemed + Number(quantity),
      buyer_hold: original_buyer_hold + Number(quantity),
    });

    await setDoc(doc(db, "tracks", uid), {
      uid: uid,
      productID: productID,
      merchantID: merchantID,
      consumerID: currentUser.uid,
      quantity: Number(quantity),
      //status: 0 - waiting for confirmation, 1 - confirmed and in shipping, 2 - received
      status: 0,
      shippingInfo: shippingInfo,
    });
  };

  const handleRedeem = async () => {
    console.log("contract address");
    console.log(tokenContract);

    if (tokenContract) {
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
        await setInfo("Redeem processing...");
        let redeemAmount: number = redeemInfo.quantity;
        let txt = await tempContract.burn(redeemAmount);
        let receipt = await txt.wait();

        if (receipt.status === 1) {
          const shippingInfo: {
            phoneNumber: string;
            shippingAddress: string;
            buyerName: string;
          } = {
            phoneNumber: redeemInfo.phoneNumber,
            shippingAddress: redeemInfo.address,
            buyerName: redeemInfo.name,
          };

          await databaseProcess(productId, redeemAmount, shippingInfo);
          await setUpdateInfo(updateInfo + 1);
          console.log("Redeem finished!");
          await setInfo("Redeem finished!");
          onClose();
        }
      } catch (err) {
        setHasInfo(true);
        setInfo("Redeem failed!");
        console.log(err);
      }
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
        <div>{hasInfo && <span>{info}</span>}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRedeem}>Redeem</Button>
      </DialogActions>
    </Dialog>
  );
}
