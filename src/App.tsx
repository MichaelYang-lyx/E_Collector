import Home from "./pages/Home";

import Login2 from "./pages/Login2";

import Register2 from "./pages/Register2";




import React from 'react';

import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext , useState} from "react";
import { AuthContext } from "./context/AuthContext";




function App() {
  const { currentUser }:any = useContext(AuthContext);


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
         
          <Route path="login2" element={<Login2/>} />
      
          <Route path="register2" element={<Register2/>} />
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;