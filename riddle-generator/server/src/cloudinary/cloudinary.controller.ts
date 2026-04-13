import { Controller, Get, Delete, Query } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('sign')
  @ApiOperation({ summary: 'Get signature for Cloudinary upload' })
  getSignature() {
    return this.cloudinaryService.generateSignature();
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Delete image from Cloudinary' })
  async removeImage(@Query('publicId') publicId: string) {
    return await this.cloudinaryService.deleteImage(publicId);
  }
}
