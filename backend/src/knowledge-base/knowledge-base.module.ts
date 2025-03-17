import { Module } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { StorageEngine } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      storage: diskStorage({
        destination: './uploads',
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ): void => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }) as StorageEngine,
    }),
  ],
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],
  exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
