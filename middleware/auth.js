const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_STATUS } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization = "" } = req.headers;

  if (!authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED_STATUS)
      .send({ message: "Authorization required" });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED_STATUS).send({ message: "Invalid token" });
  }

};

module.exports = auth;
