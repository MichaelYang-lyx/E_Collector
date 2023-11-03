import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import TrackCard from "./TrackCard";
import SellerTokenCard from "./SellerTokenCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";
import SellerOrderCard from "./SellerOrderCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import ImageUploader from "./ImageUploader";
import ConnectBtn from "./ConnectBtn";
import TokenList from "./TokenList";
import { getSellerTokens } from "./queryDatabase/QuerySellerTokens";
import { getBuyerTokens } from "./queryDatabase/QueryBuyerTokens";
import { getBuyerOrders } from "./queryDatabase/QueryBuyerOrders";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

//----------

export default function Main({
  connected,
  onConnect,
  mode,
}: {
  connected: boolean;
  onConnect: (connected: boolean) => void;
  mode: "buyer" | "seller";
}) {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { currentUser }: any = useContext(AuthContext);
  const userID: string = currentUser.uid;

  const [sellerTokens, setSellerTokens] = useState<any[]>([]);
  const [buyerTokens, setBuyerTokens] = useState<any[]>([]);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);

  const queryAll = async () => {
    const sellerTokensArrary = await getSellerTokens(userID);
    if (sellerTokensArrary !== undefined) {
      setSellerTokens(sellerTokensArrary);
    }
    const buyerTokensArray=await getBuyerTokens(userID);
    if (buyerTokensArray!==undefined){
      setBuyerTokens(buyerTokensArray);
    }

    const buyerOrdersArray=await getBuyerOrders(userID);
    if ( buyerOrdersArray!==undefined){
      setBuyerOrders( buyerOrdersArray);
    }
    console.log(buyerOrdersArray)



  };

  

  useEffect(() => {
    queryAll();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab
            label={mode === "buyer" ? "Vouchers" : "Products"}
            {...a11yProps(0)}
          />
          <Tab label="Orders" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {!connected ? (
          <div>
            <Button variant="contained" onClick={() => onConnect(!connected)}>
              Connect
            </Button>
          </div>
        ) : (
          <>
            {mode === "buyer" ? (
              <TokenList
                tokens={buyerTokens}
              />
            ) : (
              <>
                {sellerTokens.map(({ image, name, tokenQtys, id }) => (
                  <SellerTokenCard
                    image={image}
                    name={name}
                    tokenQtys={tokenQtys}
                    key={id}
                  />
                ))}
                <Fab
                  color="primary"
                  aria-label="add"
                  sx={{ position: "fixed", bottom: 16, right: 16 }}
                  onClick={handleAdd}
                >
                  <AddIcon />
                </Fab>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>New Product</DialogTitle>
                  <DialogContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      width: "min(calc(100vw - 64px), 345px)",
                    }}
                  >
                    <TextField
                      margin="dense"
                      id="outlined-required"
                      label="Name"
                      defaultValue="Apple"
                      fullWidth
                    />
                    <TextField
                      autoFocus
                      id="standard-number"
                      label="Quantity"
                      defaultValue={1}
                      type="number"
                      fullWidth
                    />
                    <ImageUploader />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Create</Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {!connected ? (
          <div>
            <ConnectBtn btnVariant="contained" onConnect={onConnect} />
          </div>
        ) : (
          <>
            {mode === "buyer" ? (
              <Stack spacing={2} sx={{ width: "100%", maxWidth: 345 }}>
                {buyerOrders.map((token) => (
                  <TrackCard
                    key={token.id}
                    imageSrc={token.imageSrc}
                    name={token.name}
                    qty={token.qty}
                    status={token.status}
                  />
                ))}
              </Stack>
            ) : (
              <Stack spacing={2} sx={{ width: "100%", maxWidth: 345 }}>
                {[
                  {
                    imageSrc: "/images/toilet-papers.jpg",
                    name: "Toilet Paper",
                    qty: 10,
                    buyer: "Bob",
                    id: "Toilet Paper",
                  },
                  {
                    imageSrc: "/images/wine-bottles.jpg",
                    name: "Red Wine",
                    qty: 3,
                    buyer: "Amy",
                    id: "Red Wine",
                  },
                ].map((token) => (
                  <SellerOrderCard
                    key={token.id}
                    imageSrc={token.imageSrc}
                    name={token.name}
                    qty={token.qty}
                    buyer={token.buyer}
                  />
                ))}
              </Stack>
            )}
          </>
        )}
      </CustomTabPanel>
    </Box>
  );
}
