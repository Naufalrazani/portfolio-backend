import {
  createAchievement as createAchievementInDatabase,
  deleteAchievement as deleteAchievementInDatabase,
  findManyAchievementsPublic,
  findManyAchievementsAdmin,
  findAchievementById,
  updateAchievement as updateAchievementInDatabase,
} from "../repositories/achievement.repository.js";

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
