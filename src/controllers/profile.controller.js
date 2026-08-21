import {
  createProfile as createProfileService,
  deleteProfile as deleteProfileService,
  deleteProfileImage as deleteProfileImageService,
  deleteProfileResume as deleteProfileResumeService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
  uploadProfileImage as uploadProfileImageService,
  uploadProfileResume as uploadProfileResumeService,
} from "../services/profile.service.js";

export const getProfile = async (req, res) => {
  const profile = await getProfileService();

  res.json({ data: profile });
};

export const createProfile = async (req, res) => {
  const profile = await createProfileService(req.body);

  res.status(201).json({ data: profile });
};

export const updateProfile = async (req, res) => {
  const profile = await updateProfileService(req.body);

  res.json({ data: profile });
};

export const deleteProfile = async (req, res) => {
  await deleteProfileService();

  res.status(204).end();
};

export const uploadProfileImage = async (req, res) => {
  const profile = await uploadProfileImageService(req.file);

  res.json({ data: profile });
};

export const deleteProfileImage = async (req, res) => {
  const profile = await deleteProfileImageService();

  res.json({ data: profile });
};

export const uploadProfileResume = async (req, res) => {
  const profile = await uploadProfileResumeService(req.file);

  res.json({ data: profile });
};

export const deleteProfileResume = async (req, res) => {
  const profile = await deleteProfileResumeService();

  res.json({ data: profile });
};
