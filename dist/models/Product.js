"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    imagen: { type: String, required: true },
    descripcion: { type: String, default: true },
    category: { type: String, enum: ['tecnologia', 'ropa', 'zapatos', 'otros'], default: 'otros' }
});
exports.default = mongoose_1.default.model("Product", ProductSchema);
