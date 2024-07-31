const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./.env.dev" });

/**
 *
 * @param payload
 * @returns encoded payload @type string
 */
const encryptJsonWebToken = (payload, exp = 8 * 24 * 60 * 60 * 1000 /* default 8 days */) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: `${exp}ms` });
};

/**
 *
 * @param token @type string
 * @returns decoded payload @type any
 */
const decryptJsonWebToken = (token) => {
  return jwt.decode(token);
};

function encryptPassword(password) {
  const saltRounds = 10; // Number of salt rounds for hashing
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
}

// Function to compare a password with a hashed password
function comparePassword(password, hashedPassword) {
  const match = bcrypt.compareSync(password, hashedPassword);
  return match;
}




module.exports = {
  encryptJsonWebToken,
  decryptJsonWebToken,
  encryptPassword,
  comparePassword,
};
