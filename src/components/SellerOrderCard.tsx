import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface SellerOrder {
  id: string;
  productName: string;
  imgSrc: string;
  qty: number;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
}

export default function SellerOrderCard({ order }: { order: SellerOrder }) {
  const [shipped, setShipped] = React.useState(false);

  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <CardMedia
        sx={{ height: 140 }}
        image={order.imgSrc}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {order.productName}{" "}
          <Chip
            label={shipped ? "Shipped" : "To ship"}
            color={shipped ? "success" : "primary"}
            size="small"
          />
        </Typography>
        <OrderInfoTable order={order} />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            console.log(`order with id ${order.id} shipped`);
            setShipped(true);
          }}
          disabled={shipped}
        >
          Shipped
        </Button>
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
import Chip from "@mui/material/Chip";

function createData(name: string, value: number | string) {
  return { name, value };
}

function OrderInfoTable({ order }: { order: SellerOrder }) {
  const rows = [
    createData("Quantity", order.qty),
    createData("Name", order.buyerName),
    createData("Phone", order.buyerPhone),
    createData("Address", order.buyerAddress),
  ];

  return (
    <TableContainer component={"div"}>
      <Table sx={{ width: "100%" }} aria-label="simple table" size="small">
        <TableBody>
          {rows.map((row) => (
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
