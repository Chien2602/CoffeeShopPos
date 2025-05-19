const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const uploadImage = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: err
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: 'Vui lòng chọn file ảnh'
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'coffeeshop-pos',
        use_filename: true
      });

      const fs = require('fs');
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        message: 'Upload ảnh thành công',
        data: {
          url: result.secure_url,
          public_id: result.public_id
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp public_id của ảnh'
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      message: 'Xóa ảnh thành công',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage
}; 