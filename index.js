require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.set('views', path.resolve(__dirname, 'public'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);


app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/index"));

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