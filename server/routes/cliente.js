const express = require('express');
const _ = require('underscore');

const Cliente = require('../models/cliente')

const app = express();

app.get('/cliente', [verificaToken, verificaAdminRole], (req, res) => {

    Cliente.find('nombre apellido email telefono tipoDoc nroDoc img google facebook')
        .exec((err, clientes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Cliente.count((err, conteo) => {
                res.json({
                    ok: true,
                    clientes,
                    cuantos: conteo
                });
            })
        });
});


app.post('/cliente', (req, res) => {
    try {
        const nuevoClient = await Cliente.create(req.body);
        res.json({
            ok: true,
            nuevoClient
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
app.put('/cliente/:id', (req, res) => {
    //Obteniendo el id
    let id = req.params.id;
    //Validando para actulizar datos los cuales van a permitir actualizar

    let body = _.pick(req.body, ['nombres', 'apellidos', 'email', 'img', 'tipoDoc', 'nroDoc', 'telefono', ]);
    Cliente.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, clienteDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cliente: clienteDB
        });
    });
});


module.exports = app;