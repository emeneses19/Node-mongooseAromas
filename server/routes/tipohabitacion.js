const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();

const Tipohabitacion = require('../models/tipohabitacion')

// ============================
// Mostrar todas las categorias
// ============================
app.get('/tipohabitacion', (req, res) => {

    Tipohabitacion.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, tipohabitaciones) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tipohabitaciones
            });

        })
});

// ============================
// Mostrar una categoria por ID
// ============================
app.get('/tipohabitacion/:id', (req, res) => {
    // Categoria.findById(....);

    let id = req.params.id;

    Tipohabitacion.findById(id, (err, tipohabitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tipohabitacionDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            tipohabitacion: tipohabitacionDB
        });

    });


});

//=================================
//Crae nueva categoria
//================================
app.post('/tipohabitacion', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let tipohabitacion = new Tipohabitacion({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    tipohabitacion.save((err, tipohabitacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!tipohabitacionDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            tipoHabitacion: tipohabitacionDB
        });
    });

});
//=================================
//Acrulaziar categoria por ID
//================================
app.put('/tipohabitacion/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    //let body = req.body;

    // let nombTipohabitacion = {
    //     nombre: body.nombre
    // }
    // let descTipohabitacion = {
    //     descripcion: body.descripcion
    // }
    let body = _.pick(req.body, ['nombre', 'descripcion']);
    Tipohabitacion.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, tipohabitacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!tipohabitacionDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            habitacion: tipohabitacionDB
        });
    });
});
// ============================
// Borrar las categorias por id
// ============================
app.delete('/tipohabitacion/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Tipohabitacion.findByIdAndRemove(id, (err, tipohabitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tipohabitacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Tipo habitacion Borrada'
        });

    });


});


module.exports = app;