import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized! You are required to be logged in to perform this operation.',
    });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, response) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired, please login again to continue',
      });
    }
    req.user = response;
    return next();
  });
};
