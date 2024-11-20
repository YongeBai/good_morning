import { z } from 'zod'

const configSchema = z.object({
  groq: z.object({
    apiKey: z.string().min(1),
    model: z.string().default('llama-3.1-8b-instant'),
  }),
  deepgram: z.object({
    apiKey: z.string().min(1),
    model: z.string().default('nova-2'),
  }),
  elevenlabs: z.object({
    apiKey: z.string().min(1),
    voiceId: z.string().default('i43IkvDdcl0HXXIl6t0P'),
  }),
})

const getConfig = () => {
  const config = {
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL,
    },
    deepgram: {
      apiKey: process.env.DEEPGRAM_API_KEY,
      model: process.env.DEEPGRAM_MODEL,
    },
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY,
      voiceId: process.env.ELEVENLABS_VOICE_ID,
    },
  }

  const result = configSchema.safeParse(config)

  if (!result.success) {
    throw new Error(
      `Missing environment variables: ${result.error.errors.map((e) => e.path.join('.')).join(', ')}`
    )
  }

  return result.data
}

export const config = getConfig() 