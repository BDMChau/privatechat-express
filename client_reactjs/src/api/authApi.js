import axiosClient from './axiosClient';
 

const authApi = {
    postDataLogin: (data) => {
        const url = '/auth/signin'
        return axiosClient.post(url, data)
    },

    postDataSignUp: (data) => {
        const url = '/auth/signup'
        return axiosClient.post(url, data)
    },

    signOut: (data) => {
        const url = '/auth/signout'
        return axiosClient.post(url, data)
    },

    resetPassword: (data) => {
        const url = '/auth/resetpass'
        return axiosClient.post(url, data)
    },

    sendEmail: (data) => {
        const url = '/auth/sendemail'
        return axiosClient.post(url, data)
    },

    checkUserId: (data) => {
        const url = '/auth/uservalid'
        return axiosClient.post(url, data)
    }
}

export default authApi;