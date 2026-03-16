// ===== Blockchain Types =====

export interface TokenInfo {
  tokenAddress: string;
  creator: string;
  productName: string;
  ticker: string;
  initialSupply: number;
  maxSupply: number;
  deployedAt: number;
}

export interface ListingInfo {
  listingId: number;
  seller: string;
  tokenAddress: string;
  quantity: number;
  pricePerUnit: bigint;
  status: ListingStatus;
  createdAt: number;
}

export enum ListingStatus {
  Active = 0,
  Sold = 1,
  Cancelled = 2,
}

export enum OrderStatus {
  Created = 0,
  Paid = 1,
  Shipped = 2,
  Delivered = 3,
  Disputed = 4,
  Refunded = 5,
  Completed = 6,
}

export interface OrderInfo {
  orderId: number;
  listingId: number;
  buyer: string;
  seller: string;
  tokenAddress: string;
  quantity: number;
  totalPrice: bigint;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  shippingInfo: string;
}

// ===== Firebase Types =====

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  address: string; // wallet address
  photoURL: string;
  createdAt: Date;
}

export interface Product {
  uid: string;
  tName: string;
  ticker: string;
  merchant: string;
  sellerHold: number;
  buyerHold: number;
  redeemed: number;
  contractAddress: string;
  photoURL: string;
  description: string;
  category: string;
  createdAt: Date;
}

export interface ConsumerToken {
  uid: string;
  productID: string;
  userID: string;
  quantity: number;
  merchantID: string;
}

export interface TrackOrder {
  uid: string;
  productID: string;
  merchantID: string;
  consumerID: string;
  quantity: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "disputed";
  shippingInfo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  imageURL?: string;
  createdAt: Date;
}

// ===== App State Types =====

export type UserMode = "seller" | "buyer";

export interface AppState {
  mode: UserMode;
  walletConnected: boolean;
  currentAccount: string | null;
  chainId: number | null;
}

// ===== Analytics Types =====

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: bigint;
  activeListings: number;
  completedOrders: number;
  disputeRate: number;
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  totalSold: number;
  totalRevenue: bigint;
  avgOrderSize: number;
  returnRate: number;
}
