const { query } = require("express");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const togeojson = require("@mapbox/togeojson");
const Track = require("../models/tracksModel");
const fileUpload = require("express-fileupload");
const CategorieTrack = require("../models/categoriiTracksModel");
const DomParser = require("xmldom").DOMParser; // node doesn't have xml parsing or a dom.
const fs = require("fs");

///POST and Convert tracks

exports.convertTrack = catchAsync(async (req, res, next) => {
  const categorieTrack = await CategorieTrack.find().where("_id").in(req.body.categorie).exec();
  const file = req.file.path;

  const convertFile = async (item) => {
    var gpx = new DomParser().parseFromString(fs.readFileSync(`./${item}`, "utf8"));
    var converted = togeojson.gpx(gpx);
    
    return await Track.create({
      categorie: categorieTrack,
      track: converted,
      nume: req.body.nume,
      user: req.body.user,
    });
  };
  const deleteFile = (item) => {
    fs.unlinkSync(`./${item}`);
  };
  convertFile(file).then(deleteFile(file));

  res.status(200).json({
    status: "success",
  });
});

///GET all tracks

exports.getAllTracks = catchAsync(async (req, res, next) => {
  const tracks = await Track.find();
  res.status(200).json({
    status: "success",
    data: tracks,
  });
});

///GET SPECIFIC track
exports.getTrackById = catchAsync(async (req, res, next) => {
  const track = await Track.findById(req.params.id);
  if (!track) {
    return next(new AppError("No track found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: track,
  });
});

///DELETE SPECIFIC track
exports.deleteTrackById = catchAsync(async (req, res, next) => {
  const obiectiv = await Track.findByIdAndDelete(req.params.id);

  if (!obiectiv) {
    return next(new AppError("No track found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
