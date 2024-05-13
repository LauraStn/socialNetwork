const extractToken = async (req) => {
  const tokenHeaders = req.headers.authorization;

  if (tokenHeaders !== undefined || tokenHeaders) {
    const bearer = tokenHeaders.split(" ");
    const token = bearer[1];
    return token;
  }
};

module.exports = { extractToken };
