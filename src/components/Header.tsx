import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { AccountCircle, Logout } from "@mui/icons-material";
import { ButtonGroup, Chip, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import ConnectBtn from "./ConnectBtn";
import Navbar from "./chatComponents/Navbar";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header({
  connected,
  onConnect,
  mode,
  onChangeMode,
}: {
  connected: boolean;
  onConnect: (connected: boolean) => void;
  mode: "buyer" | "seller";
  onChangeMode: (mode: "buyer" | "seller") => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theOtherMode = mode === "buyer" ? "seller" : "buyer";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              height: "2.5em",
              width: "2.5em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <img src="/images/Logo.png" alt="Logo" width="100%" />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            E-Collector
            {mode === "seller" && " · Seller"}
          </Typography>
          <button onClick={() => signOut(auth)}>logout</button>
          <Navbar />
          {connected ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onConnect(false);
                  }}
                >
                  Disconnect
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onChangeMode(theOtherMode);
                  }}
                >
                  To {theOtherMode}
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <ConnectBtn color="inherit" onConnect={onConnect} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
