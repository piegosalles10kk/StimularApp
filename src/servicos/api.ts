import axios from "axios";

const link = 'http://167.88.33.130:3001'

const api = axios.create({
    baseURL: link,
});

export default api