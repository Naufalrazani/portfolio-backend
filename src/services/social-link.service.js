import {
  createSocialLink as createSocialLinkInDatabase,
  deleteSocialLink as deleteSocialLinkInDatabase,
  findManySocialLinksPublic,
  findManySocialLinksAdmin,
  findSocialLinkById,
  findSocialLinkByPlatform,
  updateSocialLink as updateSocialLinkInDatabase,
} from "../repositories/social-link.repository.js";

const socialLinkNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Social link not found.",
  };
};

const socialLinkConflictError = () => {
  return {
    status: 409,
    code: "CONFLICT",
    message: "A social link with this platform already exists.",
  };
};

export const listSocialLinksPublic = () => {
  return findManySocialLinksPublic();
};

export const listSocialLinksAdmin = () => {
  return findManySocialLinksAdmin();
};

export const getSocialLinkById = async (id) => {
  const socialLink = await findSocialLinkById(id);

  if (!socialLink) {
    throw socialLinkNotFoundError();
  }

  return socialLink;
};

export const createSocialLink = async (input) => {
  const existing = await findSocialLinkByPlatform(input.platform);

  if (existing) {
    throw socialLinkConflictError();
  }

  return createSocialLinkInDatabase({
    platform: input.platform,
    url: input.url,
    label: input.label ?? null,
    sortOrder: input.sortOrder ?? 0,
  });
};

export const updateSocialLink = async (id, input) => {
  const existing = await findSocialLinkById(id);

  if (!existing) {
    throw socialLinkNotFoundError();
  }

  if (input.platform !== undefined) {
    const duplicate = await findSocialLinkByPlatform(input.platform);

    if (duplicate && duplicate.id !== id) {
      throw socialLinkConflictError();
    }
  }

  const data = {};

  if (input.platform !== undefined) {
    data.platform = input.platform;
  }
  if (input.url !== undefined) {
    data.url = input.url;
  }
  if (input.label !== undefined) {
    data.label = input.label;
  }
  if (input.sortOrder !== undefined) {
    data.sortOrder = input.sortOrder;
  }

  return updateSocialLinkInDatabase(id, data);
};

export const deleteSocialLink = async (id) => {
  const existing = await findSocialLinkById(id);

  if (!existing) {
    throw socialLinkNotFoundError();
  }

  return deleteSocialLinkInDatabase(id);
};
