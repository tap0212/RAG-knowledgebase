declare module 'openai' {
  export default class OpenAI {
    constructor(config: { apiKey: string });

    chat: {
      completions: {
        create(params: {
          model: string;
          messages: Array<{
            role: 'system' | 'user' | 'assistant';
            content: string;
          }>;
          temperature?: number;
          max_tokens?: number;
        }): Promise<{
          choices: Array<{
            message?: {
              content: string;
            };
            finish_reason: string;
          }>;
          usage: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
          };
        }>;
      };
    };

    embeddings: {
      create(params: { model: string; input: string | string[] }): Promise<{
        data: Array<{
          embedding: number[];
          index: number;
        }>;
        usage: {
          prompt_tokens: number;
          total_tokens: number;
        };
      }>;
    };
  }
}
