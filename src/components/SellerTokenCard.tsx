import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface TokenQtysProps {
  sellerHold: number;
  buyerHold: number;
  redeemed: number;
}

interface SellerTokenCardProps {
  image: string;
  name: string;
  tokenQtys: TokenQtysProps;
  id: string;
  onClickIssue: () => void;
}

export function SellerTokenList({
  sellerTokens,
}: {
  sellerTokens: SellerTokenCardProps[];
}) {
  const [open, setOpen] = React.useState(false);
  const [productToIssue, setProductToIssue] =
    React.useState<null | SellerTokenCardProps>(null);

  const handleClickIssue = (productToIssue: SellerTokenCardProps) => {
    setOpen(true);
    setProductToIssue(productToIssue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 345 }}>
        {sellerTokens.map((token) => (
          <SellerTokenCard
            image={token.image}
            name={token.name}
            tokenQtys={token.tokenQtys}
            id={token.id}
            key={token.id}
            onClickIssue={() => handleClickIssue(token)}
          />
        ))}
      </Stack>
      <IssueDialog
        open={open}
        onClose={handleClose}
        productId={productToIssue?.id}
        productName={productToIssue?.name}
      />
    </>
  );
}

function IssueDialog({ open, onClose, productId, productName }) {
  const [quantity, setQuantity] = useState(1);

  const handleIssue = () => {
    onClose();
    console.log({ productId, quantity });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Issue {productName}</DialogTitle>
      <DialogContent>
        <div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleIssue}>Issue</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SellerTokenCard({
  image,
  name,
  tokenQtys,
  id,
  onClickIssue,
}: SellerTokenCardProps) {
  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <CardMedia sx={{ height: 140 }} image={image} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <TokenQtys {...tokenQtys} />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClickIssue}>
          Issue
        </Button>
        <Button size="small">Send</Button>
      </CardActions>
    </Card>
  );
}

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

function createData(name: string, value: number) {
  return { name, value };
}

function TokenQtys({ sellerHold, buyerHold, redeemed }: TokenQtysProps) {
  return (
    <TableContainer component={"div"}>
      <Table sx={{ width: "100%" }} aria-label="simple table" size="small">
        <TableBody>
          {[
            createData("Seller hold", sellerHold),
            createData("Buyer hold", buyerHold),
            createData("Redeemed", redeemed),
            createData(
              "Issued",
              Number(sellerHold) + Number(buyerHold) + Number(redeemed)
            ),
          ].map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
