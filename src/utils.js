import axios from "axios"

const api = axios.create({
    baseURL: ""
})

const sendRequest = async (query) => {
    const {data} = await api.post('/api/content/')
    return data
}

export default sendRequest