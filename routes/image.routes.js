import { Router } from "express";
import { upload } from "../middlewares/multerConfig.js";
import { fileValidationMiddleware } from "../middlewares/fileValidationMiddleware.js";
import { addQuery } from "../middlewares/addQuery.js";
import {
  createImage,
  getAllImages,
  getImageById,
  deleteImage,
  updateImage,
  listAllImagesFromS3,
  downloadImage,
} from "../controllers/image.controller.js";

const router = Router();

router.post(
  "/upload",
  upload.single("logo"),
  fileValidationMiddleware,
  addQuery,
  createImage
);
router.get("/list", getAllImages);
router.get("/list/:id", getImageById);
router.put(
  "/image/:id",
  upload.single("logo"),
  fileValidationMiddleware,
  addQuery,
  updateImage
);
router.delete("/delete/:id", deleteImage);
router.get("/download/:id", downloadImage);

// Special
router.get("/AWS/S3/list", listAllImagesFromS3);

export default router;
