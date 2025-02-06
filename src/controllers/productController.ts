import { Request, Response } from "express";
import Product from "../models/Product";

/**
 * Obtener todos los productos
 */
export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await Product.find();
    res.json(productos); // ❌ No hacer return res.json(), solo res.json()
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

/**
 * Agregar un nuevo producto (solo admin)
 */
export const agregarProducto = async (req: Request, res: Response): Promise<void> => {
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
    const nuevoProducto = new Product({
      nombre,
      precio,
      cantidad,
      imagen,
      descripcion,
      category,  // Pasamos 'category' aquí
    });

    // Guardar el nuevo producto en la base de datos
    await nuevoProducto.save();
    res.status(201).json({ message: "Producto agregado con éxito", nuevoProducto });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto", error });
  }
};

/**
 * Actualizar un producto por ID (solo admin)
 */
export const actualizarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, precio, cantidad, imagen, descripcion, category } = req.body;
    
    // Primero buscamos el producto
    let producto = await Product.findById(id);

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
    await producto.save();
    
    res.status(200).json({
      message: "Producto actualizado exitosamente",
      producto
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error al actualizar producto",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Eliminar un producto por ID (solo admin)
 */
export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productoEliminado = await Product.findByIdAndDelete(id);

    if (!productoEliminado) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
};

/**
 * Obtener un producto por ID
 */
import { Types } from "mongoose";

export const obtenerProductoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Asegúrate de que el id sea un ObjectId válido
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "ID de producto no válido" });
      return;
    }

    const producto = await Product.findById(id);

    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    res.json(producto); // Devolver el producto encontrado
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error });
  }
};
