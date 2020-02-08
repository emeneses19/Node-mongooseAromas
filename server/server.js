if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(require('./routes/index'));

mongoose
  .connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));

app.listen(app.get('port'), () => {
  console.log('Escuchando puerto: ', app.get('port'));
  console.log('Enviroment: ', process.env.NODE_ENV);
});
