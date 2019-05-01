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

const imageParser = multer({ storage }).array('image', 5);

export default async (req, res, next) => {
  await imageParser(req, res, (error) => {
    if (error) return res.json({ success: false, error: [error.message] });
    if (req.files) {
      req.body.images = req.files.map(image => image.url);
      return next();
    }
    return next();
  });
};
