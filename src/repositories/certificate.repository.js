import prisma from "../lib/prisma.js";

const publicSelect = {
  name: true,
  issuer: true,
  issueDate: true,
  credentialUrl: true,
  imageUrl: true,
  description: true,
  sortOrder: true,
};

const adminSelect = {
  id: true,
  name: true,
  issuer: true,
  issueDate: true,
  credentialUrl: true,
  imageUrl: true,
  description: true,
  sortOrder: true,
};

export const findManyCertificatesPublic = () => {
  return prisma.certificate.findMany({
    orderBy: { sortOrder: "asc" },
    select: publicSelect,
  });
};

export const findManyCertificatesAdmin = () => {
  return prisma.certificate.findMany({
    orderBy: { sortOrder: "asc" },
    select: adminSelect,
  });
};

export const findCertificateById = (id) => {
  return prisma.certificate.findUnique({
    where: { id },
    select: adminSelect,
  });
};

export const createCertificate = (data) => {
  return prisma.certificate.create({
    data,
    select: adminSelect,
  });
};

export const updateCertificate = (id, data) => {
  return prisma.certificate.update({
    where: { id },
    data,
    select: adminSelect,
  });
};

export const deleteCertificate = (id) => {
  return prisma.certificate.delete({
    where: { id },
  });
};
