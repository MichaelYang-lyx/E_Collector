
import { queryDatabase } from './BasicQuery';

export const getSellerTokens = async (userID) => {



  const results = await queryDatabase("products", "merchant", userID);

  if (results !== undefined) {
    let productsArray = results.map((item) => ({
      image: item.photoURL,
      name: item.tName,
      tokenQtys: {
        sellerHold: item.seller_hold,
        buyerHold: item.buyer_hold,
        redeemed: item.redeemed,
      },
      tokenContract:item.contractAddress,
      id: item.uid,
    }));
    return productsArray
  }
};
