import React from 'react'
import {useLogin} from "../required_context/LoginContext"
import AdminNav from './components/AdminNav';
function Home() {
 
  const {isLoggedIn,username} = useLogin()
  console.log(isLoggedIn)
  if (isLoggedIn === true){
      return(
        <div>
          <AdminNav/>
          <div className='container mx-auto'>
            welcome {username}

          </div>
        </div>)

  }
  else{
    return(<></>)
  }
}

export default Home