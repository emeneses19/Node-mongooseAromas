const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


let app = express();
let Promocion = require('../models/promocion');


// ===========================
//  Obtener Habitacions
// ===========================
app.get('/promociones', (req, res) => {
    // trae todos los Habitacions
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;

    Promocion.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('tipohabitacion', 'nombre descripcion')
        .exec((err, promociones) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                promociones
            });


        })

});

// ===========================
//  Obtener un Habitacion por ID
// ===========================
app.get('/promociones/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Promocion.findById(id)
        .populate('usuario', 'nombre email')
        .populate('tipohabitacion', 'nombre')
        .exec((err, promocionDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!promocionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                habitacion: promocionDB
            });

        });

});

// ===========================
//  Buscar Habitacions
// ===========================
app.get('/promociones/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    //Habitacion.find({ numero: regex, disponible: true }) para poner mas condiciones
    Promocion.find({ fechainicio: regex })
        .populate('tipohabitacion', 'nombre descripcion')
        .exec((err, promociones) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                promociones
            });

        });


});



// ===========================
//  Crear un nuevo Habitacion
// ===========================
app.post('/promociones', [verificaToken, verificaAdminRole], (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let promocion = new Promocion({
        usuario: req.usuario._id,
        fechainicio: body.fechainicio,
        fechafin: body.fechafin,
        precioprom: body.precioprom,
        disponible: body.disponible,
        descripcion: body.descripcion,
        tipohabitacion: body.tipohabitacion
    });

    promocion.save((err, promocionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            promocion: promocionDB
        });

    });

});

// ===========================
//  Actualizar un Habitacion
// ===========================
app.put('/promociones/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Promocion.findById(id, (err, promocionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!promocionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        promocionDB.fechainicio = body.fechainicio;
        promocionDB.fechafin = body.fechafin;
        promocionDB.precioprom = body.precioprom;
        promocionDB.disponible = body.disponible;
        promocionDB.descripcion = body.descripcion;
        promocionDB.tipohabitacion = body.tipohabitacion;

        promocionDB.save((err, promocionGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                promocion: promocionGuardado
            });

        });

    });


});

// ===========================
//  Borrar un Habitacion
// ===========================
app.delete('/promociones/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Promocion.findById(id, (err, promocionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!promocionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        promocionDB.disponible = false;

        promocionDB.save((err, promocionBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                promocion: promocionBorrado,
                mensaje: 'Habitacion borrado'
            });

        })

    })


});

module.exports = app;