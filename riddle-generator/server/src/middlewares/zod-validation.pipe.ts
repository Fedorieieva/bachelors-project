import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodObject, ZodRawShape, output } from 'zod';

@Injectable()
export class ZodValidationPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private readonly schema: ZodObject<T>) {}
  transform(value: unknown): output<ZodObject<T>> {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues,
        });
      }
      throw new BadRequestException('Invalid input');
    }
  }
}
