import prisma from "../lib/prisma.js";

const contactMessageSelect = {
  id: true,
  name: true,
  email: true,
  subject: true,
  message: true,
  isRead: true,
  createdAt: true,
  updatedAt: true,
};

export const createContactMessage = (data) => {
  return prisma.contactMessage.create({
    data,
    select: contactMessageSelect,
  });
};

export const findManyContactMessages = () => {
  return prisma.contactMessage.findMany({
    orderBy: [{ isRead: "asc" }, { createdAt: "asc" }],
    select: contactMessageSelect,
  });
};

export const findContactMessageById = (id) => {
  return prisma.contactMessage.findUnique({
    where: { id },
    select: contactMessageSelect,
  });
};

export const markContactMessageAsRead = (id) => {
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
    select: contactMessageSelect,
  });
};
