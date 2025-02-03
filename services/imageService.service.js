import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { s3, BUCKET_NAME, REGION } from "../config/s3Config.js";

class S3Service {
  constructor() {
    this.bucketName = BUCKET_NAME;
    this.region = REGION;
  }

  // Helper method to convert image URLs
  convertImageUrl(url, sourceFolder, targetFolder) {
    if (!url.includes(`/${sourceFolder}/`)) {
      return false;
    }
    let optimizedUrl = url.replace(`/${sourceFolder}/`, `/${targetFolder}/`);
    return optimizedUrl;
  }

  // Upload image to S3 (Raw-images folder)
  async uploadToS3(file) {
    try {
      const fileName = `Raw-images/${file.originalname}`;
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const imageUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
      const optimizedUrl = this.convertImageUrl(
        imageUrl,
        "Raw-images",
        "Optimize-images"
      );

      return optimizedUrl;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      return false;
    }
  }

  // Get image from S3 (Optimize-images folder)
  async getImageFromS3(fileName) {
    try {
      const getParams = {
        Bucket: this.bucketName,
        Key: `Optimize-images/${fileName}`,
      };

      const command = new GetObjectCommand(getParams);
      const { Body } = await s3.send(command);
      return Body;
    } catch (error) {
      console.error("Error getting image:", error);
      return null;
    }
  }

  // List all images in the Optimize-images folder (skipping index 0)
  async listImagesFromS3() {
    try {
      const listParams = {
        Bucket: this.bucketName,
        Prefix: "Optimize-images/",
      };

      const { Contents } = await s3.send(new ListObjectsV2Command(listParams));

      if (!Contents || Contents.length <= 1) {
        return [];
      }

      // Skip index 0
      return Contents.slice(1).map(
        (file) =>
          `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${file.Key}`
      );
    } catch (error) {
      console.error("Error listing images:", error);
      return [];
    }
  }

  // Delete image from S3 (Optimize-images folder)
  async deleteImageFromS3(fileName) {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: `Optimize-images/${fileName}`,
      };

      await s3.send(new DeleteObjectCommand(deleteParams));
      console.log(`Deleted file: Optimize-images/${fileName}`);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  // Download image from S3 (Optimize-images folder)
  async downloadImageFromS3(fileName) {
    try {
      const getParams = {
        Bucket: this.bucketName,
        Key: `Optimize-images/${fileName}`,
      };

      const command = new GetObjectCommand(getParams);
      const { Body } = await s3.send(command);

      return Body;
    } catch (error) {
      console.error("Error downloading file:", error);
      return null;
    }
  }
}

export default new S3Service();
