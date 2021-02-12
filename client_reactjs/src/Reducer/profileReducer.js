export const initialState = JSON.parse(localStorage.getItem('user'));


export const profile = (state = initialState, action) => {
    if (action.type === "USERLOGIN") {
        return action.payload
    }

    if (action.type === "LOGOUT") {
        return null;
    }

    if (action.type === "UPDATEAVATAR") {
        return {
            ...state,
            avatar: action.payload
        }
    }

    if (action.type === "UPDATENAME") {
        return {
            ...state,
            name: action.payload
        }
    }
    return state;
}