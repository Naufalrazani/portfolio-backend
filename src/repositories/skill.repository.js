import prisma from "../lib/prisma.js";

const publicSelect = {
  name: true,
  category: true,
  sortOrder: true,
};

const adminSelect = {
  id: true,
  name: true,
  category: true,
  sortOrder: true,
};

export const findManySkillsPublic = () => {
  return prisma.skill.findMany({
    orderBy: { sortOrder: "asc" },
    select: publicSelect,
  });
};

export const findManySkillsAdmin = () => {
  return prisma.skill.findMany({
    orderBy: { sortOrder: "asc" },
    select: adminSelect,
  });
};

export const findSkillById = (id) => {
  return prisma.skill.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const findSkillByName = (name) => {
  return prisma.skill.findUnique({
    where: { name },
    select: { id: true },
  });
};

export const createSkill = (data) => {
  return prisma.skill.create({
    data,
    select: adminSelect,
  });
};

export const updateSkill = (id, data) => {
  return prisma.skill.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteSkill = (id) => {
  return prisma.skill.delete({
    where: { id },
  });
};
