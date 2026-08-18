import prisma from "../lib/prisma.js";

const adminUserSelect = {
  id: true,
  username: true,
  passwordHash: true,
};

export const findByUsername = (username) => {
  return prisma.adminUser.findUnique({
    where: { username },
    select: adminUserSelect,
  });
};

export const findById = (id) => {
  return prisma.adminUser.findUnique({
    where: { id },
    select: adminUserSelect,
  });
};

export const create = (data) => {
  return prisma.adminUser.create({
    data,
    select: adminUserSelect,
  });
};
