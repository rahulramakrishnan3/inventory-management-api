import { HttpError } from "./errors.js";

const allowedFields = new Set(["name", "category", "quantity"]);

export function validateItem({ partial = false } = {}) {
  return (req, _res, next) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return next(new HttpError(400, "Request body must be a JSON object"));
    }

    const fields = Object.keys(body);
    if (fields.length === 0) {
      return next(new HttpError(400, "Request body must not be empty"));
    }

    const unknownField = fields.find((field) => !allowedFields.has(field));
    if (unknownField) {
      return next(new HttpError(400, `Unknown field: ${unknownField}`));
    }

    if (!partial) {
      const missingField = ["name", "category", "quantity"].find(
        (field) => !Object.hasOwn(body, field),
      );
      if (missingField) {
        return next(new HttpError(400, `${missingField} is required`));
      }
    }

    if (Object.hasOwn(body, "name")) {
      if (typeof body.name !== "string" || body.name.trim().length === 0) {
        return next(new HttpError(400, "name must be a non-empty string"));
      }
      body.name = body.name.trim();
    }

    if (Object.hasOwn(body, "category")) {
      if (
        typeof body.category !== "string" ||
        body.category.trim().length === 0
      ) {
        return next(new HttpError(400, "category must be a non-empty string"));
      }
      body.category = body.category.trim();
    }

    if (Object.hasOwn(body, "quantity")) {
      if (!Number.isInteger(body.quantity) || body.quantity < 0) {
        return next(
          new HttpError(400, "quantity must be a non-negative integer"),
        );
      }
    }

    next();
  };
}

export function validateItemFilters(req, _res, next) {
  const { quantity, minQuantity, maxQuantity } = req.query;
  const filters = { quantity, minQuantity, maxQuantity };

  for (const [field, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      (typeof value !== "string" ||
        !/^\d+$/.test(value) ||
        !Number.isSafeInteger(Number(value)))
    ) {
      return next(
        new HttpError(400, `${field} must be a non-negative integer`),
      );
    }
  }

  for (const field of ["category", "search"]) {
    const value = req.query[field];
    if (value !== undefined && typeof value !== "string") {
      return next(new HttpError(400, `${field} must be a single string`));
    }
  }

  if (
    minQuantity !== undefined &&
    maxQuantity !== undefined &&
    Number(minQuantity) > Number(maxQuantity)
  ) {
    return next(
      new HttpError(400, "minQuantity cannot be greater than maxQuantity"),
    );
  }

  next();
}
