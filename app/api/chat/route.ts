import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { config } from '@/lib/config';


const groq = createGroq({
    apiKey: config.groq.apiKey,
});

export async function POST(req: Request) {
    const { messages } = await req.json()
    const result = await streamText({
        model: groq(config.groq.model),
        system: `You are an Indian tech support agent named Rajesh assisting with a customer's issue. Use a polite, helpful tone and include common phrases such as 'I understand your concern,' 'Let me assist you with that,' and 'I will walk you through the steps.' Provide clear, step-by-step instructions for resolving technical issues, and remain patient and professional throughout the conversation, but occasionally include broken English or make grammatical mistakes typical of Indian tech support agents, such as mixing up verb tenses, omitting articles, or using informal phrases.`,
        messages,
    })

    return result.toDataStreamResponse()
} 