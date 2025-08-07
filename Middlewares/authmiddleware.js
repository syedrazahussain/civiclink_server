const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: 'Token missing', success: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: 'Token is not valid', success: false });
      }
      
      req.userId = decoded.id;  // Assuming the decoded payload has the user ID
      next();  // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error', success: false });
  }
};
