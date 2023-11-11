import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'

const Navbar = () => {
  const {currentUser}:any = useContext(AuthContext)

  return (
    <div className='navbar'>
      
      <div className="user">
        <img src={currentUser.photoURL} alt="" width="25" height="25" />
        <span>{currentUser.displayName}</span>
      </div>
    </div>
  )
  /*
  <div className='navbar'>
      
      <span className="logo">E-collector</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>logout</button>
      </div>
    </div>*/
}

export default Navbar