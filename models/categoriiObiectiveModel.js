const mongoose = require('mongoose');
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}
let categoriiObiectiveSchema = new mongoose.Schema({
    nume:{
        type:String,
        unique: true,
        required: true,
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
        default:random_rgba()
    }
})
let CategorieObiectiv = module.exports = mongoose.model("categoriiObiective", categoriiObiectiveSchema , 'categoriiObiective');