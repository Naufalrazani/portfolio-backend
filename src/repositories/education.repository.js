import prisma from "../lib/prisma.js";

const publicSelect = {
  institution: true,
  degree: true,
  fieldOfStudy: true,
  description: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
};

const adminSelect = {
  id: true,
  institution: true,
  degree: true,
  fieldOfStudy: true,
  description: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
};

export const findManyEducationPublic = () => {
  return prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
    select: publicSelect,
  });
};

export const findManyEducationAdmin = () => {
  return prisma.education.findMany({
    orderBy: { sortOrder: "asc" },
    select: adminSelect,
  });
};

export const findEducationById = (id) => {
  return prisma.education.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const createEducation = (data) => {
  return prisma.education.create({
    data,
    select: adminSelect,
  });
};

export const updateEducation = (id, data) => {
  return prisma.education.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteEducation = (id) => {
  return prisma.education.delete({
    where: { id },
  });
};
