import {
  createProfile as createProfileService,
  deleteProfile as deleteProfileService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
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
