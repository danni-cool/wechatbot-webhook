// Token verification middleware
module.exports.verifyToken = (req, res, next) => {
  const { token } = req.query;

  if (token !== process.env.globalLoginToken) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Access is denied due to invalid credentials.'
    });
  }

  next();
};