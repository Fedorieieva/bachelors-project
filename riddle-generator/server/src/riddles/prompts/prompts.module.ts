import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
