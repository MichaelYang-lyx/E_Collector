import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";
import TrackCard from "./TrackCard";
import { SellerTokenList } from "./SellerTokenCard";
import SellerOrderCard from "./SellerOrderCard";
import { styled } from "@mui/material/styles";
import ConnectBtn from "./ConnectBtn";
import TokenList from "./TokenList";
import { getSellerTokens } from "./queryDatabase/QuerySellerTokens";
import { getSellerOrders } from "./queryDatabase/QuerySellerOrders";
import { getBuyerTokens } from "./queryDatabase/QueryBuyerTokens";
import { getBuyerOrders } from "./queryDatabase/QueryBuyerOrders";
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import CreateTokenForm from "./interactWithBlockchain/CreateTokenForm";
import FriendsPage from "./FriendsPage";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

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
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);

  const [updateInfo, setUpdateInfo] = useState<number>(0);

  const queryAll = async () => {
    const sellerTokensArray = await getSellerTokens(userID);
    if (sellerTokensArray !== undefined) {
      setSellerTokens(sellerTokensArray);
    }

    const sellerOrdersArray = await getSellerOrders(userID);

    if (sellerOrdersArray !== undefined) {
      setSellerOrders(sellerOrdersArray);
    }

    const buyerTokensArray = await getBuyerTokens(userID);
    if (buyerTokensArray !== undefined) {
      setBuyerTokens(buyerTokensArray);
    }

    const buyerOrdersArray = await getBuyerOrders(userID);
    if (buyerOrdersArray !== undefined) {
      setBuyerOrders(buyerOrdersArray);
    }
  };

  useEffect(() => {
    queryAll();
    console.log("update");
  }, [updateInfo]);

  useEffect(() => {
    const getUpdate = () => {
      const unsub = onSnapshot(
        doc(db, "user_passive_operations", currentUser.uid),
        (doc) => {
          queryAll();
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getUpdate();
  }, [currentUser.uid]);

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
          <Tab label="chat" {...a11yProps(2)} />
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
                updateInfo={updateInfo}
                setUpdateInfo={setUpdateInfo}
              />
            ) : (
              <>
                <SellerTokenList
                  sellerTokens={sellerTokens}
                  updateInfo={updateInfo}
                  setUpdateInfo={setUpdateInfo}
                />
                <CreateTokenForm
                  updateInfo={updateInfo}
                  setUpdateInfo={setUpdateInfo}
                />
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
                    tokenContract={token.tokenContract}
                  />
                ))}
              </Stack>
            ) : (
              <Stack spacing={2} sx={{ width: "100%", maxWidth: 345 }}>
                {sellerOrders.map((order) => (
                  <SellerOrderCard
                    key={order.id}
                    order={order}
                    updateInfo={updateInfo}
                    setUpdateInfo={setUpdateInfo}
                  />
                ))}
              </Stack>
            )}
          </>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <FriendsPage />
      </CustomTabPanel>
    </Box>
  );
}
