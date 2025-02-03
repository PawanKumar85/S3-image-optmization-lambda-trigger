const fileParamsConfig = {
  logo: { ext: "png", size: "400x100", filesize: "150KB" },
  icons: { ext: "png", size: "64x64", filesize: "50KB" },
  avatar: { ext: "png", size: "400x400", filesize: "300KB" },
  blog: { ext: "webp", size: "1200x800", filesize: "400KB" },
  image: { ext: "jpeg", size: "2000x2000", filesize: "700KB" },
  wallpaper: { ext: "jpeg", size: "1920x1080", filesize: "1.5MB" },
  linkedIn: { ext: "jpeg", size: "1584x396", filesize: "1MB" },
};

export const addQuery = (req, res, next) => {
  const fileData = fileParamsConfig[req.file.fieldname];
  req.file.originalname = `${req.file.originalname}?ext=${fileData.ext}&size=${fileData.size}&filesize=${fileData.filesize}`;
  console.log(req.file.originalname);
  next();
};


