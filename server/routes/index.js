const express = require("express");
const app = express();
app.use(require("./usuario"));
app.use(require("./login"));
app.use(require("./tipohabitacion"));
app.use(require("./habitacion"));
app.use(require("./reserva"));
app.use(require("./cliente"));
module.exports = app;
