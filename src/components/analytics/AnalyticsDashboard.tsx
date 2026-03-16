import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Grid, Typography, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
} from "@mui/material";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { useWallet } from "../../hooks";
import type { DashboardStats, ProductAnalytics } from "../../types";

interface AnalyticsDashboardProps {
  userId: string;
  mode: "seller" | "buyer";
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, mode }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [productStats, setProductStats] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userId, mode]);

  const loadAnalytics = async () => {
    setLoading(true);
    const db = getFirestore();

    try {
      if (mode === "seller") {
        // Products
        const productsSnap = await getDocs(
          query(collection(db, "products"), where("merchant", "==", userId))
        );
        const totalProducts = productsSnap.size;

        // Orders
        const ordersSnap = await getDocs(
          query(collection(db, "tracks"), where("merchantID", "==", userId))
        );
        const totalOrders = ordersSnap.size;
        const completedOrders = ordersSnap.docs.filter(d => d.data().status === "delivered").length;
        const disputedOrders = ordersSnap.docs.filter(d => d.data().status === "disputed").length;

        // Per-product analytics
        const productMap = new Map<string, ProductAnalytics>();
        productsSnap.docs.forEach(doc => {
          const data = doc.data();
          productMap.set(doc.id, {
            productId: doc.id,
            name: data.tName,
            totalSold: data.buyerHold || 0,
            totalRevenue: 0n,
            avgOrderSize: 0,
            returnRate: 0,
          });
        });

        ordersSnap.docs.forEach(doc => {
          const data = doc.data();
          const existing = productMap.get(data.productID);
          if (existing) {
            existing.avgOrderSize = existing.totalSold > 0
              ? (existing.avgOrderSize + data.quantity) / 2
              : data.quantity;
          }
        });

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue: 0n,
          activeListings: productsSnap.docs.filter(d => (d.data().sellerHold || 0) > 0).length,
          completedOrders,
          disputeRate: totalOrders > 0 ? disputedOrders / totalOrders : 0,
        });
        setProductStats(Array.from(productMap.values()));
      } else {
        // Buyer analytics
        const tokensSnap = await getDocs(
          query(collection(db, "consumer_tokens"), where("userID", "==", userId))
        );
        const ordersSnap = await getDocs(
          query(collection(db, "tracks"), where("consumerID", "==", userId))
        );

        setStats({
          totalProducts: tokensSnap.size,
          totalOrders: ordersSnap.size,
          totalRevenue: 0n,
          activeListings: tokensSnap.docs.filter(d => (d.data().quantity || 0) > 0).length,
          completedOrders: ordersSnap.docs.filter(d => d.data().status === "delivered").length,
          disputeRate: 0,
        });
      }
    } catch (err) {
      console.error("Analytics load failed:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) return null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {mode === "seller" ? "Seller Dashboard" : "My Stats"}
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9" }}>
            <CardContent>
              <Typography variant="body2" color="#94a3b8">Total Products</Typography>
              <Typography variant="h4">{stats.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9" }}>
            <CardContent>
              <Typography variant="body2" color="#94a3b8">Total Orders</Typography>
              <Typography variant="h4">{stats.totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9" }}>
            <CardContent>
              <Typography variant="body2" color="#94a3b8">Completed</Typography>
              <Typography variant="h4" color="#10b981">{stats.completedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ bgcolor: "#1e293b", color: "#f1f5f9" }}>
            <CardContent>
              <Typography variant="body2" color="#94a3b8">Active Listings</Typography>
              <Typography variant="h4" color="#6366f1">{stats.activeListings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Table (Seller only) */}
      {mode === "seller" && productStats.length > 0 && (
        <TableContainer component={Paper} sx={{ bgcolor: "#1e293b" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#94a3b8" }}>Product</TableCell>
                <TableCell sx={{ color: "#94a3b8" }} align="right">Total Sold</TableCell>
                <TableCell sx={{ color: "#94a3b8" }} align="right">Avg Order</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productStats.map(p => (
                <TableRow key={p.productId}>
                  <TableCell sx={{ color: "#f1f5f9" }}>{p.name}</TableCell>
                  <TableCell sx={{ color: "#f1f5f9" }} align="right">{p.totalSold}</TableCell>
                  <TableCell sx={{ color: "#f1f5f9" }} align="right">{p.avgOrderSize.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dispute Rate */}
      {mode === "seller" && stats.disputeRate > 0 && (
        <Box mt={2}>
          <Chip
            label={`Dispute Rate: ${(stats.disputeRate * 100).toFixed(1)}%`}
            color={stats.disputeRate > 0.05 ? "error" : "success"}
          />
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;
