import axios from "@/plugins/axios-http";  

// const baseURL = process.env.VUE_APP_API_BASE_URL;
export const LOGIN = async (data) => {
    const url = `/`;
    return await axios.post(url,data);
}

export const LOGOUT = async () => {
    const url = `/`;
    return await axios.delete(url);
}