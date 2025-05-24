
const { response } = require('express');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const crearUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        // Validar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }
        // Generar el token - JWT
        const token = await generarJWT(usuarioDB.id);

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}

const renewToken = async (req, res = response) => {
    const  uid  = req;
     // Generar el token - JWT
    const token = await generarJWT(uid);

    // Leer la base de datos
    const usuarioDB = await Usuario.findById(uid);
   
   
    // if (!usuarioDB) {
    //     return res.status(401).json({
    //         ok: false,
    //         msg: 'Token no válido'
    //     });
    // }
   

    res.json({
        ok: true,
        usuario,
        token
    })
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}