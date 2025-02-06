import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true },
  imagen: { type: String, required: true },
  descripcion: { type: String, default: true },
  category: { type: String, enum: ['tecnologia', 'ropa', 'zapatos', 'otros'], default: 'otros' }
});

export default mongoose.model("Product", ProductSchema);
