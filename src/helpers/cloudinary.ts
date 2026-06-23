import {
    v2 as cloudinary,
    UploadApiResponse,
    UploadApiErrorResponse,
} from "cloudinary";

import {
    CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} from "../config/envs.config";

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to a specific Cloudinary folder ('store0system' by default).
 * @param fileBuffer Buffer of the image in memory
 * @param folderName Name of the folder in Cloudinary
 * @returns Promise with the secure URL (HTTPS) of the image
 */

export const uploadImageToCloudinary = (
    fileBuffer: Buffer,
    folderName: string = "store-system"
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderName,
            },
            (
                error: UploadApiErrorResponse | undefined,
                result: UploadApiResponse | undefined
            ) => {
                if (error) return reject(error);
                if (result) return resolve(result.secure_url);
                reject(new Error("Unknown error uploading to Cloudinary"));
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export const deleteImageFromCloudinary = (publicId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return reject(error);
            resolve();
        });
    });
};

export const extractCloudinaryPublicId = (url: string): string => {
    const [, afterUpload] = url.split("/upload/");
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+s/, "");
};
