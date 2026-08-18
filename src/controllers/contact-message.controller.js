import {
  getContactMessageById as getContactMessageByIdService,
  listContactMessages as listContactMessagesService,
  markContactMessageAsRead as markContactMessageAsReadService,
  submitContactMessage,
} from "../services/contact-message.service.js";

export const createContactMessage = async (req, res) => {
  await submitContactMessage(req.body);

  res.status(201).json({
    data: {
      message: "Contact message submitted successfully.",
    },
  });
};

export const listContactMessages = async (req, res) => {
  const messages = await listContactMessagesService();

  res.json({ data: messages });
};

export const getContactMessageById = async (req, res) => {
  const message = await getContactMessageByIdService(req.params.id);

  res.json({ data: message });
};

export const markContactMessageAsRead = async (req, res) => {
  const message = await markContactMessageAsReadService(req.params.id);

  res.status(200).json({ data: message });
};
