
export const initialListOffline = JSON.parse(localStorage.getItem('listoffline'));


export const listUserOffline = (state = initialListOffline, action) => {
    if (action.type === "LIST_USER_OFFLINE") {
        return action.payload
    }

    return state;
}