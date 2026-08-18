import {
  createEducation as createEducationInDatabase,
  deleteEducation as deleteEducationInDatabase,
  findManyEducationPublic,
  findManyEducationAdmin,
  findEducationById,
  updateEducation as updateEducationInDatabase,
} from "../repositories/education.repository.js";

const educationNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Education not found.",
  };
};

export const listEducationPublic = () => {
  return findManyEducationPublic();
};

export const listEducationAdmin = () => {
  return findManyEducationAdmin();
};

export const getEducationById = async (id) => {
  const education = await findEducationById(id);

  if (!education) {
    throw educationNotFoundError();
  }

  return education;
};

export const createEducation = async (input) => {
  return createEducationInDatabase({
    institution: input.institution,
    degree: input.degree ?? null,
    fieldOfStudy: input.fieldOfStudy ?? null,
    description: input.description ?? null,
    startDate: input.startDate != null ? new Date(input.startDate) : null,
    endDate: input.endDate != null ? new Date(input.endDate) : null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateEducation = async (id, input) => {
  const existing = await findEducationById(id);

  if (!existing) {
    throw educationNotFoundError();
  }

  const data = {};

  if (input.institution !== undefined) {
    data.institution = input.institution;
  }
  if (input.degree !== undefined) {
    data.degree = input.degree;
  }
  if (input.fieldOfStudy !== undefined) {
    data.fieldOfStudy = input.fieldOfStudy;
  }
  if (input.description !== undefined) {
    data.description = input.description;
  }
  if (input.startDate !== undefined) {
    data.startDate = input.startDate != null ? new Date(input.startDate) : null;
  }
  if (input.endDate !== undefined) {
    data.endDate = input.endDate != null ? new Date(input.endDate) : null;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateEducationInDatabase(id, data);
};

export const deleteEducation = async (id) => {
  const existing = await findEducationById(id);

  if (!existing) {
    throw educationNotFoundError();
  }

  return deleteEducationInDatabase(id);
};
