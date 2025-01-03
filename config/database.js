const mongoose = require("mongoose")
require("dotenv").config()

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        UseUnifiedTopology: true,
    })
    .then(()=> console.log("DB connected succesfully"))
    .catch((error)=>{
        console.log("DB connection failed")
        console.error(error);
        process.exit(1)
    })
}