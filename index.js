require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 8080);
mongoose.connect(process.env.MONGODB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose
    .connection
    .once('open', function () {
        console.log("Connect DB Success!");
    })
    .on('error', function (error) {
        console.log(error.stack);
        process.exit(1);
    })
app.listen(app.get('port'), function () {
    console.log(`App listening in port %d`, app.get('port'));
})