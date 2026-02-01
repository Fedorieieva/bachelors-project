import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { AIPrompt } from '../../prisma/client';

@Injectable()
export class PromptsService {
  constructor(private prisma: PrismaService) {}

  async getRenderedPrompt(name: string, variables: Record<string, any>): Promise<string> {
    const promptTemplate = (await this.prisma.aIPrompt.findUnique({
      where: { name },
    })) as AIPrompt | null;

    if (!promptTemplate) {
      throw new NotFoundException(`Промпт "${name}" не знайдено`);
    }

    let rendered = promptTemplate.template;

    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    return rendered;
  }
}
