const { query } = require("express");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Mestesugari = require("../models/mestesugariModel");
const CategoriiMestesugar = require("../models/categoriiMestesugarModel");
const Sat = require("../models/sateModel");
const { cloudinary } = require("../utils/cloudinary");

///CREATE mestesugar
exports.createMestesugar = catchAsync(async (req, res, next) => {
  const categorie = await CategoriiMestesugar.find().where("_id").in(req.body.categorie).exec();
  const sat = await Sat.findOne({ _id: req.body.sat }).exec();
  let mestesugarObj = {};
  mestesugarObj.nume = req.body.nume;
  mestesugarObj.categorie = categorie;
  mestesugarObj.sat = sat;
  mestesugarObj.obs = req.body.obs;
  mestesugarObj.obs_en = req.body.obs_en;
  mestesugarObj.obs_de = req.body.obs_de;
  (mestesugarObj.meserie = req.body.meserie),
    (mestesugarObj.meserie_en = req.body.meserie_en),
    (mestesugarObj.meserie_de = req.body.meserie_de),
    (mestesugarObj.adresa = req.body.adresa),
    (mestesugarObj.tel = req.body.tel),
    (mestesugarObj.user = req.body.user);
  mestesugarObj.location = req.body.location;
  // console.log(mestesugarObj);
  const newMestesugar = await Mestesugari.create(mestesugarObj);
  res.status(201).json({
    status: "success",
    data: {
      mestesugar: newMestesugar,
    },
  });
});

///GET all mestesugari
exports.getAllMestesugari = catchAsync(async (req, res, next) => {
  let catId = req.query.cat;
  let satId = req.query.sat;

  let mestesugari;
  if (catId && satId) {
    // console.log('full')
    mestesugari = await Mestesugari.find({ "categorie._id": catId, "sat._id": satId });
  }
  if (catId && !satId) {
    // console.log('cat')
    mestesugari = await Mestesugari.find({ "categorie._id": catId });
  }
  if (satId && !catId) {
    // console.log('sat')
    mestesugari = await Mestesugari.find({ "sat._id": satId });
  }
  if (!satId && !catId) {
    // console.log('restu');
    mestesugari = await Mestesugari.find();
  }
  // const search = await Mestesugari.find({ $or: [ { 'nume' : new RegExp(search, 'i') } ] })
  const data = await Mestesugari.find();
  // await Mestesugari.deleteMany()

  res.status(200).json({
    mestesugari,
    lengthMestesugari: data.length,
  });
});

///SEARCH all mestesugari
exports.searchAllMestesugari = catchAsync(async (req, res, next) => {
  let nume = req.query.nume;

  const data = await Mestesugari.find({ $or: [{ nume: new RegExp(nume, "i") }] });

  res.status(200).json({
    result: data,
    length: data.length,
  });
});

///GET SPECIFIC mestesugar
exports.getSpecificMestesugar = catchAsync(async (req, res, next) => {
  const mestesugar = await Mestesugari.findById(req.params.id);
  if (!mestesugar) {
    return next(new AppError("No mestesugar found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      mestesugar,
    },
  });
});

///DELETE SPECIFIC mestesugar
exports.deleteMestesugar = catchAsync(async (req, res, next) => {
  const mestesugar = await Mestesugari.findByIdAndDelete(req.params.id);

  if (!mestesugar) {
    return next(new AppError("No mestesugar found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

///UPDATE SPECIFIC mestesugar
exports.updateMestesugar = catchAsync(async (req, res, next) => {
  const mestesugar = await Mestesugari.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!mestesugar) {
    return next(new AppError("No mestesugar found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { mestesugar },
  });
});

///UPDATE Pics for SPECIFIC Mestesugar
exports.updatePicsMestesugar = catchAsync(async (req, res, next) => {
  // console.log(req.body.data);
  // console.log(req.params.id);
  let arr = [];

  const mestesugar = await Mestesugari.findByIdAndUpdate(
    req.params.id,
    { $push: { photo: req.body.data.photo } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!mestesugar) {
    return next(new AppError("No mestesugar found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    mestesugar,
  });
});

///DELETE pic from SPECIFIC mestesugar
exports.delPicfromMestesugar = catchAsync(async (req, res, next) => {
  const mestesugarId = req.params.id;
  const mestesugarPhotoID = req.params.photoId;
  const mestesugarPublic_id = req.params.public_id;

  const delCloudinary = () => {
    return new Promise(async (resolve, reject) => {
      await cloudinary.api.delete_resources(mestesugarPublic_id);
    });
  };
  const delDbEntry = async () => {
    const mestesugar = await Mestesugari.findByIdAndUpdate(
      { _id: mestesugarId },
      { $pull: { photo: { _id: mestesugarPhotoID } } },
      { multi: true }
    );
    if (!mestesugar) {
      return next(new AppError("No mestesugar found with that ID", 404));
    }
  };
  delCloudinary()
    .then(delDbEntry())
    .catch((err) => console.log(err));

  res.status(200).json({
    status: "success",
  });
});
