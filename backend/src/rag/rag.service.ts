import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { QueryResponse, RagQuery } from './interfaces/rag.interface';
import { Feedback } from './interfaces/feedback.interface';
import { v4 as uuidv4 } from 'uuid';

interface ChunkMetadata {
  documentId: string;
  filename: string;
  chunkIndex: number;
  distance?: number;
}

interface ContextChunk {
  content: string;
  metadata: ChunkMetadata;
}

interface QueryRecord {
  id: string;
  userId: string;
  query: string;
  response: string;
  context: string[];
  createdAt: Date;
  feedback?: Feedback;
}

@Injectable()
export class RagService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(RagService.name);
  private queryRecords: QueryRecord[] = []; // In production, use a database

  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(queryData: RagQuery): Promise<QueryResponse> {
    try {
      // 1. Retrieve relevant context from knowledge base
      const contextChunks = await this.knowledgeBaseService.queryDocuments(
        queryData.query,
        queryData.maxContextChunks || 3,
      );

      // 2. Prepare context for the LLM
      const contextText = contextChunks.map(chunk => chunk.content).join('\n\n');

      // 3. Generate LLM prompt
      const prompt = `
        Context information is below.
        ---------------------
        ${contextText}
        ---------------------
        Given the context information and no prior knowledge, answer the following question:
        ${queryData.query}
        
        If the answer cannot be found in the context, say "I cannot find relevant information to answer this question."
      `;

      // 4. Get response from LLM
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that answers questions based on the provided context.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // 5. Format and return response
      return {
        answer: completion.choices[0].message?.content || 'No response generated',
        context: contextChunks.map((chunk: ContextChunk) => ({
          content: chunk.content,
          source: chunk.metadata.filename,
          relevanceScore: Number(chunk.metadata.distance ?? 0),
        })),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error generating RAG response: ${error.message}`);
      } else {
        this.logger.error('Unknown error generating RAG response');
      }
      throw error;
    }
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async saveQueryRecord(userId: string, query: string, response: QueryResponse): Promise<string> {
    const queryRecord: QueryRecord = {
      id: uuidv4(),
      query,
      response: response.answer,
      context: response.context.map(c => c.content),
      userId,
      createdAt: new Date(),
    };

    this.queryRecords.push(queryRecord);
    return queryRecord.id;
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async addFeedback(
    userId: string,
    queryId: string,
    isHelpful: boolean,
    comment?: string,
  ): Promise<Feedback> {
    const feedback: Feedback = {
      id: uuidv4(),
      queryId,
      userId,
      isHelpful,
      comment,
      createdAt: new Date(),
    };

    const queryRecord = this.queryRecords.find(r => r.id === queryId);
    if (!queryRecord) {
      throw new NotFoundException('Query record not found');
    }

    queryRecord.feedback = feedback;
    return feedback;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getQueryHistory(userId: string): Promise<QueryRecord[]> {
    return this.queryRecords
      .filter(record => record.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
