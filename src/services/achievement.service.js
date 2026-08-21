import {
  createAchievement as createAchievementInDatabase,
  deleteAchievement as deleteAchievementInDatabase,
  findManyAchievementsPublic,
  findManyAchievementsAdmin,
  findAchievementById,
  updateAchievement as updateAchievementInDatabase,
} from "../repositories/achievement.repository.js";
import {
  deleteImage,
  extractPublicIdFromUrl,
  isConfigured,
  uploadImage,
} from "../lib/cloudinary.js";

const achievementNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Achievement not found.",
  };
};

export const listAchievementsPublic = () => {
  return findManyAchievementsPublic();
};

export const listAchievementsAdmin = () => {
  return findManyAchievementsAdmin();
};

export const getAchievementById = async (id) => {
  const achievement = await findAchievementById(id);

  if (!achievement) {
    throw achievementNotFoundError();
  }

  return achievement;
};

export const createAchievement = async (input) => {
  return createAchievementInDatabase({
    title: input.title,
    description: input.description ?? null,
    organization: input.organization ?? null,
    imageUrl: input.imageUrl ?? null,
    date: input.date != null ? new Date(input.date) : null,
    url: input.url ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateAchievement = async (id, input) => {
  const existing = await findAchievementById(id);

  if (!existing) {
    throw achievementNotFoundError();
  }

  const data = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }
  if (input.description !== undefined) {
    data.description = input.description;
  }
  if (input.organization !== undefined) {
    data.organization = input.organization;
  }
  if (input.imageUrl !== undefined) {
    data.imageUrl = input.imageUrl;
  }
  if (input.date !== undefined) {
    data.date = input.date != null ? new Date(input.date) : null;
  }
  if (input.url !== undefined) {
    data.url = input.url;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateAchievementInDatabase(id, data);
};

export const deleteAchievement = async (id) => {
  const existing = await findAchievementById(id);

  if (!existing) {
    throw achievementNotFoundError();
  }

  return deleteAchievementInDatabase(id);
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

export const uploadAchievementImage = async (id, file) => {
  const existing = await findAchievementById(id);

  if (!existing) {
    throw achievementNotFoundError();
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
    result = await uploadImage(file.buffer, `portfolio/achievements/${id}`);
  } catch {
    throw { status: 500, code: "STORAGE_ERROR", message: "Image upload failed." };
  }

  const updated = await updateAchievementInDatabase(id, { imageUrl: result.url });

  if (oldUrl) {
    await deleteImageFromStorage(oldUrl);
  }

  return updated;
};

export const deleteAchievementImage = async (id) => {
  const existing = await findAchievementById(id);

  if (!existing) {
    throw achievementNotFoundError();
  }

  if (existing.imageUrl) {
    await deleteImageFromStorage(existing.imageUrl);
  }

  return updateAchievementInDatabase(id, { imageUrl: null });
};
