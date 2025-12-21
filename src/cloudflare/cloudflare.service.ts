import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { lookup } from 'mime-types';
import path from 'path';

@Injectable()
export class CloudflareService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const secretAccessKey = this.configService.get<string>('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const accessKeyId = this.configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const endpoint = this.configService.get<string>('CLOUDFLARE_R2_ENDPOINT');

    this.bucketName = this.configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME') || '';

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
    });
  }

  /**
   * Upload a file to Cloudflare R2 bucket
   * @returns The URL of the uploaded file
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Generate a uuidv4 name for the new key
    const fileExt = path.extname(file.originalname);
    const newKeyName = `${crypto.randomUUID()}${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: newKeyName,
      Body: file.buffer,
      ContentType: lookup(fileExt) || 'application/octet-stream',
    });

    const response = await this.s3Client.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      return newKeyName;
    } else {
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Delete a file from Cloudflare R2 bucket
   * @param key - The object key (path) in the bucket
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (_) {
      return false;
    }
  }
}
