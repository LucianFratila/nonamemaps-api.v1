const mongoose = require('mongoose');


let categoriiTracksSchema = new mongoose.Schema({
    nume:{
        type:String
    },
    nume_en:{
        type:String
    },
    nume_de:{
        type:String
    },
    color:{
        type:String
    }
})
let categoriiTrack = module.exports = mongoose.model("categoriiTracks", categoriiTracksSchema , 'categoriiTracks');