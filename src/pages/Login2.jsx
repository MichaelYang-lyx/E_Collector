import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import styles from "../components/wallet/Wallet.module.css";
import { auth, db } from "../firebase";

const Login2 = () => {
  const [err, setErr] = useState(false);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);

  const navigate = useNavigate();

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
    e.preventDefault();
    const address = defaultAccount;
    const password = e.target[0].value;

    try {
      if (!address) {
        setErr(true);
        setErrorMessage(`Please connect to your Metamask wallet`);
        throw new Error("Please connect to your Metamask wallet");
      }

      const addressQuery = await query(
        collection(db, "users"),
        where("address", "==", address)
      );
      const addressQuerySnapshot = await getDocs(addressQuery);

      if (addressQuerySnapshot.empty) {
        // Email already exists, throw an error

        console.log(addressQuerySnapshot.empty);
        setErr(true);
        setErrorMessage(
          `Address:[${address}] has not been used for registration`
        );
        throw new Error(
          `Address:[${address}] has not been used to create a wallet`
        );
      }
      const email = addressQuerySnapshot.docs[0].data().email;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (err) {
        setErr(true);
        setErrorMessage("Incorrect Password. Please try again.");
      }

    } catch (err) {
      setErr(true);
    }
    
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div>
          <h2> {"Connect your Wallet"} </h2>
          <button className={styles.button6} onClick={connectWalletHandler}>
            <h3>Address: {defaultAccount}</h3>
            {connButtonText}
          </button>
        </div>

        <span className="logo">Web3 Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>{errorMessage}</span>}
        </form>
        <p>
          You don't have an account? <Link to="/register2">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login2;
