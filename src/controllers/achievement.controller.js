import {
  createAchievement as createAchievementService,
  deleteAchievement as deleteAchievementService,
  getAchievementById as getAchievementByIdService,
  listAchievementsAdmin,
  listAchievementsPublic,
  updateAchievement as updateAchievementService,
} from "../services/achievement.service.js";

export const getAchievements = async (req, res) => {
  if (req.auth) {
    const achievements = await listAchievementsAdmin();
    return res.json({ data: achievements });
  }

  const achievements = await listAchievementsPublic();
  res.json({ data: achievements });
};

export const getAchievementById = async (req, res) => {
  const achievement = await getAchievementByIdService(req.params.id);

  res.json({ data: achievement });
};

export const createAchievement = async (req, res) => {
  const achievement = await createAchievementService(req.body);

  res.status(201).json({ data: achievement });
};

export const updateAchievement = async (req, res) => {
  const achievement = await updateAchievementService(req.params.id, req.body);

  res.json({ data: achievement });
};

export const deleteAchievement = async (req, res) => {
  await deleteAchievementService(req.params.id);

  res.status(204).end();
};
