import {
  createProjectImage as createProjectImageService,
  deleteProjectImage as deleteProjectImageService,
  getProjectImageById as getProjectImageByIdService,
  updateProjectImage as updateProjectImageService,
  uploadProjectImage as uploadProjectImageService,
} from "../services/project-image.service.js";

export const getProjectImageById = async (req, res) => {
  const image = await getProjectImageByIdService(req.params.id);

  res.json({ data: image });
};

export const createProjectImage = async (req, res) => {
  const image = await createProjectImageService(req.body);

  res.status(201).json({ data: image });
};

export const updateProjectImage = async (req, res) => {
  const image = await updateProjectImageService(req.params.id, req.body);

  res.json({ data: image });
};

export const deleteProjectImage = async (req, res) => {
  await deleteProjectImageService(req.params.id);

  res.status(204).end();
};

export const uploadProjectImage = async (req, res) => {
  const image = await uploadProjectImageService({
    file: req.file,
    projectId: req.body.projectId,
    altText: req.body.altText,
    sortOrder: req.body.sortOrder ? Number(req.body.sortOrder) : undefined,
  });

  res.status(201).json({ data: image });
};
