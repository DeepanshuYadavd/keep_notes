import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Access Denied: No Token Provided",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // contains id, userName
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Access Denied: Invalid Token",
    });
  }
};
