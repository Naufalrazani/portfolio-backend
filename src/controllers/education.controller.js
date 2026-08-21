import {
  createEducation as createEducationService,
  deleteEducation as deleteEducationService,
  deleteEducationImage as deleteEducationImageService,
  getEducationById as getEducationByIdService,
  listEducationAdmin,
  listEducationPublic,
  updateEducation as updateEducationService,
  uploadEducationImage as uploadEducationImageService,
} from "../services/education.service.js";

export const getEducation = async (req, res) => {
  if (req.auth) {
    const education = await listEducationAdmin();
    return res.json({ data: education });
  }

  const education = await listEducationPublic();
  res.json({ data: education });
};

export const getEducationById = async (req, res) => {
  const education = await getEducationByIdService(req.params.id);

  res.json({ data: education });
};

export const createEducation = async (req, res) => {
  const education = await createEducationService(req.body);

  res.status(201).json({ data: education });
};

export const updateEducation = async (req, res) => {
  const education = await updateEducationService(req.params.id, req.body);

  res.json({ data: education });
};

export const deleteEducation = async (req, res) => {
  await deleteEducationService(req.params.id);

  res.status(204).end();
};

export const uploadEducationImage = async (req, res) => {
  const education = await uploadEducationImageService(req.params.id, req.file);

  res.json({ data: education });
};

export const deleteEducationImage = async (req, res) => {
  const education = await deleteEducationImageService(req.params.id);

  res.json({ data: education });
};
