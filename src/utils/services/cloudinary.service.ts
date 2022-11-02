import cloudinary from 'cloudinary';

export class CloudinaryService {
    private static instance: CloudinaryService;
    private readonly cloudinary;
    
    constructor() {
        this.cloudinary = cloudinary.v2;
    }

    public static getInstance(): CloudinaryService {
        if (!CloudinaryService.instance) {
            return new CloudinaryService();
        }

        return CloudinaryService.instance;
    }
    
    public async uploadImage(file: string, folderName?: string): Promise<string> {
        const uploadedImage = await this.cloudinary.uploader.upload(file, {
            folder: folderName,
        });

        return uploadedImage.secure_url || '';
    }
}