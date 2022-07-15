const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

const multer= require("multer");

mongoose.connect("mongodb://localhost:27017",
   {useNewUrlParser: true}
)
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
