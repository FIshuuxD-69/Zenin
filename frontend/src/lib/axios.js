import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://backend-47oj.onrender.com/manga/'
})

export { axiosInstance }


