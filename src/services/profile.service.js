import {
  createProfile as createProfileInDatabase,
  deleteProfile as deleteProfileInDatabase,
  findFirstProfile,
  findFirstProfileId,
  updateProfile as updateProfileInDatabase,
} from "../repositories/profile.repository.js";
import {
  deleteImage,
  deleteRaw,
  extractPublicIdFromUrl,
  isConfigured,
  uploadImage,
  uploadRaw,
} from "../lib/cloudinary.js";

const profileConflictError = () => {
  return {
    status: 409,
    code: "CONFLICT",
    message: "Profile already exists.",
  };
};

const profileNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Profile not found.",
  };
};

export const getProfile = async () => {
  const profile = await findFirstProfile();

  if (!profile) {
    throw profileNotFoundError();
  }

  return profile;
};

export const createProfile = async (input) => {
  const existingProfile = await findFirstProfileId();

  if (existingProfile) {
    throw profileConflictError();
  }

  return createProfileInDatabase({
    name: input.name,
    headline: input.headline,
    bio: input.bio,
    location: input.location ?? null,
    email: input.email ?? null,
    profileImageUrl: input.profileImageUrl ?? null,
    resumeUrl: input.resumeUrl ?? null,
  });
};

export const updateProfile = async (input) => {
  const existingProfile = await findFirstProfileId();

  if (!existingProfile) {
    throw profileNotFoundError();
  }

  const data = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }
  if (input.headline !== undefined) {
    data.headline = input.headline;
  }
  if (input.bio !== undefined) {
    data.bio = input.bio;
  }
  if (input.location !== undefined) {
    data.location = input.location;
  }
  if (input.email !== undefined) {
    data.email = input.email;
  }
  if (input.profileImageUrl !== undefined) {
    data.profileImageUrl = input.profileImageUrl;
  }
  if (input.resumeUrl !== undefined) {
    data.resumeUrl = input.resumeUrl;
  }

  return updateProfileInDatabase(existingProfile.id, data);
};

export const deleteProfile = async () => {
  const existingProfile = await findFirstProfileId();

  if (!existingProfile) {
    throw profileNotFoundError();
  }

  return deleteProfileInDatabase(existingProfile.id);
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

async function deleteRawFromStorage(url) {
  if (!isConfigured()) return;
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await deleteRaw(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary raw ${publicId}:`, error.message || error);
  }
}

export const uploadProfileImage = async (file) => {
  const existingProfile = await findFirstProfileId();
  if (!existingProfile) throw profileNotFoundError();

  if (!file) {
    throw { status: 400, code: "MISSING_FILE", message: "No file provided." };
  }

  if (!validateMagicBytes(file.buffer)) {
    throw { status: 422, code: "INVALID_FILE_TYPE", message: "File must be JPEG, PNG, or WebP." };
  }

  if (!isConfigured()) {
    throw { status: 500, code: "STORAGE_NOT_CONFIGURED", message: "Image storage is not configured." };
  }

  const profile = await findFirstProfile();
  const oldUrl = profile.profileImageUrl;

  let result;
  try {
    result = await uploadImage(file.buffer, `portfolio/profile/${existingProfile.id}`);
  } catch {
    throw { status: 500, code: "STORAGE_ERROR", message: "Image upload failed." };
  }

  const updated = await updateProfileInDatabase(existingProfile.id, { profileImageUrl: result.url });

  if (oldUrl) {
    await deleteImageFromStorage(oldUrl);
  }

  return updated;
};

export const deleteProfileImage = async () => {
  const existingProfile = await findFirstProfileId();
  if (!existingProfile) throw profileNotFoundError();

  const profile = await findFirstProfile();
  if (profile.profileImageUrl) {
    await deleteImageFromStorage(profile.profileImageUrl);
  }

  return updateProfileInDatabase(existingProfile.id, { profileImageUrl: null });
};

export const uploadProfileResume = async (file) => {
  const existingProfile = await findFirstProfileId();
  if (!existingProfile) throw profileNotFoundError();

  if (!file) {
    throw { status: 400, code: "MISSING_FILE", message: "No file provided." };
  }

  if (file.mimetype !== "application/pdf") {
    throw { status: 422, code: "INVALID_FILE_TYPE", message: "File must be PDF." };
  }

  if (file.buffer.length < 4 || file.buffer.toString("ascii", 0, 4) !== "%PDF") {
    throw { status: 422, code: "INVALID_FILE_TYPE", message: "File does not appear to be a valid PDF." };
  }

  if (!isConfigured()) {
    throw { status: 500, code: "STORAGE_NOT_CONFIGURED", message: "File storage is not configured." };
  }

  const profile = await findFirstProfile();
  const oldUrl = profile.resumeUrl;

  const originalName = file.originalname || "resume.pdf";

  let result;
  try {
    result = await uploadRaw(file.buffer, `portfolio/profile/${existingProfile.id}`, originalName);
  } catch {
    throw { status: 500, code: "STORAGE_ERROR", message: "Resume upload failed." };
  }

  const updated = await updateProfileInDatabase(existingProfile.id, { resumeUrl: result.url });

  if (oldUrl) {
    await deleteRawFromStorage(oldUrl);
  }

  return updated;
};

export const deleteProfileResume = async () => {
  const existingProfile = await findFirstProfileId();
  if (!existingProfile) throw profileNotFoundError();

  const profile = await findFirstProfile();
  if (profile.resumeUrl) {
    await deleteRawFromStorage(profile.resumeUrl);
  }

  return updateProfileInDatabase(existingProfile.id, { resumeUrl: null });
};
