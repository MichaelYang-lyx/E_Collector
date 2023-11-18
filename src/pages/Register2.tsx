import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import styles from "../components/wallet/Wallet.module.css";
import GitHubCorner from "../GitHubCorner";

const Register2 = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [errorMessage, setErrorMessage] = useState("Something went wrong");
  const [defaultAccount, setDefaultAccount] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("need to install metamask");
      setErrorMessage("Please install MetaMask");
    }
  };

  const accountChangedHandler = (newAddress) => {
    setDefaultAccount(newAddress);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    const address = defaultAccount;
    try {
      if (!address) {
        setErr(true);
        setErrorMessage(`Please connect to your Metamask wallet`);
        throw new Error("Please connect to your Metamask wallet");
      }
      const emailQuery = await query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const emailQuerySnapshot = await getDocs(emailQuery);

      if (!emailQuerySnapshot.empty) {
        // Email already exists, throw an error
        setErr(true);
        setErrorMessage(`Email:[${email}] already exists`);
        throw new Error("Email already exists");
      }

      const addressQuery = await query(
        collection(db, "users"),
        where("address", "==", address)
      );
      const addressQuerySnapshot = await getDocs(addressQuery);

      if (!addressQuerySnapshot.empty) {
        // Email already exists, throw an error
        setErr(true);
        setErrorMessage(
          `Address:[${address}] has already been used for registration`
        );
        throw new Error(
          `Address:[${address}] has already been used for registration`
        );
      }

      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              address,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "user_passive_operations", res.user.uid), {
              uid: res.user.uid,
              number:0
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  const [fileUploaded, setFileUploaded] = useState(false);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileUploaded(true);
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
      <img src="/images/Logo.png" alt="Logo" height="80em"  className="imglogo"/>
        <div>
          <button className={styles.button6} onClick={connectWalletHandler}>
            <h3>Address: {defaultAccount}</h3>
            {connButtonText}
          </button>
        </div>
        
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input
            required
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an profile picture</span>
          </label>
          {fileUploaded && <p>Picture uploaded successfully!</p>}
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>{errorMessage}</span>}
        </form>

        <p>
          You do have an account? <Link to="/login2">Login</Link>
        </p>
      </div>
      <GitHubCorner/>
    </div>
  );
};

export default Register2;
