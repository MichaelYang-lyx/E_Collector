import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from "react-router-dom";


const Home = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    
    <div className='navbar'>
      <div className="container">
      <p><Link to="/friendsPage">FriendsPage</Link></p>
      <p><Link to="/publishVoucher">PublishVoucher</Link></p>
      <p><Link to="/myTokens">MyTokens</Link></p>
      <p><Link to="/myTokens2">MyTokens2</Link></p>
      <p><Link to="/merchantTrack">MerchantTrack</Link></p>
      <p><Link to="/consumerTrack">ConsumerTrack</Link></p>
      </div>
    </div>
  )
}


export default Home