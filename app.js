const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  .then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());
app.use(appRouter);

// =========== подключаю статику ===============
app.use(express.static('public'));

app.listen(PORT, () => {
  // console.log('mongoose version', mongoose.version);
  console.log(`App listening on port ${PORT}`);
});
