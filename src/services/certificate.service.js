import {
  createCertificate as createCertificateInDatabase,
  deleteCertificate as deleteCertificateInDatabase,
  findManyCertificatesPublic,
  findManyCertificatesAdmin,
  findCertificateById,
  updateCertificate as updateCertificateInDatabase,
} from "../repositories/certificate.repository.js";
import {
  deleteImage,
  extractPublicIdFromUrl,
  isConfigured,
  uploadImage,
} from "../lib/cloudinary.js";

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

const ALLOWED_MAGIC_BYTES = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", check: (buf) => buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP" },
];

function validateMagicBytes(buffer) {
  return ALLOWED_MAGIC_BYTES.some((rule) => {
    if (rule.check) return rule.check(buffer);
    return buffer.slice(0, rule.bytes.length).every((b, i) => b === rule.bytes[i]);
  });
}

async function deleteImageFromStorage(url) {
  if (!isConfigured()) return;
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return;
  try {
    await deleteImage(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error.message || error);
  }
}

export const uploadCertificateImage = async (id, file) => {
  const existing = await findCertificateById(id);

  if (!existing) {
    throw certificateNotFoundError();
  }

  if (!file) {
    throw { status: 400, code: "MISSING_FILE", message: "No file provided." };
  }

  if (!validateMagicBytes(file.buffer)) {
    throw { status: 422, code: "INVALID_FILE_TYPE", message: "File must be JPEG, PNG, or WebP." };
  }

  if (!isConfigured()) {
    throw { status: 500, code: "STORAGE_NOT_CONFIGURED", message: "Image storage is not configured." };
  }

  const oldUrl = existing.imageUrl;

  let result;
  try {
    result = await uploadImage(file.buffer, `portfolio/certificates/${id}`);
  } catch {
    throw { status: 500, code: "STORAGE_ERROR", message: "Image upload failed." };
  }

  const updated = await updateCertificateInDatabase(id, { imageUrl: result.url });

  if (oldUrl) {
    await deleteImageFromStorage(oldUrl);
  }

  return updated;
};

export const deleteCertificateImage = async (id) => {
  const existing = await findCertificateById(id);

  if (!existing) {
    throw certificateNotFoundError();
  }

  if (existing.imageUrl) {
    await deleteImageFromStorage(existing.imageUrl);
  }

  return updateCertificateInDatabase(id, { imageUrl: null });
};
