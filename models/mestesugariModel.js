const mongoose = require("mongoose");

let mestesugariSchema = new mongoose.Schema({
  nume: {
    type: String,
    required: true,
  },
  sat: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sat",
      },
      nume: { type: String },
    },
  ],
  categorie: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mestesugari",
      },
      nume: { type: String },
      color: { type: String },
    },
  ],
  user: {
    type: String,
  },
  photo: [
    {
      id: { type: String },
      secure_url: { type: String },
      public_id: { type: String },
    },
  ],
  meserie: {
    type: String,
  },
  meserie_en: {
    type: String,
  },
  meserie_de: {
    type: String,
  },
  adresa: {
    type: String,
  },
  tel: {
    type: String,
  },
  obs: {
    type: String,
  },
  obs_en: {
    type: String,
  },
  obs_de: {
    type: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [46.07034, 24.654855] },
  },
});
let mestesugari = (module.exports = mongoose.model("mestesugari", mestesugariSchema, "mestesugari"));
