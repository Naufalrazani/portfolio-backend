import prisma from "../lib/prisma.js";

const publicSelect = {
  platform: true,
  url: true,
  label: true,
  sortOrder: true,
};

const adminSelect = {
  id: true,
  platform: true,
  url: true,
  label: true,
  sortOrder: true,
};

export const findManySocialLinksPublic = () => {
  return prisma.socialLink.findMany({
    orderBy: { sortOrder: "asc" },
    select: publicSelect,
  });
};

export const findManySocialLinksAdmin = () => {
  return prisma.socialLink.findMany({
    orderBy: { sortOrder: "asc" },
    select: adminSelect,
  });
};

export const findSocialLinkById = (id) => {
  return prisma.socialLink.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const findSocialLinkByPlatform = (platform) => {
  return prisma.socialLink.findUnique({
    where: { platform },
    select: { id: true },
  });
};

export const createSocialLink = (data) => {
  return prisma.socialLink.create({
    data,
    select: adminSelect,
  });
};

export const updateSocialLink = (id, data) => {
  return prisma.socialLink.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteSocialLink = (id) => {
  return prisma.socialLink.delete({
    where: { id },
  });
};
