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

export default function SellerTokenCard({
  image,
  name,
  tokenQtys,
}: {
  image: string;
  name: string;
  tokenQtys: TokenQtysProps;
}) {
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
        <Button size="small">Issue</Button>
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
            createData("Issued", Number(sellerHold) + Number(buyerHold) + Number(redeemed)),
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
