import multer from "multer";
import path from "path";
import fs from "fs";

const rootUploadDir = path.join(process.cwd(), "uploads");

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(rootUploadDir);

const imageExtensions = new Set([".jpeg", ".jpg", ".png", ".webp", ".gif"]);
const documentExtensions = new Set([".pdf", ".doc", ".docx"]);

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const documentMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const resolveFolderForUpload = (req, file) => {
  const base = req.baseUrl || "";
  // Profile pictures from user routes or auth routes (signup)
  if (base.includes("/user") || (base.includes("/auth") && file.fieldname === "image")) {
    return path.join(rootUploadDir, "profiles");
  }
  if (base.includes("/post")) {
    if (file.fieldname === "documents") {
      return path.join(rootUploadDir, "posts", "documents");
    }
    return path.join(rootUploadDir, "posts", "images");
  }
  if (base.includes("/drive")) {
    if (file.fieldname === "documents") {
      return path.join(rootUploadDir, "drives", "documents");
    }
    return path.join(rootUploadDir, "drives", "licenses");
  }
  return path.join(rootUploadDir, "misc");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = resolveFolderForUpload(req, file);
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const isDocumentField =
    file.fieldname === "documents" || file.fieldname === "document";

  const allowedExtensions = isDocumentField
    ? new Set([...imageExtensions, ...documentExtensions])
    : imageExtensions;

  const allowedMimeTypes = isDocumentField
    ? new Set([...imageMimeTypes, ...documentMimeTypes])
    : imageMimeTypes;

  const isExtensionValid = allowedExtensions.has(extension);
  const isMimeValid =
    allowedMimeTypes.has(file.mimetype.toLowerCase()) ||
    (file.mimetype.toLowerCase().startsWith("image/") &&
      allowedExtensions.has(extension));

  if (!isExtensionValid || !isMimeValid) {
    const docMessage =
      "Only image files (jpeg, jpg, png, webp, gif) are allowed for photos";
    const documentMessage =
      "Documents must be PDF, DOC, DOCX, or image files (jpeg, jpg, png, webp, gif)";
    return cb(new Error(isDocumentField ? documentMessage : docMessage));
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max size
  fileFilter,
});

export default upload;
