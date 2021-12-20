const mongoose = require('mongoose');

let sateSchema = new mongoose.Schema({
    nume:{
        type:String
    },
    obs:{
        type:String
    },
    obs_en:{
        type:String
    },
    obs_de:{
        type:String
    },
    user:{
        type:String
    },
    photo:[{
        id:{type:String},
        secure_url:{type:String},
        public_id:{type:String}
    }],
    location: {
        type: {type: String, default: 'Point'},
        coordinates: {type: [Number], default: [46.070340, 24.654855]}
    }
    
})
let sat = module.exports = mongoose.model("sate", sateSchema , 'sate');