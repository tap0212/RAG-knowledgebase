export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: {
    documentId: string;
    filename: string;
    chunkIndex: number;
  };
}

export interface Document {
  id: string;
  filename: string;
  contentType: string;
  content: string;
  chunks: DocumentChunk[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
