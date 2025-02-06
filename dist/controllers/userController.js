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
exports.loginUsuario = exports.registrarUsuario = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Registra un nuevo usuario en la base de datos.
 */
const registrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, email, password, esAdmin } = req.body;
        // Verificar si el usuario ya existe
        const usuarioExistente = yield User_1.default.findOne({ email });
        if (usuarioExistente) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Crear nuevo usuario (se incluye esAdmin)
        const nuevoUsuario = new User_1.default({
            nombre,
            email,
            password: hashedPassword,
            esAdmin: esAdmin !== null && esAdmin !== void 0 ? esAdmin : false, // ⬅️ Si esAdmin no está en req.body, se pone false
        });
        yield nuevoUsuario.save();
        res.status(201).json({ message: "Usuario registrado con éxito", usuario: nuevoUsuario });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.registrarUsuario = registrarUsuario;
/**
 * Autentica un usuario y genera un token JWT.
 */
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const usuario = yield User_1.default.findOne({ email });
        if (!usuario) {
            res.status(400).json({ message: "Usuario no encontrado" });
            return;
        }
        const passwordCorrecto = yield bcryptjs_1.default.compare(password, usuario.password);
        if (!passwordCorrecto) {
            res.status(400).json({ message: "Contraseña incorrecta" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: usuario._id, esAdmin: usuario.esAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.loginUsuario = loginUsuario;
