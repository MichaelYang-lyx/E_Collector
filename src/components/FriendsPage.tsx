import React from 'react'
import Sidebar from './chatComponents/Sidebar'
import Chat from './chatComponents/Chat'
import GetBack from './GetBack'


  
const FriendsPage = () => {

  return (
    <div>

    <div className='friendsPage'>
      <div className="container">


        <Sidebar/>
        <Chat/>
      </div>
    </div>
    </div>
  )
}

export default FriendsPage