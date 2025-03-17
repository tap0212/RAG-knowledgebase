import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { RagModule } from './rag/rag.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), KnowledgeBaseModule, AuthModule, RagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
