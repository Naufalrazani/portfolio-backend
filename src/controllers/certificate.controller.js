import {
  createCertificate as createCertificateService,
  deleteCertificate as deleteCertificateService,
  getCertificateById as getCertificateByIdService,
  listCertificatesAdmin,
  listCertificatesPublic,
  updateCertificate as updateCertificateService,
} from "../services/certificate.service.js";

export const getCertificates = async (req, res) => {
  if (req.auth) {
    const certificates = await listCertificatesAdmin();
    return res.json({ data: certificates });
  }

  const certificates = await listCertificatesPublic();
  res.json({ data: certificates });
};

export const getCertificateById = async (req, res) => {
  const certificate = await getCertificateByIdService(req.params.id);

  res.json({ data: certificate });
};

export const createCertificate = async (req, res) => {
  const certificate = await createCertificateService(req.body);

  res.status(201).json({ data: certificate });
};

export const updateCertificate = async (req, res) => {
  const certificate = await updateCertificateService(req.params.id, req.body);

  res.json({ data: certificate });
};

export const deleteCertificate = async (req, res) => {
  await deleteCertificateService(req.params.id);

  res.status(204).end();
};
