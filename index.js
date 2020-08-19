require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'), function () {
    console.log(`App listening in port %d`, app.get('port'));
})