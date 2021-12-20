const { query } = require("express");
const { cloudinary } = require("../utils/cloudinary");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
// const multer  = require('multer')
// const upload = multer({ dest: '../multer' })
const fs = require("fs");
// require('../misc/')

///////////GET all img//////////////
exports.getAllImg = catchAsync(async (req, res, next) => {
  let limit = req.params.limit;
  //   console.log(limit);
  const data = await cloudinary.api.resources({ type: "upload", max_results: limit });
  res.status(201).json({
    status: "success",
    data,
  });
});

///////////GET single img by public_id  ////////////// ex  "id":["ribkjhe7vaigdggarhom","lvk1jummo8bn019reqam"] aka cloudinary public_id
exports.singleImgById = catchAsync(async (req, res, next) => {
  const data = await cloudinary.api.resources_by_ids(req.body.id);
  res.status(201).json({
    status: "success",
    data,
  });
});

///////////DELETE single img by public_id  ////////////// ex  "id":["ribkjhe7vaigdggarhom","lvk1jummo8bn019reqam"] aka cloudinary public_id
exports.deleteImgById = catchAsync(async (req, res, next) => {
  const data = await cloudinary.api.delete_resources(req.body.id);
  res.status(201).json({
    status: "success",
    data,
  });
});

///////////Upload image  //////////////

exports.uploadIMG = catchAsync(async (req, res, next) => {
  let arr = [];
  if (req.files) {
    arr = req.files;
  }
  sizeArr = [];
  arr.filter((item) => {
    sizeArr.push(item.size);
  });
  
  const check = (arr) => {
    if (arr.some((e) => e > 1500000)) {
      return true;
    } else return false;
  };
  if (check(sizeArr)) {
    res.status(500).json({
      status: "File is to large",
      
    });
  } else {
    let getItems = await Promise.all(
      arr.map((item, index) => {
        const data = cloudinary.uploader.upload(item.path);
        return data;
      })
    );
  
    const sendResponse = () => {
      return new Promise(function (resolve, reject) {
        res.status(201).json({
          status: "success",
          getItems,
        });
      });
    };
  
    const deleteFiles = () => {
      arr.map((item, index) => {
        fs.unlinkSync(`${item.path}`);
      });
    };
  
    sendResponse().then(deleteFiles());
  }
  

});
