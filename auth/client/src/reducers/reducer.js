
const initialState = {
    authenticated: ""
}

const reducerTemplate = (state = initialState, action) => {

    switch(action.type){

        case "AUTH_USER":
            return{
                ...state,
                authenticated: action.data //json web token 
            }

        case 'AUTH':
            console.log(action?.data);
            // setting all the user data to local storage so they will stay logged in 
            localStorage.setItem('profile', JSON.stringify({...action?.data}))
            return {...state, 
                    authenticated: action?.data
                    };

        // case 'LOGOUT':
        //     localStorage.clear();
        //     return {...state, 
        //         authenticated: null
        //         };

        default:
            return state;
    } 
}


export default reducerTemplate
