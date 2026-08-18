import {
  createSkill as createSkillInDatabase,
  deleteSkill as deleteSkillInDatabase,
  findManySkillsPublic,
  findManySkillsAdmin,
  findSkillById,
  findSkillByName,
  updateSkill as updateSkillInDatabase,
} from "../repositories/skill.repository.js";

const skillNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Skill not found.",
  };
};

const skillConflictError = () => {
  return {
    status: 409,
    code: "CONFLICT",
    message: "A skill with this name already exists.",
  };
};

export const listSkillsPublic = () => {
  return findManySkillsPublic();
};

export const listSkillsAdmin = () => {
  return findManySkillsAdmin();
};

export const getSkillById = async (id) => {
  const skill = await findSkillById(id);

  if (!skill) {
    throw skillNotFoundError();
  }

  return skill;
};

export const createSkill = async (input) => {
  const existing = await findSkillByName(input.name);

  if (existing) {
    throw skillConflictError();
  }

  return createSkillInDatabase({
    name: input.name,
    category: input.category ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateSkill = async (id, input) => {
  const existing = await findSkillById(id);

  if (!existing) {
    throw skillNotFoundError();
  }

  if (input.name !== undefined) {
    const duplicate = await findSkillByName(input.name);

    if (duplicate && duplicate.id !== id) {
      throw skillConflictError();
    }
  }

  const data = {};

  if (input.name !== undefined) {
    data.name = input.name;
  }
  if (input.category !== undefined) {
    data.category = input.category;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateSkillInDatabase(id, data);
};

export const deleteSkill = async (id) => {
  const existing = await findSkillById(id);

  if (!existing) {
    throw skillNotFoundError();
  }

  return deleteSkillInDatabase(id);
};
