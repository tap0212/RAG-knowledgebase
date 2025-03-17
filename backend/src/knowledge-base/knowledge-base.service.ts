/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChromaClient, Collection } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import { Document, DocumentChunk } from './types/document.types';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);
  private readonly chroma: ChromaClient;
  private collection: Collection | null = null;
  private documents: Document[] = []; // In production, use a database
  private readonly embeddingFunction: OpenAIEmbeddingFunction;
  private initializationPromise: Promise<void>;

  constructor() {
    // Get the ChromaDB URL from environment variable or use default
    const chromaUrl = process.env.CHROMA_URL || 'http://localhost:8000';
    
    this.logger.log(`Initializing ChromaDB with URL: ${chromaUrl}`);
    
    try {
      this.chroma = new ChromaClient({
        path: chromaUrl,
      });

      this.embeddingFunction = new OpenAIEmbeddingFunction({
        openai_api_key: process.env.OPENAI_API_KEY,
      });

      // Store the initialization promise
      this.initializationPromise = this.initializeCollection().catch(error => {
        this.logger.error('Failed to initialize collection:', error);
        throw error;
      });
    } catch (error) {
      this.logger.error('Error in constructor:', error);
      throw error;
    }
  }

  private async initializeCollection() {
    try {
      const collectionName = 'documents';
      
      this.logger.log('Waiting for ChromaDB to be ready...');
      // Wait for ChromaDB to be ready
      await new Promise(resolve => setTimeout(resolve, 5000));

      // this.logger.log('Checking ChromaDB connection...');
      // Test ChromaDB connection
      // await this.chroma.heartbeat(); // Removed this line
      this.logger.log('ChromaDB is responsive');

      this.logger.log('Attempting to get or create collection...');
      // Try to get existing collection
      try {
        this.collection = await this.chroma.getCollection({
          name: collectionName,
          embeddingFunction: this.embeddingFunction,
        });
        this.logger.log('Retrieved existing collection');
      } catch (error) {
        this.logger.log('Collection not found, creating new one...');
        // Create new collection if it doesn't exist
        this.collection = await this.chroma.createCollection({
          name: collectionName,
          embeddingFunction: this.embeddingFunction,
        });
        this.logger.log('Created new collection');
      }

      // Verify collection is properly initialized
      if (!this.collection) {
        throw new Error('Collection initialization failed');
      }

      this.logger.log('Collection initialization completed successfully');
    } catch (error) {
      this.logger.error('Error in initializeCollection:', error);
      throw error;
    }
  }

  async processDocument(file: Express.Multer.File, userId: string): Promise<Document> {
    try {
      this.logger.log('Waiting for collection initialization...');
      await this.initializationPromise;
      
      if (!this.collection) {
        throw new Error('Collection not initialized');
      }

      this.logger.log('Processing document...', file, file.buffer);
      const documentId = uuidv4();
      const content = fs.readFileSync(file.path, 'utf-8');

      this.logger.log('Adding document to ChromaDB...');
      await this.collection.add({
        ids: [documentId],
        documents: [content],
        metadatas: [{ userId, filename: file.originalname }],
      });

      const document: Document = {
        id: documentId,
        filename: file.originalname,
        contentType: file.mimetype,
        content,
        chunks: [],
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.documents.push(document);
      this.logger.log('Document processed successfully');
      return document;
    } catch (error) {
      this.logger.error('Error in processDocument:', error);
      throw error;
    }
  }

  private splitIntoChunks(content: string, maxChunkSize: number = 1000): string[] {
    // Simple splitting by sentences and combining into chunks
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxChunkSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    return chunks;
  }

  async queryDocuments(query: string, limit: number = 5): Promise<DocumentChunk[]> {
    const results = await this.collection.query({
      queryTexts: [query],
      nResults: limit,
    });

    return results.documents[0].map((content, index) => {
      const metadata = results.metadatas[0][index];
      return {
        id: results.ids[0][index] as unknown as string,
        documentId: metadata.documentId as string,
        content: content as unknown as string,
        embedding: [],
        metadata: {
          documentId: metadata.documentId as string,
          filename: metadata.filename as string,
          chunkIndex: metadata.chunkIndex as number,
        },
      } satisfies DocumentChunk;
    });
  }

  async getAllDocuments(userId: string): Promise<Document[]> {
    return Promise.resolve(
      this.documents
        .filter(doc => doc.userId === userId)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ content: _content, ...rest }) => ({
          ...rest,
          content: '', // Need to include content property but keep it empty
        })),
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getDocumentById(id: string, userId: string): Promise<Document> {
    const document = this.documents.find(doc => doc.id === id && doc.userId === userId);

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async deleteDocument(id: string, userId: string): Promise<void> {
    const documentIndex = this.documents.findIndex(doc => doc.id === id && doc.userId === userId);

    if (documentIndex === -1) {
      throw new NotFoundException('Document not found');
    }

    // Delete from ChromaDB using the document ID
    await this.collection.delete({
      ids: [id]  // Use the document ID directly since we store documents with their IDs
    });

    // Remove from documents array
    this.documents.splice(documentIndex, 1);
  }
}
