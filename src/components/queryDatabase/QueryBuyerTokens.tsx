
import { queryDatabase } from './BasicQuery';


import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db, storage } from "../../firebase";



const getTokens = async (productID: string) => {
  const q = query(collection(db, "products"), where("uid", "==", productID));
  try {
    const qSnapshot = await getDocs(q);
    const result = qSnapshot.docs[0].data();
    return result;
  } catch (err) {
  console.log(err)
  }
};

export const getBuyerTokens = async (userID) => {


  const q = query(
    collection(db, "consumer_tokens"),
    where("userID", "==", userID)
  );

    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    for (const doc of querySnapshot.docs) {
      let single_result = doc.data();
      const product_info = await getTokens(doc.data().productID);
      if (product_info !== undefined){
      let { tName, ticker,contractAddress, photoURL } = product_info;
      single_result = {
        ...single_result,
        tName,
        ticker,
        photoURL,
        contractAddress,
      };
      results.push(single_result);
    }}


  if (results !== undefined) {
    let tokensArray = results.map((item) => ({
      imageSrc: item.photoURL,
      name: item.tName,
      qtyLeft: item.quantity,
      id: item.uid,
      tokenContract:item.contractAddress,
    }));
    return tokensArray
  }

}
