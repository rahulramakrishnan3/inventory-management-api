import { randomUUID } from "node:crypto";
import items from "../data/items.js";
import { HttpError } from "../middleware/errors.js";

export function getItems(req, res) {
  const { category, quantity, minQuantity, maxQuantity, search } = req.query;
  const normalizedCategory = category?.trim().toLowerCase();
  const normalizedSearch = search?.trim().toLowerCase();

  const results = items.filter((item) => {
    if (normalizedCategory && item.category.toLowerCase() !== normalizedCategory) {
      return false;
    }
    if (quantity !== undefined && item.quantity !== Number(quantity)) {
      return false;
    }
    if (minQuantity !== undefined && item.quantity < Number(minQuantity)) {
      return false;
    }
    if (maxQuantity !== undefined && item.quantity > Number(maxQuantity)) {
      return false;
    }
    if (normalizedSearch && !item.name.toLowerCase().includes(normalizedSearch)) {
      return false;
    }
    return true;
  });

  res.json({
    success: true,
    data: results,
  });
}

export function getItem(req, res, next) {
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) {
    return next(new HttpError(404, "Item not found"));
  }

  res.json({
    success: true,
    data: item,
  });
}

export function createItem(req, res) {
  const item = {
    id: randomUUID(),
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  items.push(item);

  res.status(201).json({
    success: true,
    data: item,
    message: "Item created",
  });
}

export function updateItem(req, res, next) {
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) {
    return next(new HttpError(404, "Item not found"));
  }

  Object.assign(item, req.body, { updatedAt: new Date().toISOString() });

  res.json({
    success: true,
    data: item,
    message: "Item updated",
  });
}

export function deleteItem(req, res, next) {
  const index = items.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) {
    return next(new HttpError(404, "Item not found"));
  }

  const [item] = items.splice(index, 1);
  res.json({
    success: true,
    data: item,
    message: "Item deleted",
  });
}
