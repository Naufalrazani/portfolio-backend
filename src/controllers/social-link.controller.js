import {
  createSocialLink as createSocialLinkService,
  deleteSocialLink as deleteSocialLinkService,
  getSocialLinkById as getSocialLinkByIdService,
  listSocialLinksAdmin,
  listSocialLinksPublic,
  updateSocialLink as updateSocialLinkService,
} from "../services/social-link.service.js";

export const getSocialLinks = async (req, res) => {
  if (req.auth) {
    const socialLinks = await listSocialLinksAdmin();
    return res.json({ data: socialLinks });
  }

  const socialLinks = await listSocialLinksPublic();
  res.json({ data: socialLinks });
};

export const getSocialLinkById = async (req, res) => {
  const socialLink = await getSocialLinkByIdService(req.params.id);

  res.json({ data: socialLink });
};

export const createSocialLink = async (req, res) => {
  const socialLink = await createSocialLinkService(req.body);

  res.status(201).json({ data: socialLink });
};

export const updateSocialLink = async (req, res) => {
  const socialLink = await updateSocialLinkService(req.params.id, req.body);

  res.json({ data: socialLink });
};

export const deleteSocialLink = async (req, res) => {
  await deleteSocialLinkService(req.params.id);

  res.status(204).end();
};
