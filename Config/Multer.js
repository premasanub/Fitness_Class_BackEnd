import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./Cloudinary.js";

const storage = new CloudinaryStorage({

  cloudinary: cloudinary,

  params: {
    folder: "fitness-project/trainers",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },

});

const upload = multer({
  storage: storage,
});

export default upload;