import {
  createContactMessage,
  findContactMessageById,
  findManyContactMessages,
  markContactMessageAsRead as markContactMessageAsReadInDatabase,
} from "../repositories/contact-message.repository.js";

const contactMessageNotFoundError = () => {
  return {
    status: 404,
    code: "NOT_FOUND",
    message: "Contact message not found.",
  };
};

export const submitContactMessage = async (input) => {
  await createContactMessage({
    name: input.name,
    email: input.email,
    subject: input.subject ?? null,
    message: input.message,
  });
};

export const listContactMessages = async () => {
  return findManyContactMessages();
};

export const getContactMessageById = async (id) => {
  const message = await findContactMessageById(id);

  if (!message) {
    throw contactMessageNotFoundError();
  }

  return message;
};

export const markContactMessageAsRead = async (id) => {
  const message = await findContactMessageById(id);

  if (!message) {
    throw contactMessageNotFoundError();
  }

  return markContactMessageAsReadInDatabase(id);
};
