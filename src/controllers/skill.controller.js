import {
  createSkill as createSkillService,
  deleteSkill as deleteSkillService,
  getSkillById as getSkillByIdService,
  listSkillsAdmin,
  listSkillsPublic,
  updateSkill as updateSkillService,
} from "../services/skill.service.js";

export const getSkills = async (req, res) => {
  if (req.auth) {
    const skills = await listSkillsAdmin();
    return res.json({ data: skills });
  }

  const skills = await listSkillsPublic();
  res.json({ data: skills });
};

export const getSkillById = async (req, res) => {
  const skill = await getSkillByIdService(req.params.id);

  res.json({ data: skill });
};

export const createSkill = async (req, res) => {
  const skill = await createSkillService(req.body);

  res.status(201).json({ data: skill });
};

export const updateSkill = async (req, res) => {
  const skill = await updateSkillService(req.params.id, req.body);

  res.json({ data: skill });
};

export const deleteSkill = async (req, res) => {
  await deleteSkillService(req.params.id);

  res.status(204).end();
};
