const mongoose = require('mongoose');

let obiectiveSchema = new mongoose.Schema({
    nume:{
        type:String,
        required: true,
        lowercase: false
    },
    sat:[{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Sat'
        },
        nume:{type:String}
        
    }],
    categorie:[{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Categorie'
        },
        nume:{type:String},
        color:{type:String}
        
    }],
    user:{
        type:String
    },
    photo:[{
        id:{type:String},
        secure_url:{type:String},
        public_id:{type:String}
    }],
    nume_en:{
        type:String 
    },
    nume_de:{
        type:String 
    },
    adresa:{
        type:String
    },
    tel:{
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
    location: {
        type: {type: String, default: 'Point'},
        coordinates: {type: [Number], default: [46.070340, 24.654855]}
    },
    
})
let obiectiv = module.exports = mongoose.model("obiective", obiectiveSchema , 'obiective');