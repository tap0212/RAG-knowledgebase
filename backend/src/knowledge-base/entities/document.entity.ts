export class Document {
  id: string;
  filename: string;
  contentType: string;
  content: string;
  chunks: DocumentChunk[];
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}
