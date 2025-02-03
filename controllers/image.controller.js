import S3Service from "../services/imageService.service.js";
import connectDB from "../config/mongoDbConfig.js";
import Image from "../models/image.model.js";
import mongoose from "mongoose";

connectDB();

const extractFilename = (url) => {
  // Use a regular expression to match the filename
  const regex = /[^/]+$/;
  const match = url.match(regex);
  return match ? match[0] : null;
};

const transformImageUrl = (url) => {
  const queryParams = url.split("?")[1];
  const extMatch = queryParams ? queryParams.match(/(?:^|&)ext=([^&]*)/) : null;
  const ext = extMatch ? extMatch[1] : null;
  const urlWithoutQuery = url.split("?")[0];
  const transformedUrl = urlWithoutQuery.replace(/\.[^/.]+$/, `.${ext}`);

  return transformedUrl;
};

export const createImage = async (req, res) => {
  try {
    let imageUrl = await S3Service.uploadToS3(req.file);
    if (!imageUrl) return res.status(500).json({ message: "Upload failed" });
    imageUrl = transformImageUrl(imageUrl);
    const newImage = await Image({ imageUrl: imageUrl });
    await newImage.save();
    return res
      .status(201)
      .json({ message: "Image Uploaded Successfully", newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find({});
    return res.json({
      message: "Images fetched successfully",
      total: images.length,
      images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getImageById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  try {
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    return res.json({ message: "Image fetched successfully", image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteImage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    const filename = extractFilename(image.imageUrl);
    const isDeleted = await S3Service.deleteImageFromS3(filename);

    if (!isDeleted) return res.status(500).json({ message: "Deletion failed" });

    await Image.findByIdAndDelete(id);
    return res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

  res.json({ message: "Image deleted successfully" });
};

export const updateImage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const findImage = await Image.findById(id);
    if (!findImage) {
      return res.status(404).json({ message: "Image not found" });
    }

    const filename = extractFilename(findImage.imageUrl);
    const isDeleted = await S3Service.deleteImageFromS3(filename);

    if (!isDeleted) {
      return res.status(500).json({ message: "Failed to delete old image" });
    }

    const imageUrl = await S3Service.uploadToS3(req.file);

    if (!imageUrl) {
      return res.status(500).json({ message: "Failed to upload new image" });
    }
    const transformedUrl = transformImageUrl(imageUrl);
    await Image.findByIdAndUpdate(
      id,
      { imageUrl: transformedUrl },
      { new: true }
    );
    return res.json({
      message: "Image updated successfully",
      imageUrl: transformedUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadImage = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const filename = extractFilename(image.imageUrl);
    const signedUrl = await S3Service.downloadImageFromS3(filename);

    if (!signedUrl) {
      return res.status(500).json({ message: "Failed to generate signed URL" });
    }

    res.set("Content-Type", "image/webp");
    res.set("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the S3 image stream directly to the response
    signedUrl.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listAllImagesFromS3 = async (req, res) => {
  try {
    const images = await S3Service.listImagesFromS3();
    return res.json({
      message: "Images fetched successfully",
      total: images.length,
      images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
