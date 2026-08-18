import prisma from "../lib/prisma.js";

const adminSelect = {
  id: true,
  projectId: true,
  url: true,
  altText: true,
  sortOrder: true,
};

export const findProjectImageById = (id) => {
  return prisma.projectImage.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const findProjectById = (id) => {
  return prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });
};

export const createProjectImage = (data) => {
  return prisma.projectImage.create({
    data,
    select: adminSelect,
  });
};

export const updateProjectImage = (id, data) => {
  return prisma.projectImage.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteProjectImage = (id) => {
  return prisma.projectImage.delete({
    where: { id },
  });
};

export const findProjectImagesByProjectId = (projectId) => {
  return prisma.projectImage.findMany({
    where: { projectId },
    select: { id: true, url: true },
  });
};
