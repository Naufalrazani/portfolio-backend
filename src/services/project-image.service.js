import {
  createProjectImage as createProjectImageInDatabase,
  deleteProjectImage as deleteProjectImageInDatabase,
  findProjectById,
  findProjectImageById,
  findProjectImagesByProjectId,
  updateProjectImage as updateProjectImageInDatabase,
} from "../repositories/project-image.repository.js";
import {
  deleteImage,
  extractPublicIdFromUrl,
  isConfigured,
  uploadImage,
} from "../lib/cloudinary.js";

const projectImageNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Project image not found.",
  };
};

const projectNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Project not found.",
  };
};

const ALLOWED_MAGIC_BYTES = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", check: (buf) => buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP" },
];

function validateMagicBytes(buffer) {
  return ALLOWED_MAGIC_BYTES.some((rule) => {
    if (rule.check) return rule.check(buffer);
    return buffer.slice(0, rule.bytes.length).every((b, i) => b === rule.bytes[i]);
  });
}

export const getProjectImageById = async (id) => {
  const image = await findProjectImageById(id);

  if (!image) {
    throw projectImageNotFoundError();
  }

  return image;
};

export const createProjectImage = async (input) => {
  const project = await findProjectById(input.projectId);

  if (!project) {
    throw projectNotFoundError();
  }

  return createProjectImageInDatabase({
    projectId: input.projectId,
    url: input.url,
    altText: input.altText ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const uploadProjectImage = async (input) => {
  if (!input.file) {
    throw {
      status: 400,
      code: "MISSING_FILE",
      message: "No file provided.",
    };
  }

  if (!input.projectId) {
    throw {
      status: 400,
      code: "MISSING_PROJECT_ID",
      message: "Project ID is required.",
    };
  }

  const project = await findProjectById(input.projectId);

  if (!project) {
    throw projectNotFoundError();
  }

  if (!validateMagicBytes(input.file.buffer)) {
    throw {
      status: 422,
      code: "INVALID_FILE_TYPE",
      message: "File must be JPEG, PNG, or WebP.",
    };
  }

  if (!isConfigured()) {
    throw {
      status: 500,
      code: "STORAGE_NOT_CONFIGURED",
      message: "Image storage is not configured.",
    };
  }

  let result;

  try {
    result = await uploadImage(
      input.file.buffer,
      `portfolio/projects/${input.projectId}`,
    );
  } catch {
    throw {
      status: 500,
      code: "STORAGE_ERROR",
      message: "Image upload failed.",
    };
  }

  return createProjectImageInDatabase({
    projectId: input.projectId,
    url: result.url,
    altText: input.altText ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateProjectImage = async (id, input) => {
  const existing = await findProjectImageById(id);

  if (!existing) {
    throw projectImageNotFoundError();
  }

  const data = {};

  if (input.url !== undefined) {
    data.url = input.url;
  }
  if (input.altText !== undefined) {
    data.altText = input.altText;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateProjectImageInDatabase(id, data);
};

export const deleteProjectImage = async (id) => {
  const existing = await findProjectImageById(id);

  if (!existing) {
    throw projectImageNotFoundError();
  }

  await deleteProjectImageFromStorage(existing.url);

  return deleteProjectImageInDatabase(id);
};

export const deleteProjectImageFromStorage = async (url) => {
  if (!isConfigured()) return;

  const publicId = extractPublicIdFromUrl(url);

  if (!publicId) return;

  try {
    await deleteImage(publicId);
  } catch (error) {
    console.error(
      `Failed to delete Cloudinary image ${publicId}:`,
      error.message || error,
    );
  }
};

export const deleteProjectImagesByProjectId = async (projectId) => {
  const images = await findProjectImagesByProjectId(projectId);

  for (const image of images) {
    await deleteProjectImageFromStorage(image.url);
  }
};
