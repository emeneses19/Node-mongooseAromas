require('./config/config');
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use(cors());

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

// var corOptions = {
//     origin: 'http://localhost:4200',
//     optionsSuccessStatus: 200
//         //this is my front-end url for development
//         //'http://www.myproductionurl.com'
// }


mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) { throw err }
    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});