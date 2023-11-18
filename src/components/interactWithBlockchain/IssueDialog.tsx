import React, { useState,useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AuthContext } from '../../context/AuthContext';
import tokenData  from "./Contracts/Token.json";
import { ethers } from 'ethers';
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

export function IssueDialog({ open, onClose, productId, productName,tokenContract,updateInfo,setUpdateInfo }) {
  const [quantity, setQuantity] = useState(1);
  const { currentUser }: any = useContext(AuthContext);

  const [transferHash, setTransferHash] = useState<string|null>(null);
  const [info, setInfo] = useState<string|null>(null);
  const [hasInfo, setHasInfo] = useState<boolean|null>(false);


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



  const handleIssue = async() => {
    onClose();


    const token_abi: any = tokenData.abi;
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(tokenContract, token_abi, tempSigner);

    try {
        await setHasInfo(true);
        await setInfo("Issue more tokens processing...");
        //let issueAmount = e.target.issueAmount.value;
       
        let owner = await tempContract.owner();
        console.log('Contract owner: ', owner);
  
        
        let txt = await tempContract.mintToOwner(quantity);
        setTransferHash(txt.hash);
        let receipt = await txt.wait();
        if (receipt.status === 1) {
          await databaseProcess(productId, quantity);
          await setUpdateInfo(updateInfo + 1);
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Issue {productName}</DialogTitle>
      <DialogContent>
        <div>
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleIssue}>Issue</Button>
      </DialogActions>
    </Dialog>
  );
}
