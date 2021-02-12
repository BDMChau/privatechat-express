import axios from 'axios';
import queryString from 'query-string';
import { endDomain } from '../config/Api';

const axiosClient = axios.create({
    baseURL: endDomain,
    headers: {
        'Content-type': 'application/json'
    },
    paramsSerializer: params => queryString.stringify(params)
});

axiosClient.interceptors.request.use(async (config) => {
    // handle token refresh
    return config
})

axiosClient.interceptors.response.use((res) => {
    if (res && res.data) {
        return res.data
    }

    return res;
}, (error) => {
    console.log(error);
})

export default axiosClient;