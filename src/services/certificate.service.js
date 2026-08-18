import {
  createCertificate as createCertificateInDatabase,
  deleteCertificate as deleteCertificateInDatabase,
  findManyCertificatesPublic,
  findManyCertificatesAdmin,
  findCertificateById,
  updateCertificate as updateCertificateInDatabase,
} from "../repositories/certificate.repository.js";

const certificateNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Certificate not found.",
  };
};

export const listCertificatesPublic = () => {
  return findManyCertificatesPublic();
};

export const listCertificatesAdmin = () => {
  return findManyCertificatesAdmin();
};

export const getCertificateById = async (id) => {
  const certificate = await findCertificateById(id);

  if (!certificate) {
    throw certificateNotFoundError();
  }

  return certificate;
};

export const createCertificate = async (input) => {
  return createCertificateInDatabase({
    name: input.name,
    issuer: input.issuer,
    issueDate: input.issueDate != null ? new Date(input.issueDate) : null,
    credentialUrl: input.credentialUrl ?? null,
    imageUrl: input.imageUrl ?? null,
    description: input.description ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateCertificate = async (id, input) => {
  const existing = await findCertificateById(id);

  if (!existing) {
    throw certificateNotFoundError();
  }

  const data = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }
  if (input.issuer !== undefined) {
    data.issuer = input.issuer;
  }
  if (input.issueDate !== undefined) {
    data.issueDate =
      input.issueDate != null ? new Date(input.issueDate) : null;
  }
  if (input.credentialUrl !== undefined) {
    data.credentialUrl = input.credentialUrl;
  }
  if (input.imageUrl !== undefined) {
    data.imageUrl = input.imageUrl;
  }
  if (input.description !== undefined) {
    data.description = input.description;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateCertificateInDatabase(id, data);
};

export const deleteCertificate = async (id) => {
  const existing = await findCertificateById(id);

  if (!existing) {
    throw certificateNotFoundError();
  }

  return deleteCertificateInDatabase(id);
};
