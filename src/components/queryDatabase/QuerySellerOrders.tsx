
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db, storage } from "../../firebase";
import { statusMap } from "./BasicQuery";
const getTokens = async (productID: string) => {
  const q = query(collection(db, "products"), where("uid", "==", productID));
  try {
    const qSnapshot = await getDocs(q);
    const result = qSnapshot.docs[0].data();
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getUsers = async (uid: string) => {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  try {
    const qSnapshot = await getDocs(q);
    const result = qSnapshot.docs[0].data();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getSellerOrders = async (userID) => {
  const q = query(collection(db, "tracks"), where("consumerID", "==", userID));

  const querySnapshot = await getDocs(q);
  const results: any[] = [];
  for (const doc of querySnapshot.docs) {
    let single_result = doc.data();
    const product_info = await getTokens(doc.data().productID);
    const user_info=await getUsers(doc.data().consumberID)
    if (product_info !== undefined && user_info !== undefined) {
      let { tName, ticker, uid, contractAddress, photoURL } = product_info;
      let { displayName } = user_info;
      single_result = {
        ...single_result,
        tName,
        ticker,
        uid,
        photoURL,
        contractAddress,
        displayName
      };
      results.push(single_result);
    }
  }

  /*
  {
    imageSrc: "/images/toilet-papers.jpg",
    name: "Toilet Paper",
    qty: 10,
    buyer: "Bob",
    id: "Toilet Paper",
  },
  */
  if (results !== undefined) {
    let ordersArray = results.map((item) => ({
      imageSrc: item.photoURL,
      name: item.tName,
      status:statusMap.get(item.status),
      qty: item.quantity,
      id: item.uid,
    }));
    return ordersArray;
  }
};


