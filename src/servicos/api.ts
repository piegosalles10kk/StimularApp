import axios from "axios";

const link = 'https://stimularweb.shop'
const local = 'http://localhost:3001'

const api = axios.create({
    baseURL: link,
});

export default api