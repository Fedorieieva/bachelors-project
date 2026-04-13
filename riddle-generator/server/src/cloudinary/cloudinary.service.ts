import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  generateSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET')!;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'avatars',
      },
      apiSecret,
    );

    return {
      signature,
      timestamp,
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME')!,
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY')!,
    };
  }

  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result !== 'ok') {
        throw new BadRequestException(`Cloudinary deletion failed: ${result.result}`);
      }

      return result;
    } catch (error) {
      throw new BadRequestException('Failed to delete image from Cloudinary');
    }
  }

  extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileNameWithExtension = parts.pop() || '';
    const publicIdWithoutExtension = fileNameWithExtension.split('.')[0];
    const folder = parts.slice(parts.indexOf('upload') + 2).join('/'); // Отримуємо шлях після 'upload/v12345/'

    return folder ? `${folder}/${publicIdWithoutExtension}` : publicIdWithoutExtension;
  }
}
