import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_RESUME_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb({ status: 422, code: "INVALID_FILE_TYPE", message: "File must be JPEG, PNG, or WebP." });
    }
  },
});

const resumeUpload = multer({
  storage,
  limits: { fileSize: MAX_RESUME_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb({ status: 422, code: "INVALID_FILE_TYPE", message: "File must be PDF." });
    }
  },
});

export const uploadProjectImageFile = upload.single("file");
export const uploadEntityImageFile = upload.single("file");
export const uploadProfileImageFile = upload.single("file");
export const uploadProfileResumeFile = resumeUpload.single("file");
