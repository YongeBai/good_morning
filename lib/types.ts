export type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export type ChatState = {
    messages: Message[]
    isLoading: boolean
}