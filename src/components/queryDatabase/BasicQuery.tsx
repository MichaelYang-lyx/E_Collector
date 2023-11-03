
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db, storage } from "../../firebase";

interface Token {
  tName: string;
  ticker: string;
  buyer_hold: number;
  seller_hold: number;
  redeemed: boolean;
  photoURL: string;
  contractAddress: string;
  uid: string;
}


export async function queryDatabase(databaseName,keyName,myKey) {
  
    const q = query(collection(db, databaseName), where(keyName, "==",myKey));
    try {
      const querySnapshot = await getDocs(q);
      const results: Token[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as Token);
      });
      return results
    } catch (err) {
      console.log(err)
    }
    
}


// data.js
export const statusMap = new Map([
  [0, 'Wait for comfirmation'],
  [1, 'Shipping'],
  [2, 'Finished'],
]);
