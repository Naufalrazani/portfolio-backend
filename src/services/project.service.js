import {
  createProject as createProjectInDatabase,
  deleteProject as deleteProjectInDatabase,
  findManyProjectsAdmin,
  findManyPublishedProjects,
  findProjectById,
  findProjectBySlug,
  findPublishedProjectBySlug,
  updateProject as updateProjectInDatabase,
} from "../repositories/project.repository.js";

const projectNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Project not found.",
  };
};

const projectConflictError = () => {
  return {
    status: 409,
    code: "CONFLICT",
    message: "A project with this slug already exists.",
  };
};

export const getProjects = () => findManyPublishedProjects();

export const listProjectsAdmin = () => findManyProjectsAdmin();

export const getProjectBySlug = async (slug) => {
  const project = await findPublishedProjectBySlug(slug);

  if (!project) {
    throw projectNotFoundError();
  }

  return project;
};

export const getProjectById = async (id) => {
  const project = await findProjectById(id);

  if (!project) {
    throw projectNotFoundError();
  }

  return project;
};

export const createProject = async (input) => {
  const existing = await findProjectBySlug(input.slug);

  if (existing) {
    throw projectConflictError();
  }

  return createProjectInDatabase({
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription ?? null,
    description: input.description,
    technologies: input.technologies,
    repositoryUrl: input.repositoryUrl ?? null,
    demoUrl: input.demoUrl ?? null,
    category: input.category ?? null,
    status: input.status,
    published: input.published,
    featured: input.featured,
    startDate: input.startDate != null ? new Date(input.startDate) : null,
    endDate: input.endDate != null ? new Date(input.endDate) : null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateProject = async (id, input) => {
  const existing = await findProjectById(id);

  if (!existing) {
    throw projectNotFoundError();
  }

  if (input.slug !== undefined) {
    const duplicate = await findProjectBySlug(input.slug);

    if (duplicate && duplicate.id !== id) {
      throw projectConflictError();
    }
  }

  const data = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }
  if (input.slug !== undefined) {
    data.slug = input.slug;
  }
  if (input.shortDescription !== undefined) {
    data.shortDescription = input.shortDescription;
  }
  if (input.description !== undefined) {
    data.description = input.description;
  }
  if (input.technologies !== undefined) {
    data.technologies = input.technologies;
  }
  if (input.repositoryUrl !== undefined) {
    data.repositoryUrl = input.repositoryUrl;
  }
  if (input.demoUrl !== undefined) {
    data.demoUrl = input.demoUrl;
  }
  if (input.category !== undefined) {
    data.category = input.category;
  }
  if (input.status !== undefined) {
    data.status = input.status;
  }
  if (input.published !== undefined) {
    data.published = input.published;
  }
  if (input.featured !== undefined) {
    data.featured = input.featured;
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

  return updateProjectInDatabase(id, data);
};

export const publishProject = async (id) => {
  const existing = await findProjectById(id);

  if (!existing) {
    throw projectNotFoundError();
  }

  return updateProjectInDatabase(id, { published: true });
};

export const unpublishProject = async (id) => {
  const existing = await findProjectById(id);

  if (!existing) {
    throw projectNotFoundError();
  }

  return updateProjectInDatabase(id, { published: false });
};

export const deleteProject = async (id) => {
  const existing = await findProjectById(id);

  if (!existing) {
    throw projectNotFoundError();
  }

  return deleteProjectInDatabase(id);
};
