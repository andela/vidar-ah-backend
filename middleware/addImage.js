import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'demo',
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
});

const imageParser = multer({ storage }).array('articleImages', 5);

export default async (req, res, next) => {
  await imageParser(req, res, (error) => {
    if (error) return res.json({ success: false, error });
    if (req.files) {
      req.images = req.files.map(image => image.url);
      return next();
    }
    return next();
  });
};
