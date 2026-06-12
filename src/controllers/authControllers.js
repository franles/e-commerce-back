import { registerSchema } from '../schemas/authSchema.js'
import UserModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        // traer la clave secreta de JWT
        const JWT_SECRET = process.env.JWT_SECRET

        //extraer los datos del usuario
        const { username, email, password } = registerSchema.parse(req.body)

        //comprobar si ya existe el usuario
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' })
        }

        //encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        //comprobar el usuario admin
        const isFirsUser = (await UserModel.countDocuments()) === 0

        //crear usuario y guardar en DB
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: isFirsUser,
        })

        //generar token con json web token (JWT)
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: '1h',
        })

        //header.payload.signature
        //enviar token como una cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', //true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', //lax
            maxAge: 60 * 60 * 1000, //1 hora
        })
            .status(201)
            .json({ message: 'Usuario registrado exitosamente' })
    } catch (error) {
        console.error('Error en registerUser:', error)
        // Enviar info limitada al cliente y loguear stack para debug
        res.status(500).json({
            message: 'Error interno en el servidor',
            error: error.message,
        })
    }
}

export const profile = async (req, res) => {
    //Extraer el accessToken enviado por el cliente
    const token = req.cookies.accessToken
    try {
        //verificar o decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //buscar el usuario en la db
        const user = await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        console.log(
            'USUARIO ENCONTRADO CON EXITO y enviando al front datos del usuario'
        )
        res.status(200).json({
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            username: user.username,
        })
    } catch (error) {
        res.status(401).json({ message: 'No autorizado' })
    }
    return {
        user: 'test user',
    }
}
