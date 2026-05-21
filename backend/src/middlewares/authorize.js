
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Accès refusé : privilèges insuffisants" });
    }
    next();
  };
};

export default authorize;