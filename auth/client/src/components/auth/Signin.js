import React, {useState} from "react";
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {signIn} from '../../actions/index';
import {useHistory} from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';


const Signin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();


  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(signIn({
      email: email,
      password: password
    }, ()=>{
      console.log('pushing to another page');
      history.push('/feature');
    }))

  }


  const googleSuccess = async(res) => {
    console.log("Success")
    console.log(res)
    const result = res?.profileObj;
    const token = res?.tokenId;

    try{
      dispatch({type: 'AUTH', data: {result, token}});

      history.push('/welcome')
    }
    catch(error){
      console.log(error)
    }

  };
  const googleFailure = () => {
    console.log("Google Sign In Failed.")
  };


  return( 
  <div className="mt-5">
  
    <div className="grid align__item">

      <div className="register">

        <img height="100px" src="https://avatars.githubusercontent.com/u/67744643?s=200&v=4" alt=""/>
       

        <h2>Sign In</h2>

        <form onSubmit={handleSubmit}  className="form">

            <div className="form__field">
              <input type="email" placeholder="info@mailaddress.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
               />
            </div>

            <div className="form__field">
              <input type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
               placeholder="••••••••••••" />
            </div>

            <div className="form__field">
              <input type="submit" value="Log In" />
              <GoogleLogin 
                clientId="520348155728-foajgik217bkc7shqnv44uroje57lpjn.apps.googleusercontent.com"
                render={(renderProps)=> (
                  <button className="btn-warning btn" onClick={renderProps.onClick} disabled={renderProps.disabled} varient="contained">Sign in with Google</button>
                )}
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy="single_host_origin"
              />
            </div>
      

        </form>

        <p>Don't have an account? <Link to="/signup">Register Here</Link></p>

      </div>

    </div>
  
  </div>);
};

export default Signin;





// import React, {useState} from "react";
// import { Link } from 'react-router-dom'
// import {useDispatch} from 'react-redux'
// import { signIn } from "../../actions";


// const Signin = () => {

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const dispatch = useDispatch();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     dispatch(signIn({
//       email: email, 
//       password: password
//     }))

//   }
  

//   return( 
//   <div className="mt-5">
  
//     <div className="grid align__item">

//       <div className="register">

//         <img height="100px" src="https://avatars.githubusercontent.com/u/67744643?s=200&v=4" alt=""/>
       

//         <h2>Sign In</h2>

//         <form onSubmit={handleSubmit} className="form">

//             <div className="form__field">
//               <input type="email" placeholder="info@mailaddress.com" 
//               value={email} onChange={(e)=>setEmail(e.target.value)} />
//             </div>

//             <div className="form__field">
//               <input type="password" placeholder="••••••••••••" 
//               value={password} onChange={(e)=>setPassword(e.target.value)} />
//             </div>

//             <div className="form__field">
//               <input type="submit" value="Log In" />
//             </div>

//         </form>

//         <p>Don't have an account? <Link to="/signup">Register Here</Link></p>

//       </div>

//     </div>
  
//   </div>);
// };

// export default Signin;
