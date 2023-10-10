// Error handling middleware
module.exports.handleError = (fn) => {
  return async (req, res) => {
    fn(req, res).catch(error => {
      console.error('Error handling request:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    });
  }
};
