import axiosClient from './axiosClient';
 
const msgApi = {
    fetchMessage: (data, token) => {
        const url = '/user/message'
        return axiosClient.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    fetchMoreMessage: (data, token) => {
        const url = '/user/message'
        return axiosClient.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    fetchListOnline: (data, token) => {
        const url = '/user/messagelistonline'
        return axiosClient.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    fetchListOffline: (data, token) => {
        const url = '/user/messagelistoffline';
        return axiosClient.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    fetchLatestMessage: (data, token) => {
        const url = '/user/latestmessage';
        return axiosClient.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    postImageToCloud: (data) => {
        const url = 'https://api.cloudinary.com/v1_1/do3l051oy/image/upload';
        
        return axiosClient.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    updateConservationId: (data, token) => {
        const url = '/user/updateUserSendAndRecieve';

        return axiosClient.post(url, data, {
            headers: {
                'Authorization': token
            }
        })
    }
}

export default msgApi;