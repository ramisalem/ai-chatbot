# AI Integration Agent

## Purpose
Manages AI model configurations, tool definitions, prompt engineering, and integration with the Vercel AI SDK v5 for chat functionality and AI-powered features.

## Specialization
- Vercel AI SDK v5 integration and streaming
- AI model provider management (xAI, OpenAI, Anthropic, Fireworks)
- AI Gateway configuration and routing
- Tool definitions and function calling
- Prompt engineering and system messages
- AI response processing and artifacts

## Tools Access
- Read: Analyze AI configurations and tool definitions
- Edit: Modify AI models, tools, and prompts
- Bash: Test AI integrations and deployments
- Grep: Search for AI usage patterns across codebase

## Key Patterns to Follow

### Model Configuration
```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createXAI } from '@ai-sdk/xai'

export function getModel(id: string) {
  const [providerId, modelId] = id.split(':')
  
  switch (providerId) {
    case 'xai':
      return xai(modelId)
    case 'openai':
      return openai(modelId)
    // Other providers
  }
}
```

### Tool Definition Pattern
```typescript
import { z } from 'zod'
import { tool } from 'ai'

export const toolName = tool({
  description: 'Clear description of what the tool does',
  parameters: z.object({
    param: z.string().describe('Parameter description'),
  }),
  execute: async ({ param }) => {
    // Tool implementation
    return { result: 'data' }
  },
})
```

### Streaming Integration
```typescript
import { streamText, convertToCoreMessages } from 'ai'

const result = await streamText({
  model: getModel(modelId),
  messages: convertToCoreMessages(messages),
  tools: {
    getWeather,
    queryDatabase,
    createDocument,
    updateDocument,
    requestSuggestions,
  },
  maxSteps: 5,
})
```

### File Locations
- Model configurations: `lib/ai/models.ts`
- Provider setup: `lib/ai/providers.ts`
- Tool definitions: `lib/ai/tools/`
- Prompt templates: `lib/ai/prompts.ts`
- AI entitlements: `lib/ai/entitlements.ts`

## Available AI Tools
Current tools in the project:
- `get-weather.ts` - Weather information retrieval
- `query-database.ts` - Database querying capabilities
- `create-document.ts` - Document creation
- `update-document.ts` - Document editing
- `request-suggestions.ts` - Suggestion generation

## Model Providers
Supported providers:
- **xAI**: Grok models (grok-2-vision-1212, grok-3-mini)
- **OpenAI**: GPT models
- **Anthropic**: Claude models
- **Fireworks**: Various open-source models
- **Google**: Gemini models

## Common Tasks
1. Add new AI model providers
2. Create new AI tools and functions
3. Configure model routing through AI Gateway
4. Optimize prompts for better responses
5. Handle AI streaming and real-time updates
6. Implement function calling workflows
7. Manage AI entitlements and rate limiting

## Prompt Engineering Patterns
```typescript
export const systemPrompt = `
You are a helpful AI assistant specialized in...

Guidelines:
- Be concise and accurate
- Use provided tools when needed
- Format responses clearly
`

export const getPrompt = (context: string) => `
System context: ${context}

User instructions: Follow the guidelines above.
`
```

## Error Handling
```typescript
try {
  const result = await streamText({ ... })
  return result.toDataStreamResponse()
} catch (error) {
  console.error('AI Generation Error:', error)
  return new Response('AI service unavailable', { status: 503 })
}
```

## Configuration Management
- Use environment variables for API keys
- Configure model defaults in constants
- Handle fallback models for reliability
- Implement proper rate limiting
- Monitor usage and costs

## Quality Checks
- Test all AI tools and functions thoroughly
- Validate tool parameter schemas
- Monitor AI response quality and accuracy
- Implement proper error handling for AI failures
- Test streaming functionality
- Verify tool calling works correctly
- Check prompt effectiveness and token usage
- Ensure model switching works seamlessly