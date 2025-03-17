import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagQuery } from './interfaces/rag.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Define the Request type with user property
interface RequestWithUser extends Request {
  user: {
    id: string;
    // Add other user properties if needed
  };
}

@Controller('rag')
@UseGuards(JwtAuthGuard)
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('query')
  async query(@Body() queryDto: RagQuery, @Request() req: RequestWithUser) {
    const response = await this.ragService.generateResponse(queryDto);
    const queryId = await this.ragService.saveQueryRecord(req.user.id, queryDto.query, response);
    return { ...response, id: queryId };
  }

  @Post('feedback')
  @UseGuards(JwtAuthGuard)
  async addFeedback(
    @Request() req: RequestWithUser,
    @Body() feedback: { queryId: string; isHelpful: boolean; comment?: string },
  ) {
    return this.ragService.addFeedback(
      req.user.id,
      feedback.queryId,
      feedback.isHelpful,
      feedback.comment,
    );
  }
}
