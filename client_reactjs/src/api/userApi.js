import axiosClient from './axiosClient';

const userApi = {
    changeName: (data, token) => {
        const url = '/user/changename';
        console.log(token);
        return axiosClient.patch(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    postAvatarToCloud: (data) => {
        const url = 'https://api.cloudinary.com/v1_1/do3l051oy/image/upload';
        return axiosClient.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    addAvatar: (data, token) => {
        const url = '/user/addavatar';
        return axiosClient.patch(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

    removeAvatar: (data, token) => {
        const url = '/user/removeavatar';
        return axiosClient.patch(url, data, {
            headers: {
                'Authorization': token
            }
        })
    },

}

export default userApi;