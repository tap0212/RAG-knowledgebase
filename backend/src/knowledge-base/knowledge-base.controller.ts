import {
  Controller,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { KnowledgeBaseService } from './knowledge-base.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { Document, DocumentChunk } from './types/document.types';

// Define the user interface
interface RequestUser {
  id: string;
  email: string;
}

// Define the authenticated request interface
interface AuthenticatedRequest extends ExpressRequest {
  user: RequestUser;
}

@UseGuards(JwtAuthGuard)
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @Get('documents')
  async getAllDocuments(@Request() req: AuthenticatedRequest): Promise<Document[]> {
    return this.knowledgeBaseService.getAllDocuments(req.user.id);
  }

  @Get('documents/:id')
  async getDocument(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<Document> {
    return this.knowledgeBaseService.getDocumentById(id, req.user.id);
  }

  @Delete('documents/:id')
  async deleteDocument(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.knowledgeBaseService.deleteDocument(id, req.user.id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.knowledgeBaseService.processDocument(file, req.user.id);
  }

  @Get('query')
  async queryDocuments(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Query parameter is required');
    }

    return this.knowledgeBaseService.queryDocuments(query);
  }
}
