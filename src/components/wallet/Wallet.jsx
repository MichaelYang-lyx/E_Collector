import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import Interactions from './Transfers';
import { TokencontractAddress } from './TokenFactory';
import tokenData from './Contracts/Token.json';


const Wallet = () => {

	// ganache-cli address
	const contractAddress = TokencontractAddress;
	const token_abi = tokenData.abi;
	const [tokenName, setTokenName] = useState("Token");
	const [connButtonText, setConnButtonText] = useState("Connect Wallet");
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [balance, setBalance] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);


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

		let tempContract = new ethers.Contract(contractAddress, token_abi, tempSigner)

		setProvider(tempProvider);
		setSigner(tempSigner);
		setContract(tempContract);
	}

	useEffect(() => {
		if (contract != null) {
			updateBalance();
			updateTokenName();
		}
	}, [contract])

	const updateBalance = async () => {
		let balanceBigN = await contract.balanceOf(defaultAccount);
		let tokenBalance = balanceBigN.toNumber();

		//let decimals = await contract.decimals();

		//let tokenBalance = balanceNumber / Math.pow(10, 2);

		setBalance(tokenBalance);
		console.log(tokenBalance);
	}

	const updateTokenName = async () => {
		setTokenName(await contract.getTname());
	}
	
return (
	<div>
		<h2> {tokenName + " ERC-20 Wallet"} </h2>
		<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

		<div className = {styles.walletCard}>
			<div>
				<h3>Token Contract Address: {contractAddress}</h3>
			</div>
			<div>
				<h3>User Address: {defaultAccount}</h3>
			</div>
			<div>
				<h3>{tokenName} Balance: {balance}</h3>
			</div>
			{errorMessage}
			</div>

			<Interactions contract={contract}/>
	</div>
	);
}

export default Wallet;