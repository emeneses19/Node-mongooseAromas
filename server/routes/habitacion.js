const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


let app = express();
let Habitacion = require('../models/habitacion');


// ===========================
//  Obtener Habitacions
// ===========================
app.get('/habitaciones', (req, res) => {
    // trae todos los Habitacions
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;

    Habitacion.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('tipohabitacion', 'nombre descripcion')
        .exec((err, habitaciones) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                habitaciones
            });


        })

});

// ===========================
//  Obtener un Habitacion por ID
// ===========================
app.get('/habitaciones/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    Habitacion.findById(id)
        .populate('usuario', 'nombre email')
        .populate('tipohabitacion', 'nombre')
        .exec((err, habitacionDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!habitacionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                habitacion: habitacionDB
            });

        });

});

// ===========================
//  Buscar Habitacions
// ===========================
app.get('/habitaciones/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    //Habitacion.find({ numero: regex, disponible: true }) para poner mas condiciones
    Habitacion.find({ numero: regex })
        .populate('tipohabitacion', 'nombre descripcion')
        .exec((err, habitacions) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                habitacions
            })

        })


});



// ===========================
//  Crear un nuevo Habitacion
// ===========================
app.post('/habitaciones', [verificaToken, verificaAdminRole], (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let body = req.body;

    let habitacion = new Habitacion({
        usuario: req.usuario._id,
        numero: body.numero,
        precionoche: body.precionoche,
        descripcion: body.descripcion,
        img: body.img,
        numeropiso: body.numeropiso,
        disponible: body.disponible,
        tipohabitacion: body.tipohabitacion
    });

    habitacion.save((err, habitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            habitacion: habitacionDB
        });

    });

});

// ===========================
//  Actualizar un Habitacion
// ===========================
app.put('/habitaciones/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let body = req.body;

    Habitacion.findById(id, (err, habitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!habitacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        habitacionDB.numero = body.numero;
        habitacionDB.precionoche = body.precionoche;
        habitacionDB.descripcion = body.descripcion;
        habitacionDB.img = body.img;
        //habitacionDB.numeropiso = numeropiso;
        habitacionDB.tipohabitacion = body.tipohabitacion;
        habitacionDB.disponible = body.disponible;

        habitacionDB.save((err, habitacionGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                habitacion: habitacionGuardado
            });

        });

    });


});

// ===========================
//  Borrar un Habitacion
// ===========================
app.delete('/habitacions/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Habitacion.findById(id, (err, habitacionDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!habitacionDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        habitacionDB.disponible = false;

        habitacionDB.save((err, habitacionBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Habitacion: habitacionBorrado,
                mensaje: 'Habitacion borrado'
            });

        })

    })


});

module.exports = app;