

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

/*     await setDoc(doc(db, "user_passive_operations", res.user.uid), {
              uid: res.user.uid,
              number:0
            });
            */
export async function updatePassiveOperations(passiveUserId) {

  const docRef = doc(db, "user_passive_operations", passiveUserId);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    console.log("Document exists!");

    const query1 = await query(
      collection(db, "user_passive_operations"),
      where("uid", "==", passiveUserId)
    );
    const querySnapshot1 = await getDocs(query1);
    const original_number = Number(querySnapshot1.docs[0].data().number);
    const current_number = original_number + 1;

    await updateDoc(docRef, {
      uid: passiveUserId,
      number: current_number,
    });
  } else {
    
    //如果沒有就新增
    console.log("Document does not exist!");
    await setDoc(doc(db, "user_passive_operations", passiveUserId), {
      uid: passiveUserId,
      number: 0
    });
  }
}


// data.js
export const statusMap = new Map([
  [0, 'Wait for comfirmation'],
  [1, 'Shipping'],
  [2, 'Finished'],
]);
