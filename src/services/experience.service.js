import {
  createExperience as createExperienceInDatabase,
  deleteExperience as deleteExperienceInDatabase,
  findManyExperiencesPublic,
  findManyExperiencesAdmin,
  findExperienceById,
  updateExperience as updateExperienceInDatabase,
} from "../repositories/experience.repository.js";

const experienceNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Experience not found.",
  };
};

export const listExperiencesPublic = () => {
  return findManyExperiencesPublic();
};

export const listExperiencesAdmin = () => {
  return findManyExperiencesAdmin();
};

export const getExperienceById = async (id) => {
  const experience = await findExperienceById(id);

  if (!experience) {
    throw experienceNotFoundError();
  }

  return experience;
};

export const createExperience = async (input) => {
  return createExperienceInDatabase({
    role: input.role,
    organization: input.organization,
    startDate: new Date(input.startDate),
    description: input.description ?? null,
    location: input.location ?? null,
    endDate: input.endDate != null ? new Date(input.endDate) : null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateExperience = async (id, input) => {
  const existing = await findExperienceById(id);

  if (!existing) {
    throw experienceNotFoundError();
  }

  const data = {};

  if (input.role !== undefined) {
    data.role = input.role;
  }
  if (input.organization !== undefined) {
    data.organization = input.organization;
  }
  if (input.description !== undefined) {
    data.description = input.description;
  }
  if (input.location !== undefined) {
    data.location = input.location;
  }
  if (input.startDate !== undefined) {
    data.startDate = new Date(input.startDate);
  }
  if (input.endDate !== undefined) {
    data.endDate = input.endDate != null ? new Date(input.endDate) : null;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateExperienceInDatabase(id, data);
};

export const deleteExperience = async (id) => {
  const existing = await findExperienceById(id);

  if (!existing) {
    throw experienceNotFoundError();
  }

  return deleteExperienceInDatabase(id);
};
