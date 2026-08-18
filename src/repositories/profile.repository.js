import prisma from "../lib/prisma.js";

const profilePublicSelect = {
  name: true,
  headline: true,
  bio: true,
  location: true,
  email: true,
  profileImageUrl: true,
  resumeUrl: true,
};

export const findFirstProfile = () => {
  return prisma.profile.findFirst({
    select: profilePublicSelect,
  });
};

export const findFirstProfileId = () => {
  return prisma.profile.findFirst({
    select: { id: true },
  });
};

export const createProfile = (data) => {
  return prisma.profile.create({
    data,
    select: profilePublicSelect,
  });
};

export const updateProfile = (id, data) => {
  return prisma.profile.update({
    where: { id },
    data,
    select: profilePublicSelect,
  });
};

export const deleteProfile = (id) => {
  return prisma.profile.delete({
    where: { id },
  });
};
