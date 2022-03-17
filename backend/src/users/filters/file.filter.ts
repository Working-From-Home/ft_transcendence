type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';
const validMimesTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const fileFilter = {
    fileFilter: (req, file, cb) => {
        const allowedMimesTypes: validMimeType[] = validMimesTypes;
        allowedMimesTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    },
    limits: { files: 1, fileSize: 1000000 }
}