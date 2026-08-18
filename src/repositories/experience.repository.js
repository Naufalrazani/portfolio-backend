import prisma from "../lib/prisma.js";

const publicSelect = {
  role: true,
  organization: true,
  description: true,
  location: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
};

const adminSelect = {
  id: true,
  role: true,
  organization: true,
  description: true,
  location: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
};

export const findManyExperiencesPublic = () => {
  return prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
    select: publicSelect,
  });
};

export const findManyExperiencesAdmin = () => {
  return prisma.experience.findMany({
    orderBy: { sortOrder: "asc" },
    select: adminSelect,
  });
};

export const findExperienceById = (id) => {
  return prisma.experience.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const createExperience = (data) => {
  return prisma.experience.create({
    data,
    select: adminSelect,
  });
};

export const updateExperience = (id, data) => {
  return prisma.experience.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteExperience = (id) => {
  return prisma.experience.delete({
    where: { id },
  });
};
