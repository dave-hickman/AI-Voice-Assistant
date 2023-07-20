import axios from "axios"

const api = axios.create({
    baseURL: "https://ai-voice-assistant-server.onrender.com"
})

const sendRequest = async (query) => {
    console.log('in the util now')
    try{
    const data = await api.post('/api/content/', query)
    console.log(data)
    return data.data.response
    } catch(error){
        console.log(error);
        return error
    }
}

const sendText = async (query) => {
    try {
        const data = await api.post('/api/speech/', query)
        return data
    }
    catch(error){
        console.log(error);
        return error
    }
}

export {sendRequest, sendText}