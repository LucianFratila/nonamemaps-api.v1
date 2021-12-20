const mongoose = require('mongoose');


let tracksSchema = new mongoose.Schema({
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
    categorie:[{
    
        id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categorie'
    },
        nume:{type:String},
        color:{type:String}
        
    }],
    track:{type:Object},
    user:{
        type:String
    }
    
})
let track = module.exports = mongoose.model("tracks", tracksSchema , 'tracks');