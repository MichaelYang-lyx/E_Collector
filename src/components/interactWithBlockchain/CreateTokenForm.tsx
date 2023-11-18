import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ImageUploader from "./ImageUploader";

import { v4 as uuid } from "uuid";

import { useNavigate, Link } from "react-router-dom";

import tokenfactoryData from "./Contracts/TokenFactory.json";
import { contractAddress } from "../../Global";
import "../../style.scss";
import { AuthContext } from "../../context/AuthContext";
import { ethers } from "ethers";

import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface CreateTokenFormProps {
  updateInfo: number; // 替换为实际的类型
  setUpdateInfo: (info: any) => void; // 替换为实际的类型
}


const CreateTokenForm: React.FC<CreateTokenFormProps> = (props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const tickerRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);
  //onst fileRef = React.useRef<HTMLInputElement>(null);
  const tokenfactory_abi = tokenfactoryData.abi;

  const [contract, setContract] = useState<any | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { currentUser }: any = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [imageFile, setImageFile] = useState<any | null>(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let contractAddress = "";
    if (nameRef.current && quantityRef.current && tickerRef.current) {
      const tName = nameRef.current.value;
      const ticker = tickerRef.current.value;
      const quantity = Number(quantityRef.current.value);

      try {
        // blockchain activity
        console.log("Create Token");
        console.log(contract);
        const tx = await contract.createToken(quantity, tName, ticker);

        await tx.wait();
        console.log(tx);
        const tokenCount = await contract.tokenCount();
        const tokenAddress = await contract.list_of_tokens(tokenCount - 1);
        contractAddress = tokenAddress;
        console.log("address", contractAddress);
        console.log("Create Token in blockchain");

        // firebase backend activity
        // generate productID
        const productID = uuid();
        console.log("productId", productID);
        const merchant = currentUser.uid;

        //Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${ticker + date}`);
        await uploadBytesResumable(storageRef, imageFile).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              await setDoc(doc(db, "products", productID), {
                uid: productID,
                tName,
                ticker,
                merchant,
                seller_hold: quantity,
                buyer_hold: 0,
                redeemed: 0,
                contractAddress,
                photoURL: downloadURL,
              });
              console.log("Create Token in firebase");
              await props.setUpdateInfo(props.updateInfo + 1);
              console.log('now Update Info',props.updateInfo)
            } catch (err) {
              console.log(err);
            }
          });
        });
        
       
      } catch (err) {
        console.error(err);
      }
    }
  };

  const updateEthers = async () => {
    console.log("UpdateEthers");
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = await tempProvider.getSigner();
    let tempContract = new ethers.Contract(
      contractAddress,
      tokenfactory_abi,
      tempSigner
    );
    await setContract(tempContract);
  };

  //check the wallet condition
  const checkWallet = async () => {
    const emailQuery = await query(
      collection(db, "users"),
      where("email", "==", currentUser.email)
    );
    const emailQuerySnapshot = await getDocs(emailQuery);
    const address = emailQuerySnapshot.docs[0].data().address;
    let currentAddress = "";
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        currentAddress = result[0];
        console.log("Wallet is valid");
      })
      .catch((error) => {
        console.log(error.message);
      });
    if (address != currentAddress) {
      console.log("You should use your own Metamask wallet");
      throw new Error("You should use your own Metamask wallet");
    }
  };

  useEffect(() => {
    updateEthers();
  }, []);

  const handleAdd = () => {
    setOpen(true);
    setImageFile(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageFileChange = (file: File) => {
    setImageFile(file);
  };

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleAdd}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Product</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              width: "min(calc(100vw - 64px), 345px)",
            }}
          >
            <TextField
              margin="dense"
              id="outlined-required"
              label="Name"
              //defaultValue="Apple"
              fullWidth
              inputRef={nameRef}
            />
            <TextField
              autoFocus
              id="standard-number"
              label="Ticker"
              //defaultValue="Apple"
              fullWidth
              inputRef={tickerRef}
            />
            <TextField
              autoFocus
              id="standard-number"
              label="Quantity"
              defaultValue={1}
              type="number"
              fullWidth
              inputRef={quantityRef}
            />
            <ImageUploader onImageFileChange={handleImageFileChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleClose}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateTokenForm;
