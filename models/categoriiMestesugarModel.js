const mongoose = require('mongoose');


let categoriiMestesugarSchema = new mongoose.Schema({
    nume:{
        type:String,
        unique: true,
        lowercase: true
    },
    nume_en:{
        type:String,
        lowercase: true
    },
    nume_de:{
        type:String,
        lowercase: true
    },
    color:{
        type:String,
        lowercase: true
    }
})
let CategoriiMestesugar = module.exports = mongoose.model("categoriiMestesugar", categoriiMestesugarSchema , 'categoriiMestesugar');