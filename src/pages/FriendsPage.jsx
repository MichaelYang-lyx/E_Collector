import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
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