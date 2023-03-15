import axios from '@/plugins/axios-http';

const baseURL = process.env.VUE_APP_API_BASE_URL;

export const addUser = async (data) => {
    const url = `${baseURL}/users/`;
    return axios.post(url,data);
}

export const getUser = async () => {
    const url = `${baseURL}/users/`;
    return axios.get(url);
}

export const removeUser = async (id) => {
    const url = `${baseURL}/users/${id}`;
    return axios.delete(url);
}

