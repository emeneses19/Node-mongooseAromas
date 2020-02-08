const express = require("express");

const {
  verificaToken,
  verificaAdminRole
} = require("../middlewares/autenticacion");

let app = express();
let Habitacion = require("../models/habitacion");
let Reserva = require("../models/reserva");

// ===========================
//  Obtener Habitaciones
// ===========================
app.get("/habitaciones", (req, res) => {
  // trae todos los Habitacions
  // populate: usuario categoria
  // paginado

  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;

  Habitacion.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate("usuario", "nombre email")
    .populate("tipohabitacion", "nombre descripcion")
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
    });
});
// ===========================
//Buscando habitaciones disponibles
// ===========================
app.get("/habitaciones/disponibles", async function(req, res) {
  try {
    let fechainicio = new Date(req.query.fechainicio);
    let fechafin = new Date(req.query.fechafin);
    // let tipohabitacion = (req.query.tipohabitacion);

    //Habitacion.find({ numero: regex, disponible: true }) para poner mas condiciones
    const reservas = await Reserva.find({
      fechainicio: { $lt: fechafin }, // $le menor que , $lte menor igual
      fechafin: { $gt: fechainicio }, // $gt mayor que, $gte mayor igual
      estado: { $ne: "cancelado" } // $ne no es igual
    })
      .select("reservaHabitacion")
      .exec();
    let ocupadas = [];
    for (const reserva of reservas) {
      for (const reshab of reserva.reservaHabitacion) {
        ocupadas.push(reshab.habitacionid);
      }
    }
    const disponibles = await Habitacion.find({
      _id: { $nin: ocupadas },
      disponible: true
    }).exec();
    res.json(disponibles);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ===========================
//Buscando Promociones
// ===========================
// app.get('/habitaciones/promociones/', async function(req, res) {

//     try {
//         let fechainicio = new Date(req.query.fechainicio);
//         let fechafin = new Date(req.query.fechafin);
//         let tipohabitacion = (req.query.tipohabitacion);

//         //Habitacion.find({ numero: regex, disponible: true }) para poner mas condiciones
//         const reservas = await Reserva.find({
//                 fechainicio: { $lt: fechafin }, // $le menor que , $lte menor igual
//                 fechafin: { $gt: fechainicio }, // $gt mayor que, $gte mayor igual
//                 estado: { $ne: 'cancelado' } // $ne no es igual
//             })
//             .select('reservaHabitacion')
//             .exec();
//         let ocupadas = [];
//         for (const reserva of reservas) {
//             for (const reshab of reserva.reservaHabitacion) {
//                 ocupadas.push(reshab.habitacionid);
//             }
//         }
//         const disponibles = await Habitacion.find({ '_id': { $nin: ocupadas }, disponible: true })

//         .exec();
//         res.json(disponibles);

//     } catch (error) {
//         res.status(500).json(error);
//     }

// });

// ===========================
//  Obtener un Habitacion por ID
// ===========================
app.get("/habitaciones/:id", (req, res) => {
  // populate: usuario categoria
  // paginado
  let id = req.params.id;

  Habitacion.findById(id)
    .populate("usuario", "nombre email")
    .populate("tipohabitacion", "nombre")
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
            message: "ID no existe"
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
app.get("/habitaciones/buscar/:termino", (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, "i");
  //Habitacion.find({ numero: regex, disponible: true }) para poner mas condiciones
  Habitacion.find({ numero: regex })
    .populate("tipohabitacion", "nombre descripcion")
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
      });
    });
});

// ===========================
//  Crear un nuevo Habitacion
// ===========================
app.post("/habitaciones", [verificaToken, verificaAdminRole], (req, res) => {
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
//  Agregando una promocion a una habitacion
// ===========================
app.post(
  "/habitaciones/:habitacionId/promociones",
  [verificaToken, verificaAdminRole],
  async (req, res) => {
    const id = req.params.habitacionId;
    const nuevaPromocion = req.body;
    try {
      const habitacion = await Habitacion.findById(id);
      if (!habitacion) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Lo sentimos. la habitacion que estas buscando no exite"
          }
        });
      }
      habitacion.promociones.push(nuevaPromocion);
      await habitacion.save();
      res.json(habitacion);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// ===========================
//  Actualizar un Habitacion
// ===========================
app.put("/habitaciones/:id", [verificaToken, verificaAdminRole], (req, res) => {
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
          message: "El ID no existe"
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
app.delete(
  "/habitacions/:id",
  [verificaToken, verificaAdminRole],
  (req, res) => {
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
            message: "ID no existe"
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
          mensaje: "Habitacion borrado"
        });
      });
    });
  }
);

module.exports = app;
