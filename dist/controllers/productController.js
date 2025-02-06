"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerProductoPorId = exports.eliminarProducto = exports.actualizarProducto = exports.agregarProducto = exports.obtenerProductos = void 0;
const Product_1 = __importDefault(require("../models/Product"));
/**
 * Obtener todos los productos
 */
const obtenerProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productos = yield Product_1.default.find();
        res.json(productos); // ❌ No hacer return res.json(), solo res.json()
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error });
    }
});
exports.obtenerProductos = obtenerProductos;
/**
 * Agregar un nuevo producto (solo admin)
 */
const agregarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, precio, cantidad, imagen, descripcion, category } = req.body;
        // Validar que los campos necesarios estén presentes
        if (!nombre || !precio || !cantidad || !imagen || !category) {
            res.status(400).json({ message: "Todos los campos son obligatorios, incluyendo 'category'" });
            return;
        }
        // Validar que el valor de category esté en los valores permitidos
        const categoriasPermitidas = ['tecnologia', 'ropa', 'zapatos', 'otros'];
        if (!categoriasPermitidas.includes(category)) {
            res.status(400).json({ message: "Categoría no válida. Las opciones válidas son: 'tecnologia', 'ropa','zapatos', 'otros'." });
            return;
        }
        // Crear un nuevo producto con los datos proporcionados
        const nuevoProducto = new Product_1.default({
            nombre,
            precio,
            cantidad,
            imagen,
            descripcion,
            category, // Pasamos 'category' aquí
        });
        // Guardar el nuevo producto en la base de datos
        yield nuevoProducto.save();
        res.status(201).json({ message: "Producto agregado con éxito", nuevoProducto });
    }
    catch (error) {
        res.status(500).json({ message: "Error al agregar producto", error });
    }
});
exports.agregarProducto = agregarProducto;
/**
 * Actualizar un producto por ID (solo admin)
 */
const actualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, precio, cantidad, imagen, descripcion, category } = req.body;
        // Primero buscamos el producto
        let producto = yield Product_1.default.findById(id);
        if (!producto) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        // Actualizamos solo los campos que vienen en el request
        producto.nombre = nombre || producto.nombre;
        producto.precio = precio || producto.precio;
        producto.cantidad = cantidad || producto.cantidad;
        producto.imagen = imagen || producto.imagen;
        // Para el booleano necesitamos una validación especial ya que puede ser false
        producto.descripcion = descripcion || producto.descripcion;
        producto.category = category || producto.category;
        // Guardamos los cambios
        yield producto.save();
        res.status(200).json({
            message: "Producto actualizado exitosamente",
            producto
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al actualizar producto",
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.actualizarProducto = actualizarProducto;
/**
 * Eliminar un producto por ID (solo admin)
 */
const eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productoEliminado = yield Product_1.default.findByIdAndDelete(id);
        if (!productoEliminado) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.json({ message: "Producto eliminado correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error });
    }
});
exports.eliminarProducto = eliminarProducto;
/**
 * Obtener un producto por ID
 */
const mongoose_1 = require("mongoose");
const obtenerProductoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Asegúrate de que el id sea un ObjectId válido
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "ID de producto no válido" });
            return;
        }
        const producto = yield Product_1.default.findById(id);
        if (!producto) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.json(producto); // Devolver el producto encontrado
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener producto", error });
    }
});
exports.obtenerProductoPorId = obtenerProductoPorId;
