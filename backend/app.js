const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const process = require('../nodemon.json');
const app = express();

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user')

mongoose.connect("mongodb+srv://iamscratches:" + process.env.MONGO_ATLAS_PW + "@cluster0.c27aj.mongodb.net/node-angular?retryWrites=true&w=majority").then(() => {
  console.log('Connected to Database!');
})
.catch(() =>{
  console.log('Connection Failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
  'Access-Control-Allow-Headers',
  "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);

module.exports = app;
