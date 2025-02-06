"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// Rutas existentes
router.get("/", productController_1.obtenerProductos);
router.post("/", productController_1.agregarProducto);
router.put("/:id", productController_1.actualizarProducto);
router.delete("/:id", productController_1.eliminarProducto);
// Nueva ruta para obtener un producto por ID
router.get("/:id", productController_1.obtenerProductoPorId);
exports.default = router;
