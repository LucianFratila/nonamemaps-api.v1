const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const middleware = require('./AuthConfig/middleware');













// default options

const {authUser, authRole} = require('./AuthConfig/auth/authMiddleware')
/////////// ROUTES ////////////
const obiectivRouter = require('./routes/obiectivRoutes')
const categorieRouter = require('./routes/categoriiRoutes')
const imageRouter = require('./routes/imageRoutes')
const authRouter = require('./routes/authRoutes')
//////////////////////////////


dotenv.config({ path: "./config.env" });

let db = mongoose.connection;


//check db errors
db.on('error', function(err){
    console.log(err)
})

//init app/Start express application
const app = express();
// middleware cors

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(middleware.decodeToken);






//routes
app.use("/v1/obiective", obiectivRouter);
app.use("/v1/categorie", categorieRouter);
app.use("/v1/media", imageRouter);
app.use("/v1/auth", authRouter);





//server
const port = process.env.PORT || 5000
var server = app.listen(port, console.log('Server started on port', port))
// console.log(process.env.PROJECT_ID);

//DB settings

const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection: online");
    });

    // ** MIDDLEWARE ** //
const whitelist = []
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))


module.exports = app;
