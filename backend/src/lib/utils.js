import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // ensure we have a secret to sign the token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // this is a fatal configuration error; throw so caller can log it
    throw new Error("JWT_SECRET is not defined in environment");
  }

  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
