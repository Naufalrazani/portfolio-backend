import prisma from "../lib/prisma.js";

const projectPublicImageSelect = {
  url: true,
  altText: true,
  sortOrder: true,
};

const projectAdminImageSelect = {
  id: true,
  projectId: true,
  url: true,
  altText: true,
  sortOrder: true,
};

const projectPublicSelect = {
  title: true,
  slug: true,
  shortDescription: true,
  description: true,
  technologies: true,
  repositoryUrl: true,
  demoUrl: true,
  category: true,
  status: true,
  published: true,
  featured: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
  images: {
    orderBy: { sortOrder: "asc" },
    select: projectPublicImageSelect,
  },
};

const projectAdminSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  description: true,
  technologies: true,
  repositoryUrl: true,
  demoUrl: true,
  category: true,
  status: true,
  published: true,
  featured: true,
  startDate: true,
  endDate: true,
  sortOrder: true,
  images: {
    orderBy: { sortOrder: "asc" },
    select: projectAdminImageSelect,
  },
};

export const findManyPublishedProjects = () => {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: projectPublicSelect,
  });
};

export const findPublishedProjectBySlug = (slug) => {
  return prisma.project.findFirst({
    where: { slug, published: true },
    select: projectPublicSelect,
  });
};

export const findManyProjectsAdmin = () => {
  return prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
    select: projectAdminSelect,
  });
};

export const findProjectById = (id) => {
  return prisma.project.findUnique({
    where: { id },
    select: projectAdminSelect,
  });
};

export const findProjectBySlug = (slug) => {
  return prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  });
};

export const createProject = (data) => {
  return prisma.project.create({
    data,
    select: projectAdminSelect,
  });
};

export const updateProject = (id, data) => {
  return prisma.project.update({
    where: { id },
    data,
    select: projectAdminSelect,
  });
};

export const deleteProject = (id) => {
  return prisma.project.delete({
    where: { id },
  });
};
