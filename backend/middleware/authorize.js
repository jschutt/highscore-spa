const jwt = require("jsonwebtoken");

function authorize(role) {
  return function (req, res, next) {
    const authorizationHeader = req.headers["authorization"];

    const token = authorizationHeader?.split(" ")[1];

    if (!token) {
      res.status(401).send();
      return;
    }

    jwt.verify(token, 'GREEN', function (err, claims) {
      if (err) {
        res.status(401).send();
        return;
      }

      const hasRole = claims.roles.find((x) => role);

      if (!hasRole) {
        res.status(403).send();
        return;
      } else if (hasRole != role) {
        res.status(403).send();
        return;
      }

      next();
    });
  };
}

module.exports = authorize;
