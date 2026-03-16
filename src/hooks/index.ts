import { useState, useEffect, useCallback } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import TokenFactoryABI from "../components/interactWithBlockchain/Contracts/TokenFactory.json";
import TokenABI from "../components/interactWithBlockchain/Contracts/Token.json";
import { FACTORY_ADDRESS, MARKETPLACE_ADDRESS } from "../Global";

declare global {
  interface Window { ethereum?: any; }
}

// ==================== useWallet ====================

interface WalletState {
  account: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    account: null,
    chainId: null,
    provider: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState(s => ({ ...s, error: "Please install MetaMask" }));
      return;
    }
    setState(s => ({ ...s, isConnecting: true, error: null }));
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setState({
        account: accounts[0],
        chainId: Number(network.chainId),
        provider,
        isConnecting: false,
        error: null,
      });
    } catch (e: any) {
      setState(s => ({ ...s, isConnecting: false, error: e.message }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({ account: null, chainId: null, provider: null, isConnecting: false, error: null });
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (accounts: string[]) => {
      setState(s => ({ ...s, account: accounts[0] || null }));
    };
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccounts);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccounts);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { ...state, connect, disconnect };
}

// ==================== useContract ====================

export function useContract<T extends Contract>(address: string, abi: any) {
  const { provider } = useWallet();
  const [contract, setContract] = useState<T | null>(null);

  useEffect(() => {
    if (!provider || !address) return;
    const init = async () => {
      const signer = await provider.getSigner();
      const c = new Contract(address, abi, signer) as unknown as T;
      setContract(c);
    };
    init();
  }, [provider, address, abi]);

  return contract;
}

// ==================== useTokenFactory ====================

export function useTokenFactory() {
  const { provider } = useWallet();

  const createToken = useCallback(async (
    name: string,
    ticker: string,
    initialSupply: number,
    maxSupply: number,
  ) => {
    if (!provider) throw new Error("Wallet not connected");
    const signer = await provider.getSigner();
    const factory = new Contract(FACTORY_ADDRESS, TokenFactoryABI.abi, signer);
    const tx = await factory.createToken(initialSupply, name, ticker, maxSupply);
    const receipt = await tx.wait();

    // Parse TokenDeployed event
    const event = receipt.logs.find((log: any) => {
      try {
        return factory.interface.parseLog(log)?.name === "TokenDeployed";
      } catch { return false; }
    });

    if (event) {
      const parsed = factory.interface.parseLog(event);
      return parsed?.args.tokenAddress;
    }
    return null;
  }, [provider]);

  return { createToken };
}

// ==================== useTokenBalance ====================

export function useTokenBalance(tokenAddress: string, account: string | null) {
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const { provider } = useWallet();

  const refresh = useCallback(async () => {
    if (!provider || !tokenAddress || !account) return;
    setLoading(true);
    try {
      const token = new Contract(tokenAddress, TokenABI.abi, provider);
      const bal = await token.balanceOf(account);
      setBalance(bal);
    } catch (e) {
      console.error("Failed to fetch balance:", e);
    }
    setLoading(false);
  }, [provider, tokenAddress, account]);

  useEffect(() => { refresh(); }, [refresh]);

  return { balance, loading, refresh };
}

// ==================== useFirestoreQuery ====================

import { collection, query, where, onSnapshot, QueryConstraint, getFirestore } from "firebase/firestore";

export function useFirestoreQuery<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  deps: any[] = [],
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const q = query(collection(db, collectionName), ...constraints);
    const unsub = onSnapshot(q,
      (snapshot) => {
        const results = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as T));
        setData(results);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, deps);

  return { data, loading, error };
}
