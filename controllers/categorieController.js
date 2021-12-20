const { query } = require("express");
const catchAsync = require("../utils/catchAsync");
const CategorieObiectiv = require("../models/categoriiObiectiveModel");
const CategorieTrack = require("../models/categoriiTracksModel");
const Obiectiv = require("../models/obiectiveModel");
const Track = require("../models/tracksModel");
const CategoriiMestesugar = require("../models/categoriiMestesugarModel");
const Mestesugari = require("../models/mestesugariModel");
const AppError = require("../utils/appError");
const { cloudinary } = require("../utils/cloudinary");

const Sat = require("../models/sateModel");

/////////////////////////CATEGORII OBIECTIVE////////////////////////////
///CREATE categorie
exports.createCategorie = catchAsync(async (req, res, next) => {
  
  try {
    const newCategorie = await CategorieObiectiv.create(req.body.data);
    res.status(201).json({
      status: "success",
      data: {
        categoriiObiective: newCategorie,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
  // res.status(200).json({
  //   status: "success",
  //   data:req.body.data
    
  // });
});

///GET SPECIFIC categorie
exports.getSpecificCategorie = catchAsync(async (req, res, next) => {
  const categorie = await CategorieObiectiv.findById(req.params.id);

  const obiective = await Obiectiv.find({ "categorie._id": `${req.params.id}` });
  // console.log('Test ',obiective);

  if (!categorie) {
    return next(new AppError("No categorie found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    categorie,
    obiective,
  });
});

///GET categorii

exports.getCategorie = catchAsync(async (req, res, next) => {
  let finalObiectiv = [];
  const categorie = await CategorieObiectiv.find();
  for (let index = 0; index < categorie.length; index++) {
    const element = categorie[index];
    const obiectiv = await Obiectiv.find({ "categorie._id": `${element._id}` });
    finalObiectiv.push({ categorie: element, obiective: obiectiv });
    // console.log(element._id)
  }

  res.status(200).json({
    categorii: finalObiectiv,
  });

  // console.log(obiectiv)
});

///GET categorii

exports.getOnlyCategorie = catchAsync(async (req, res, next) => {
  const categorii = await CategorieObiectiv.find();
  res.status(200).json({
    data: categorii,
  });

  // console.log(obiectiv)
});

///DELETE categorii

exports.deleteCategorie = catchAsync(async (req, res, next) => {
  const categorie = await CategorieObiectiv.findByIdAndDelete(req.params.id);

  if (!categorie) {
    return next(new AppError("No categorie found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
/////////////////////////CATEGORII OBIECTIVE////////////////////////////

/////////////////////////SATE////////////////////////////
///CREATE sate
exports.createSat = catchAsync(async (req, res, next) => {
  const newSat = await Sat.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      sat: newSat,
    },
  });
});

///GET Sate

exports.getSat = catchAsync(async (req, res, next) => {
  const sat = await Sat.find().find().lean().exec();
  const noOfMestesugari = await Mestesugari.aggregate([{ $group: { _id: "$sat", no: { $sum: 1 } } }]);
  res.status(200).json({
    sat,
    noOfMestesugari,
  });
});

///GET SPECIFIC sat
exports.getSpecificSat = catchAsync(async (req, res, next) => {
  const sat = await Sat.findById(req.params.id);
  if (!sat) {
    return next(new AppError("No sat found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    sat,
  });
});

///GET position only of Sate

exports.getSatePosition = catchAsync(async (req, res, next) => {
  // const sat = await Sat.find().find().lean().exec()
  const position = await Sat.find({}, { location: 1, _id: 1 });

  res.status(200).json({
    position,
  });
});

///DELETE SPECIFIC sat
exports.deleteSat = catchAsync(async (req, res, next) => {
  const sat = await Sat.findByIdAndDelete(req.params.id);

  if (!sat) {
    return next(new AppError("No sat found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
///UPDATE SPECIFIC sat
exports.updateSat = catchAsync(async (req, res, next) => {
  const sat = await Sat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!sat) {
    return next(new AppError("No sat found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    // data: { sat }
  });
});

///UPDATE Pics for SPECIFIC obiectiv
exports.updatePicsObiectiv = catchAsync(async (req, res, next) => {
  console.log(req.body.data);
  console.log(req.params.id);

  const sat = await Sat.findByIdAndUpdate(
    req.params.id,
    { $push: { photo: req.body.data.photo } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!sat) {
    return next(new AppError("No obiectiv found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    // sat
  });
});

///DELETE pic from SPECIFIC Sat
exports.delPicfromSat = catchAsync(async (req, res, next) => {
  const satId = req.params.id;
  const satPhotoID = req.params.photoId;
  const satPublic_id = req.params.public_id;
  // console.log(satId,satPhotoID,satPublic_id);

  const delCloudinary = () => {
    return new Promise(async (resolve, reject) => {
      await cloudinary.api.delete_resources(satPublic_id);
    });
  };
  const delDbEntry = async () => {
    const sat = await Sat.findByIdAndUpdate({ _id: satId }, { $pull: { photo: { _id: satPhotoID } } }, { multi: true });
    if (!sat) {
      return next(new AppError("No sat found with that ID", 404));
    }
  };
  delCloudinary()
    .then(delDbEntry())
    .catch((err) => console.log(err));

  res.status(200).json({
    status: "success",
  });
});
/////////////////////////SATE////////////////////////////

/////////////////////////MESTESUGARI////////////////////////////

///CREATE categorie mestesugar
exports.createCategorieMestesugar = catchAsync(async (req, res, next) => {
  try {
    const newCatMestesugar = await CategoriiMestesugar.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        mestesugar: newCatMestesugar,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.message,
    });
  }
});

///GET categorie mestesugar

exports.getCategorieMestesugar = catchAsync(async (req, res, next) => {
  const categoriiMestesugar = await CategoriiMestesugar.find().lean().exec();

  const noOfMestesugari = await Mestesugari.aggregate([{ $group: { _id: "$categorie", no: { $sum: 1 } } }]);

  res.status(200).json({
    categorii: categoriiMestesugar,
    noOfMestesugari,
  });
});

/////////////////////////MESTESUGARI////////////////////////////

/////////////////////////TRASEE////////////////////////////
///CREATE categorii track
exports.createCatTrack = catchAsync(async (req, res, next) => {
  const newCatTrack = await CategorieTrack.create(req.body);

  res.status(201).json({
    newCatTrack,
  });
});

///GET all cat tracks

exports.getCatTracks = catchAsync(async (req, res, next) => {
  let finalObiectiv = [];
  const categorie = await CategorieTrack.find();
  for (let index = 0; index < categorie.length; index++) {
    const element = categorie[index];
    const track = await Track.find({ "categorie._id": `${element._id}` });
    finalObiectiv.push({ categorie: element, trasee: track });
    // console.log(element._id)
  }

  res.status(200).json({
    data: finalObiectiv,
  });
});

///GET SPECIFIC cat tracks
exports.getSpecificCatTrack = catchAsync(async (req, res, next) => {
  const catTrack = await CategorieTrack.findById(req.params.id);
  const tracks = await Track.find({ "categorie._id": `${req.params.id}` });
  if (!catTrack) {
    return next(new AppError("No catTrack found with that ID", 404));
  }

  res.status(200).json({
    catTrack,
    tracks,
  });
});

/////////////////////////TRASEE////////////////////////////
