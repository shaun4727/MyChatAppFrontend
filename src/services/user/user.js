import axios from '@/plugins/axios-http';


export const addUser = async (data) => {
    const url = `/users/`;
    return axios.post(url,data);
}

export const getUser = async () => {
    const url = `/users/`;
    return axios.get(url);
}

export const removeUser = async (id) => {
    const url = `/users/${id}`;
    return axios.delete(url);
}

