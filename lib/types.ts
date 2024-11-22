export type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export type ChatState = {
    messages: Message[]
    isLoading: boolean
}



export interface DeepgramResponse {
    type: string;
    channel_index: number[];
    duration: number;
    start: number;
    is_final: boolean;
    speech_final: boolean;
    channel: {
        alternatives: Array<{
            transcript: string;
            confidence: number;
            words: Array<{
                word: string;
                start: number;
                end: number;
            }>;
        }>;
    };
}

// {
// "type": "Results",
//     "channel_index": [
//         0,
//         1
//     ],
//         "duration": 0.63,
//             "start": 0,
//                 "is_final": true,
//                     "speech_final": true,
//                         "channel": {
//     "alternatives": [
//         {
//             "transcript": "",
//             "confidence": 0,
//             "words": []
//         }
//     ]
// },
// "metadata": {
//     "request_id": "0b5f981e-c31d-43a7-b290-09ddb5edabf5",
//         "model_info": {
//         "name": "2-general-nova",
//             "version": "2024-01-11.36317",
//                 "arch": "nova-2"
//     },
//     "model_uuid": "1dbdfb4d-85b2-4659-9831-16b3c76229aa"
// },
// "from_finalize": false
// }