const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

const Usuario = require('../models/usuario')

const app = express();

app.get('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'nombre apellido email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })
        });
});


app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: body.password,
        telefono: body.telefono,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Obteniendo el id
    let id = req.params.id;
    //Validando para actulizar datos los cuales van a permitir actualizar

    let body = _.pick(req.body, ['nombre', 'apellido', 'email', 'img', 'role', 'estado', 'telefono']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    // res.json({
    //     id
    // });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    //deje de existir el rsgstro

    //Borra definitivamente
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (usuarioBorrado === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'El usuario no existe'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // });

    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
});
module.exports = app;