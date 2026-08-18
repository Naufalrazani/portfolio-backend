import {
  createProfile as createProfileInDatabase,
  deleteProfile as deleteProfileInDatabase,
  findFirstProfile,
  findFirstProfileId,
  updateProfile as updateProfileInDatabase,
} from "../repositories/profile.repository.js";

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
