import { login as loginUser } from "../services/auth.service.js";

export const login = async (req, res) => {
  const { token } = await loginUser(req.body);

  res.status(200).json({
    data: {
      token,
    },
  });
};
