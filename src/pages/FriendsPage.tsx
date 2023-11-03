import React from 'react'
import Sidebar from '../components/chatComponents/Sidebar'
import Chat from '../components/chatComponents/Chat'
import GetBack from '../components/GetBack'


  
const FriendsPage = () => {

  return (
    <div>

    <div className='friendsPage'>
      <div className="container">

        <GetBack/>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
    </div>
  )
}

export default FriendsPage