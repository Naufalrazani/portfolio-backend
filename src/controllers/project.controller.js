import {
  createProject as createProjectService,
  deleteProject as deleteProjectService,
  getProjectById as getProjectByIdService,
  getProjects as getProjectsService,
  getProjectBySlug as getProjectBySlugService,
  listProjectsAdmin,
  publishProject as publishProjectService,
  unpublishProject as unpublishProjectService,
  updateProject as updateProjectService,
} from "../services/project.service.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getProjects = async (req, res) => {
  if (req.auth) {
    const projects = await listProjectsAdmin();
    return res.json({ data: projects });
  }

  const projects = await getProjectsService();
  res.json({ data: projects });
};

export const getProjectByParam = async (req, res) => {
  const param = req.params.param;

  if (req.auth && UUID_PATTERN.test(param)) {
    const project = await getProjectByIdService(param);
    return res.json({ data: project });
  }

  const project = await getProjectBySlugService(param);
  res.json({ data: project });
};

export const createProject = async (req, res) => {
  const project = await createProjectService(req.body);

  res.status(201).json({ data: project });
};

export const updateProject = async (req, res) => {
  const project = await updateProjectService(req.params.id, req.body);

  res.json({ data: project });
};

export const deleteProject = async (req, res) => {
  await deleteProjectService(req.params.id);

  res.status(204).end();
};

export const publishProject = async (req, res) => {
  const project = await publishProjectService(req.params.id);

  res.json({ data: project });
};

export const unpublishProject = async (req, res) => {
  const project = await unpublishProjectService(req.params.id);

  res.json({ data: project });
};
