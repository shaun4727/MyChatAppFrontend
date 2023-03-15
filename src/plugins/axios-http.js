import axios from "axios";

const useRequest = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

useRequest.interceptors.request.use(
    function(config) {
      // Do something before request is sent
      config.withCredentials = true;
      return config;
    },
    function(error) {
      // Do something with request error
      return Promise.reject(error);
    }
);


export default useRequest;