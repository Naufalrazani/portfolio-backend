import prisma from "../lib/prisma.js";

const publicSelect = {
  title: true,
  description: true,
  organization: true,
  date: true,
  url: true,
  sortOrder: true,
};

const adminSelect = {
  id: true,
  title: true,
  description: true,
  organization: true,
  date: true,
  url: true,
  sortOrder: true,
};

export const findManyAchievementsPublic = () => {
  return prisma.achievement.findMany({
    orderBy: { sortOrder: "asc" },
    select: publicSelect,
  });
};

export const findManyAchievementsAdmin = () => {
  return prisma.achievement.findMany({
    orderBy: { sortOrder: "asc" },
    select: adminSelect,
  });
};

export const findAchievementById = (id) => {
  return prisma.achievement.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const createAchievement = (data) => {
  return prisma.achievement.create({
    data,
    select: adminSelect,
  });
};

export const updateAchievement = (id, data) => {
  return prisma.achievement.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteAchievement = (id) => {
  return prisma.achievement.delete({
    where: { id },
  });
};
