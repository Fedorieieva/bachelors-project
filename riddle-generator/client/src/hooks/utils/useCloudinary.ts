import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
interface CloudinarySignature {
  api_key: string;
  timestamp: number;
  signature: string;
  cloud_name: string;
}

export const useCloudinary = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const { data: signData } = await apiClient.get<CloudinarySignature>('/upload/sign');

      if (!signData.cloud_name) {
        throw new Error('Cloud name is missing from signature data');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.api_key);
      formData.append('timestamp', signData.timestamp.toString());
      formData.append('signature', signData.signature);
      formData.append('folder', 'avatars');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloud_name}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};