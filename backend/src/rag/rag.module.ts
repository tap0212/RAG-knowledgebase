import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [KnowledgeBaseModule, ConfigModule.forRoot()],
  controllers: [RagController],
  providers: [RagService],
})
export class RagModule {}
