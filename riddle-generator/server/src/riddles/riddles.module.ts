import { Module } from '@nestjs/common';
import { RiddlesController } from './riddles.controller';
import { RiddlesService } from './riddles.service';
import { AiModule } from './ai/ai.module';
import { PromptsModule } from './prompts/prompts.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AiModule, PromptsModule, PrismaModule],
  controllers: [RiddlesController],
  providers: [RiddlesService],
  exports: [RiddlesService],
})
export class RiddlesModule {}
