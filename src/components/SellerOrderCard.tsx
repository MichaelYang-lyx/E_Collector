import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

interface SellerOrder {
  id: string;
  productName: string;
  imgSrc: string;
  qty: number;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  status: number;
}
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { updatePassiveOperations } from "./queryDatabase/BasicQuery";


export default function SellerOrderCard({
  order,
  updateInfo,
  setUpdateInfo,
}: {
  order: SellerOrder;
  updateInfo: number;
  setUpdateInfo: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [shipped, setShipped] = React.useState(false);
  
  const datasetProcess = async () => {
    const query2 = await query(
      collection(db, "tracks"),
      where("uid", "==", order.id)
    );
    const querySnapshot2 = await getDocs(query2);
  
    const buyerID = Number(querySnapshot2.docs[0].data().consumerID);
    await updatePassiveOperations(buyerID);
    
  };

  useEffect(() => {
  
    if (order.status != 0) {
      setShipped(true);
    }
    
  }, [shipped]);

  const handleConfirm = async () => {
    // process consumer_tokens database
    try {
      const docRef2 = doc(db, "tracks", order.id);
      await datasetProcess()
      console.log(docRef2);
      await updateDoc(docRef2, {
        uid: order.id,
        status: 1,
      });
       setUpdateInfo(updateInfo+1);
      console.log("UpdateSucessfully");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
    setShipped(true);
  };

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
            label={shipped ? "Shipping" : "To ship"}
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
            handleConfirm();
          }}
          disabled={shipped}
        >
          Confirm
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
