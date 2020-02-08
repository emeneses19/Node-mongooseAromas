const mongoose = require("mongoose");

//Para validar un dato unico
const uniqueValidator = require("mongoose-unique-validator");

//Declarando el esquema
let Schema = mongoose.Schema;
let clienteSchema = new Schema({
  nombres: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  apellidos: {
    type: String,
    required: [true, "El apellido es necesario"]
  },
  tipoDoc: {
    type: String
  },
  nroDoc: {
    type: String
  },
  email: {
    type: String,
    required: [true, "El email necesario"]
  },
  telefono: {
    type: String,
    required: [true, "telefono es necesario"]
  },
  role: {
    type: String,
    default: "USER_ROL"
  },
  google: {
    type: Boolean,
    default: false
  },
  facebook: {
    type: Boolean,
    default: false
  }
});

clienteSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });

module.exports = mongoose.model("Cliente", clienteSchema);
