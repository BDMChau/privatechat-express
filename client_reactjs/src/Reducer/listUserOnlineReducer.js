
export const initialListOnline = JSON.parse(localStorage.getItem('listonline'));


export const listUserOnline = (state = initialListOnline, action) => {
    if (action.type === "LIST_USER_ONLINE") {
        return action.payload
    }

    return state;
}