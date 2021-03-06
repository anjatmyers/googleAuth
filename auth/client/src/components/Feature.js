import React, {useState, useEffect} from "react";
import {useHistory, useLocation} from 'react-router-dom'


const Feature = () => {

  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  useEffect((params) => {
    const token = user?.token

    setUser(JSON.parse(localStorage.getItem('profile')));
    // console.log(user)

  }, [location])



  return <div style={{height: "100vh"}} className="d-flex flex-column justify-content-center align-items-center">
  <h1 className="text-white">Feature Page</h1>
  <h2>Welcome {user?.result.name}</h2>
  <img src={user?.result.imageUrl}></img>
  <h3 className="text-warning">This is a protected page</h3>
  <h5 className="text-info">This page should only be seen if user is logged in</h5>
 </div>
};

export default Feature;
