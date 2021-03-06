


// const authReducer = (state = {authData: null}, action) => {
//     switch(action.type){
//         case 'AUTH':
//             console.log(action?.data);
//             // setting all the user data to local storage so they will stay logged in 
//             localStorage.setItem('profile', JSON.stringify({...action?.data}))
//             return {...state, 
//                     authData: action?.data
//                     };
        
//             default:
//                 return state;
//     }
// }

// export default authReducer