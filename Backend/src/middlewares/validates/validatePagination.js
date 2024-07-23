export const validateQuery = (query) => (req, res, next) => {
  try {
    const limit = +req.query.limit;
    const page = +req.query.page;
    query.parse({ limit, page });
    req.query.limit = limit;
    req.query.page = page;
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors.map((error) => error.message) });
  }
};
