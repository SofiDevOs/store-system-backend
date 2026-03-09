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
 * Sube una imagen a la carpeta específica de Cloudinary ('store0system' por defecto).
 * @param fileBuffer Buffer de la imagen en memoria
 * @param folderName Nombre de la carpeta en cloudinary
 * @returns Promesa con la URL segura (HTTPS) de la imagen
 */
export const uploadImageToCloudinary = (
    fileBuffer: Buffer,
    folderName: string = "store0system"
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
