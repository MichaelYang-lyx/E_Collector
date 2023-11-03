import Home from "./pages/Home";
import Login from "./pages/Login";
import Login2 from "./pages/Login2";
import Register from "./pages/Register";
import Register2 from "./pages/Register2";
import WalletPage from "./pages/WalletPage";
import PublishVoucher from "./pages/PublishVoucher";
import MerchantTrack from "./pages/MerchantTrack";
import ConsumerTrack from "./pages/ConsumerTrack";



import React from 'react';
import MyTokens from "./pages/MyTokens";
import MyTokens2 from "./pages/MyTokens2";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext , useState} from "react";
import { AuthContext } from "./context/AuthContext";
import FriendsPage from "./pages/FriendsPage";



function App() {
  const { currentUser } = useContext(AuthContext);


  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      //return <Navigate to="/login" />;
      return <Navigate to="/login2" />; 
    }

    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
        
                <Home/>
              </ProtectedRoute>
            }
          />
          <Route path="friendsPage" element={<FriendsPage/>} />
          <Route path="login" element={<Login />} />
          <Route path="login2" element={<Login2/>} />
          <Route path="register" element={<Register />} />
          <Route path="register2" element={<Register2/>} />
          <Route path="walletpage" element={<WalletPage />} />
          <Route path="publishvoucher" element={<PublishVoucher />} />
          <Route path='mytokens' element={<MyTokens/>} />
          <Route path='mytokens2' element={<MyTokens2/>} />
          <Route path='merchanttrack' element={<MerchantTrack/>} />
          <Route path='consumertrack' element={<ConsumerTrack/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;