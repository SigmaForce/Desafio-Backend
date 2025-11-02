import { env } from "@/env";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET_NAME!;

interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToS3(
  fileBuffer: Buffer,
  originalFilename: string,
  folder: string = "movies"
): Promise<UploadResult> {
  const fileExtension = originalFilename.split(".").pop();
  const filename = `${crypto.randomBytes(16).toString("hex")}.${fileExtension}`;
  const key = `${folder}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: getContentType(fileExtension),
  });

  await s3Client.send(command);

  const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    url,
    key,
  };
}

function getContentType(extension: string | undefined): string {
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
  };

  return types[extension?.toLowerCase() || ""] || "application/octet-stream";
}

export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Erro ao deletar arquivo do S3:", error);
  }
}

export function extractKeyFromUrl(url: string): string {
  const urlParts = url.split(".amazonaws.com/");
  return urlParts[1] || "";
}

export async function uploadFileToS3(
  file: { filename: string; mimetype: string; buffer: Buffer },
  folder: string
) {
  const buffer = file.buffer;

  const fileExtension = file.filename.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExtension}`;

  const uploadParams = {
    Bucket: env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: file.mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  return {
    url: `https://${env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
    key: fileName,
  };
}
