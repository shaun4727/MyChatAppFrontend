import axios from '@/plugins/axios-http';

export const addConversation = async (data)=>{
    const url = `/inbox/conversation`;
    return axios.post(url,data);
}

export const getConversations = async () => {
    const url = `/inbox/conversation`;
    return axios.get(url);
}

export const getMessages = async (id) => {
    const param = {params: {id:id}};
    const url = `/inbox/messages`;
    return axios.get(url,param);
}

export const deliverMessages = async (data) => {
    const url = `/inbox/messages`;
    return axios.post(url,data);
}