import express from "express";
import { obtenerProductos, agregarProducto, actualizarProducto, eliminarProducto, obtenerProductoPorId } from "../controllers/productController";

const router = express.Router();

// Rutas existentes
router.get("/", obtenerProductos);
router.post("/", agregarProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

// Nueva ruta para obtener un producto por ID
router.get("/:id", obtenerProductoPorId);

export default router;
