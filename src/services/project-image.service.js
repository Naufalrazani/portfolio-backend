import {
  createProjectImage as createProjectImageInDatabase,
  deleteProjectImage as deleteProjectImageInDatabase,
  findProjectById,
  findProjectImageById,
  updateProjectImage as updateProjectImageInDatabase,
} from "../repositories/project-image.repository.js";

const projectImageNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Project image not found.",
  };
};

const projectNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Project not found.",
  };
};

export const getProjectImageById = async (id) => {
  const image = await findProjectImageById(id);

  if (!image) {
    throw projectImageNotFoundError();
  }

  return image;
};

export const createProjectImage = async (input) => {
  const project = await findProjectById(input.projectId);

  if (!project) {
    throw projectNotFoundError();
  }

  return createProjectImageInDatabase({
    projectId: input.projectId,
    url: input.url,
    altText: input.altText ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateProjectImage = async (id, input) => {
  const existing = await findProjectImageById(id);

  if (!existing) {
    throw projectImageNotFoundError();
  }

  const data = {};

  if (input.url !== undefined) {
    data.url = input.url;
  }
  if (input.altText !== undefined) {
    data.altText = input.altText;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateProjectImageInDatabase(id, data);
};

export const deleteProjectImage = async (id) => {
  const existing = await findProjectImageById(id);

  if (!existing) {
    throw projectImageNotFoundError();
  }

  return deleteProjectImageInDatabase(id);
};
