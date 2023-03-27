const jwt = require("jsonwebtoken");
const customers = require("./models/customers");

async function tokenMiddleware(req, res, next) {
  let token = req.header("Authorization");
  // req.headr - function
  // req.headers - object
  // req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "missing uthorization header", success: false });
  }
  const receivedToken = token.split(" ")[1];
  const decode = jwt.verify(receivedToken, "abcd@1234");
  const user = await customers.findById(decode.id);
  if (!user) {
    res.status(403).send("Invalid User");
  }
  req.user = user;
  next();
}

module.exports = tokenMiddleware;
