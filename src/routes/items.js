import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItem,
  getItems,
  updateItem,
} from "../controllers/itemsController.js";
import {
  validateItem,
  validateItemFilters,
} from "../middleware/validateItem.js";

const router = Router();

router
  .route("/")
  .get(validateItemFilters, getItems)
  .post(validateItem(), createItem);

router
  .route("/:id")
  .get(getItem)
  .put(validateItem(), updateItem)
  .patch(validateItem({ partial: true }), updateItem)
  .delete(deleteItem);

export default router;
