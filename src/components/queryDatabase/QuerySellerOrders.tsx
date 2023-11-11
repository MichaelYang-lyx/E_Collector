
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
  const q = query(collection(db, "tracks"), where("merchantID", "==", userID));

  const querySnapshot = await getDocs(q);
  const results: any[] = [];
  
  for (const doc of querySnapshot.docs) {
    let single_result = doc.data();
    
    const product_info = await getTokens(doc.data().productID);
    const user_info=await getUsers(doc.data().consumerID)
    
    if (product_info !== undefined && user_info !== undefined) {
      let { tName, ticker, contractAddress, photoURL } = product_info;
      single_result = {
        ...single_result,
        tName,
        ticker,
      
        photoURL,
        contractAddress,
      };
      results.push(single_result);
    }
  }

  /*
  id: "order1",
  productName: "Toilet Paper",
  imgSrc: "/images/toilet-papers.jpg",
  qty: 10,
  buyerName: "Bob",
  buyerPhone: "+852 1234 5678",
  buyerAddress: `Flat 25, 12/F, Acacia Building
  150 Nathan Road
  Tsim Sha Tsui, Kowloon`,
  */
  if (results !== undefined) {
    let ordersArray = results.map((item) => ({
      qty: item.quantity,
      id: item.uid,
      imgSrc: item.photoURL,
      productName: item.tName,
      buyerName:item.shippingInfo.buyerName,
      buyerPhone: item.shippingInfo.phoneNumber,
      buyerAddress: item.shippingInfo.shippingAddress,
      status:item.status,

    }));
    return ordersArray;
  }
};


