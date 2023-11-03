import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import React from "react";
export default function RedeemDialog({
  open,
  onClose,
  productId,
  productName,
}: {
  open: boolean;
  onClose: () => void;
  productId: string | undefined;
  productName: string | undefined;
}) {
  const [redeemInfo, setRedeemInfo] = useState({
    name: "Bob",
    phoneNumber: "+852 1234 5678",
    address: `Flat 25, 12/F, Acacia Building
150 Nathan Road
Tsim Sha Tsui, Kowloon`,
    quantity: 1,
  });

  const handleRedeem = () => {
    onClose();
    console.log({
      ...redeemInfo,
      productId,
    });
  };
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>
        Redeem {productName} {productId}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="outlined-required"
          label="Name"
          value={redeemInfo.name}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, name: e.target.value });
          }}
          fullWidth
        />
        <TextField
          margin="dense"
          id="outlined-required"
          label="Phone Number"
          value={redeemInfo.phoneNumber}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, phoneNumber: e.target.value });
          }}
          fullWidth
        />
        <TextField
          margin="dense"
          id="outlined-multiline-static"
          label="Address"
          multiline
          rows={3}
          value={redeemInfo.address}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, address: e.target.value });
          }}
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          id="standard-number"
          label="Quantity"
          value={redeemInfo.quantity}
          onChange={(e) => {
            setRedeemInfo({ ...redeemInfo, quantity: +e.target.value });
          }}
          type="number"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRedeem}>Redeem</Button>
      </DialogActions>
    </Dialog>
  );
}
