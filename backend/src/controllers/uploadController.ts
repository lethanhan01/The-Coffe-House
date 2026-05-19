import { Request, Response } from 'express';
import { uploadCafeImage } from '../services/storageService';

export const uploadImageController = async (
    req: Request,
    res: Response
) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: 'No file uploaded',
            });
        }

        const imageUrl = await uploadCafeImage(file);

        return res.status(200).json({
            url: imageUrl,
        });

    } catch (err: any) {
        console.error(err);

        return res.status(500).json({
            message: err.message,
        });
    }
};