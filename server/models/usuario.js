const mongoose = require('mongoose');
const { Schema } = mongoose;
//Definir el esquema  --> con los datos que va a tener la coleccion
let usuarioSchema = new Schema({
  DNI: { type: String },
  nombres: { type: String, required: [true, 'El nombre es necesario'] },
  apellidos: { type: String, required: [true, 'El apellido es necesario'] },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: { type: String, required: [true, 'La contraseña es necesaria'] },
  img: { type: String, required: false },
  role: { type: String, default: 'EMPLEADO' },
  estado: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
  facebook: { type: Boolean, default: false },
  telefono: { type: String, required: false }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
