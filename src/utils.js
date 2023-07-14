import axios from "axios"

const api = axios.create({
    baseURL: "https://ai-voice-assistant-server.onrender.com"
})

const sendRequest = async (query) => {
    const {data} = await api.post('/api/content/', query)
    return data
}

export default sendRequest