import {
  createExperience as createExperienceInDatabase,
  deleteExperience as deleteExperienceInDatabase,
  findManyExperiencesPublic,
  findManyExperiencesAdmin,
  findExperienceById,
  updateExperience as updateExperienceInDatabase,
} from "../repositories/experience.repository.js";
import {
  deleteImage,
  extractPublicIdFromUrl,
  isConfigured,
  uploadImage,
} from "../lib/cloudinary.js";

const experienceNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Experience not found.",
  };
};

export const listExperiencesPublic = () => {
  return findManyExperiencesPublic();
};

export const listExperiencesAdmin = () => {
  return findManyExperiencesAdmin();
};

export const getExperienceById = async (id) => {
  const experience = await findExperienceById(id);

  if (!experience) {
    throw experienceNotFoundError();
  }

  return experience;
};

export const createExperience = async (input) => {
  return createExperienceInDatabase({
    role: input.role,
    organization: input.organization,
    startDate: new Date(input.startDate),
    description: input.description ?? null,
    location: input.location ?? null,
    imageUrl: input.imageUrl ?? null,
    endDate: input.endDate != null ? new Date(input.endDate) : null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateExperience = async (id, input) => {
  const existing = await findExperienceById(id);

  if (!existing) {
    throw experienceNotFoundError();
  }

  const data = {};

  if (input.role !== undefined) {
    data.role = input.role;
  }
  if (input.organization !== undefined) {
    data.organization = input.organization;
  }
  if (input.description !== undefined) {
    data.description = input.description;
  }
  if (input.location !== undefined) {
    data.location = input.location;
  }
  if (input.imageUrl !== undefined) {
    data.imageUrl = input.imageUrl;
  }
  if (input.startDate !== undefined) {
    data.startDate = new Date(input.startDate);
  }
  if (input.endDate !== undefined) {
    data.endDate = input.endDate != null ? new Date(input.endDate) : null;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateExperienceInDatabase(id, data);
};

export const deleteExperience = async (id) => {
  const existing = await findExperienceById(id);

  if (!existing) {
    throw experienceNotFoundError();
  }

  return deleteExperienceInDatabase(id);
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

async function deleteImageFromStorage(url) {
  if (!isConfigured()) return;
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await deleteImage(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error.message || error);
  }
}

export const uploadExperienceImage = async (id, file) => {
  const existing = await findExperienceById(id);

  if (!existing) {
    throw experienceNotFoundError();
  }

  if (!file) {
    throw { status: 400, code: "MISSING_FILE", message: "No file provided." };
  }

  if (!validateMagicBytes(file.buffer)) {
    throw { status: 422, code: "INVALID_FILE_TYPE", message: "File must be JPEG, PNG, or WebP." };
  }

  if (!isConfigured()) {
    throw { status: 500, code: "STORAGE_NOT_CONFIGURED", message: "Image storage is not configured." };
  }

  const oldUrl = existing.imageUrl;

  let result;
  try {
    result = await uploadImage(file.buffer, `portfolio/experiences/${id}`);
  } catch {
    throw { status: 500, code: "STORAGE_ERROR", message: "Image upload failed." };
  }

  const updated = await updateExperienceInDatabase(id, { imageUrl: result.url });

  if (oldUrl) {
    await deleteImageFromStorage(oldUrl);
  }

  return updated;
};

export const deleteExperienceImage = async (id) => {
  const existing = await findExperienceById(id);

  if (!existing) {
    throw experienceNotFoundError();
  }

  if (existing.imageUrl) {
    await deleteImageFromStorage(existing.imageUrl);
  }

  return updateExperienceInDatabase(id, { imageUrl: null });
};
