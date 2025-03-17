declare module 'chromadb' {
  export class ChromaClient {
    constructor(params: { path: string });

    createCollection(params: {
      name: string;
      metadata?: Record<string, any>;
      embeddingFunction?: OpenAIEmbeddingFunction;
    }): Promise<Collection>;

    getCollection(params: {
      name: string;
      embeddingFunction?: OpenAIEmbeddingFunction;
    }): Promise<Collection>;
  }

  export interface Collection {
    add(params: {
      ids: string[];
      embeddings?: number[][];
      metadatas?: Record<string, any>[];
      documents?: string[];
    }): Promise<void>;

    query(params: { queryTexts: string[]; nResults?: number }): Promise<{
      ids: string[][];
      distances: number[][];
      metadatas: Record<string, any>[][];
      documents: string[][];
    }>;

    delete(params: { ids: string[] }): Promise<void>;
  }

  export class OpenAIEmbeddingFunction {
    constructor(params: { openai_api_key: string });
  }

  const ChromaClient: typeof ChromaClient;
  export default ChromaClient;
}
