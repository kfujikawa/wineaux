const express = require("express");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const {PORT, DATABASE_URL} = require('./config');
const router = require("./router");

app.use(bodyParser.json());
app.use(express.static("public"));
app.use('/libs', express.static('./node_modules'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "Shh, its a secret!",
  store: new MongoStore({
    url: 'mongodb://localhost/wineaux',
    touchAfter: 24 * 3600
  })
}));

mongoose.Promise = global.Promise;

app.get('/vault', (req, res) => {
  res.sendFile(__dirname + "/public/views/vault.html");
});

app.get('/create', (req, res) => {
  res.sendFile(__dirname + "/public/views/user.html");
});

app.use("/vault", router);

app.all('*', (req, res) => {
  res.sendFile(__dirname + "/public/views/index.html");
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose
    .disconnect()
    .then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {
  app,
  runServer,
  closeServer
};