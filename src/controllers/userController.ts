import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Registra un nuevo usuario en la base de datos.
 */
export const registrarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, esAdmin } = req.body;  

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario (se incluye esAdmin)
    const nuevoUsuario = new User({
      nombre,
      email,
      password: hashedPassword,
      esAdmin: esAdmin ?? false, // ⬅️ Si esAdmin no está en req.body, se pone false
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario registrado con éxito", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};


/**
 * Autentica un usuario y genera un token JWT.
 */
export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token = jwt.sign(
      { id: usuario._id, esAdmin: usuario.esAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
