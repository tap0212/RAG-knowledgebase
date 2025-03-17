export interface QueryResponse {
  answer: string;
  context: {
    content: string;
    source: string;
    relevanceScore: number;
  }[];
}

export interface RagQuery {
  query: string;
  maxContextChunks?: number;
}
