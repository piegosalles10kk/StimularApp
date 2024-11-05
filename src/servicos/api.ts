import axios from "axios";

const link = 'https://stimularbackend.onrender.com'

const link2 = "https://44a1b681-2e23-4bda-8bc0-060ec7663d49-00-39cxbndjc6z0c.kirk.replit.dev"

const api = axios.create({
    baseURL: link,
});

export default api