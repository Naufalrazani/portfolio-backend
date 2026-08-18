import {
  createExperience as createExperienceService,
  deleteExperience as deleteExperienceService,
  getExperienceById as getExperienceByIdService,
  listExperiencesAdmin,
  listExperiencesPublic,
  updateExperience as updateExperienceService,
} from "../services/experience.service.js";

export const getExperiences = async (req, res) => {
  if (req.auth) {
    const experiences = await listExperiencesAdmin();
    return res.json({ data: experiences });
  }

  const experiences = await listExperiencesPublic();
  res.json({ data: experiences });
};

export const getExperienceById = async (req, res) => {
  const experience = await getExperienceByIdService(req.params.id);

  res.json({ data: experience });
};

export const createExperience = async (req, res) => {
  const experience = await createExperienceService(req.body);

  res.status(201).json({ data: experience });
};

export const updateExperience = async (req, res) => {
  const experience = await updateExperienceService(req.params.id, req.body);

  res.json({ data: experience });
};

export const deleteExperience = async (req, res) => {
  await deleteExperienceService(req.params.id);

  res.status(204).end();
};
