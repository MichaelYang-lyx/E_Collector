import React, { useContext,useState} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from "react-router-dom";
import Header from '../components/Header';
import Main from '../components/Main';


const Home = () => {
  const {currentUser}:any = useContext(AuthContext)

  const [connected, setConnected] = useState(true);
  const [mode, setMode] = useState<"buyer" | "seller">("seller");
  return (
    
    <div className='navbar'>
      <div className="container">

      <Header
        connected={connected}
        onConnect={setConnected}
        mode={mode}
        onChangeMode={setMode}
      />
      <Main connected={connected} onConnect={setConnected} mode={mode} />
      
      {/*<p><Link to="/friendsPage">FriendsPage</Link></p>
      <p><Link to="/publishVoucher">PublishVoucher</Link></p>
      <p><Link to="/myTokens">MyTokens</Link></p>
      <p><Link to="/myTokens2">MyTokens2</Link></p>
      <p><Link to="/merchantTrack">MerchantTrack</Link></p>
  <p><Link to="/consumerTrack">ConsumerTrack</Link></p>*/}
      </div>
    </div>
  )
}


export default Home