import axios from "axios";

const api = axios.create({
    baseURL: "https://stimular-back-end-xz5v.vercel.app/",
});

export default api