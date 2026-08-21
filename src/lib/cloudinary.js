import { v2 as cloudinary } from "cloudinary";

import { env } from "../config/env.js";

const UPLOAD_MARKER = "/upload/";

let configured = false;

function ensureConfigured() {
  if (configured) return;

  if (
    !env.cloudinaryCloudName ||
    !env.cloudinaryApiKey ||
    !env.cloudinaryApiSecret
  ) {
    throw {
      status: 500,
      code: "STORAGE_NOT_CONFIGURED",
      message: "Image storage is not configured.",
    };
  }

  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });

  configured = true;
}

export function uploadImage(buffer, folder) {
  ensureConfigured();

  const dataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataUri,
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          reject({
            status: 500,
            code: "STORAGE_ERROR",
            message: "Image upload failed.",
          });
          return;
        }
        resolve({ url: result.secure_url });
      },
    );
  });
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function uploadRaw(buffer, folder, originalFilename) {
  ensureConfigured();

  const stem = sanitizeFilename(originalFilename.replace(/\.pdf$/i, ""));
  const dataUri = `data:application/pdf;base64,${buffer.toString("base64")}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      dataUri,
      { folder, resource_type: "raw", public_id: stem },
      (error, result) => {
        if (error) {
          reject({
            status: 500,
            code: "STORAGE_ERROR",
            message: "File upload failed.",
          });
          return;
        }
        resolve({ url: result.secure_url, filename: `${stem}.pdf` });
      },
    );
  });
}

export function deleteImage(publicId) {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: "image" }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export function deleteRaw(publicId) {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: "raw" }, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export function extractPublicIdFromUrl(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const uploadIndex = path.indexOf(UPLOAD_MARKER);

    if (uploadIndex === -1) return null;

    let publicId = path.slice(uploadIndex + UPLOAD_MARKER.length);

    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^.]+$/, "");

    return publicId || null;
  } catch {
    return null;
  }
}

export function isConfigured() {
  return !!(
    env.cloudinaryCloudName &&
    env.cloudinaryApiKey &&
    env.cloudinaryApiSecret
  );
}
