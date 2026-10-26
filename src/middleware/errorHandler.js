export function errorHandler(err, req, res, next) {
  // 1. Schema validation failed (missing/invalid field)
  if (err.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) fields[key] = err.errors[key].message;
    return res.status(400).json({ error: "ValidationError", fields });
  }

  // 2. A value couldn't be cast (usually a bad ObjectId in the URL)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "CastError", message: "Invalid ID format", field: err.path });
  }

  // 3. Duplicate key on a unique index (NOT a ValidationError)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: "DuplicateKey", message: field + " already exists", field });
  }

  // 4. Anything else: log it, hide the details
  console.error(err);
  res.status(500).json({ error: "InternalServerError" });
}
