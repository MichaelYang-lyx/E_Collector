import {React, useState, createContext,useContext,useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import tokenfactoryData from './Contracts/TokenFactory.json';


var TokencontractAddress = "";


const TokenFactory = () => {

	// ganache-cli address
	const contractAddress = '0xB8f6eDcA4791f6168665F35eFd6C057FbF8617fE';
	//const tokenfactory_abi = require('./Contracts/TokenFactory.json').abi;
	const tokenfactory_abi = tokenfactoryData.abi;
	const [connButtonText, setConnButtonText] = useState("Connect Wallet");
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	//const [balance, setBalance] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);


	const [initialSupply, setInitialSupply] = useState(0);
	const [tname, setTname] = useState('');
	const [tiker, setTiker] = useState('');

	const [latestTokenAddress, setLatestTokenAddress] = useState(null);

	  const createTokenHandler = async (event) => {
		event.preventDefault();
		try {
		  
		
		  const tx = await contract.createToken(initialSupply, tname, tiker);
		  await tx.wait();

		  console.log(tx);

		  const tokenCount = await contract.tokenCount();
		  const tokenAddress = await contract.list_of_tokens(tokenCount-1);
		  setLatestTokenAddress(tokenAddress);
		  TokencontractAddress=tokenAddress;
		  console.log(tokenAddress);
		  alert('Token created!');
		} catch (err) {
		  console.error(err);
		}
	  };

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			})
			

		} else {
			console.log('need to install metamask');
			setErrorMessage('Please install MetaMask');
		}
	}

	const accountChangedHandler = (newAddress) => {
		setDefaultAccount(newAddress);
		updateEthers();
	}

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		let tempSigner = tempProvider.getSigner();
		let tempContract = new ethers.Contract(contractAddress, tokenfactory_abi, tempSigner)

		setProvider(tempProvider);
		setSigner(tempSigner);
		setContract(tempContract);
	}




return (
	<div>
		<h2> {"Factory ERC-20 Wallet"} </h2>
		<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>



		
		<div className = {styles.walletCard}>
			<div>
				<h3>Factory Address: {defaultAccount}</h3>
			</div>
			
			<div>
			</div>
			{errorMessage}
			
			</div>
			<div className = {styles.interactionsCard}>
		<form onSubmit={createTokenHandler}>
      <input type="number" value={initialSupply} onChange={e => setInitialSupply(e.target.value)} placeholder="Initial Supply" />
      <input type="text" value={tname} onChange={e => setTname(e.target.value)} placeholder="Token Name" />
      <input type="text" value={tiker} onChange={e => setTiker(e.target.value)} placeholder="Token Ticker" />
      <input type="submit" value="Create Token" />
    </form>

    	</div>
		<div className = {styles.walletCard}>
			<div>
				<h3>Latest Token Address: {latestTokenAddress}</h3>
			</div>
			</div>
	</div>
	
	);
}

export default TokenFactory;
export {TokencontractAddress};


