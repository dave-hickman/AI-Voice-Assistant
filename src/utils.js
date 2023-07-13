import {Configuration, OpenAIApi} from "openai"

const configuration = new Configuration({
    apiKey: import.meta.env.API_KEY
})

const openai = new OpenAIApi(configuration);

async function getAssistant(request){
    const response = await openai.createChatCompletion(request)
    console.log(response)
}

export default getAssistant