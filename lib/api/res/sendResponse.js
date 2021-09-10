const formatResponse = (payload) => ({ success: true, data: payload });

const formatError = (payload) => ({ success: false, error: payload });

const sendReponse = ({
  res,
  payload,
  statusCode = 200,
  success = true,
  override = {},
}) => {
  const data = success ? formatResponse(payload) : formatError(payload);
  return res.status(statusCode).json({ ...data, ...override });
};

module.exports = sendReponse;
