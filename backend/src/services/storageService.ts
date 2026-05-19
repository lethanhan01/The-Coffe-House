import { supabase } from '../utils/storage';
import multer from 'multer';

export const uploadCafeImage = async (file: Express.Multer.File) => {
    const fileExt = file.originalname.split('.').pop();

    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

    const filePath = `cafes/${fileName}`;

    const { error } = await supabase.storage
        .from('cafeImages')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) {
        throw new Error(error.message);
    }

    const {
        data: { publicUrl },
    } = supabase.storage
        .from('cafeImages')
        .getPublicUrl(filePath);

    return publicUrl;
};