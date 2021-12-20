const { query } = require('express');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')
const Obiectiv = require('../models/obiectiveModel');
const CategorieObiectiv = require('../models/categoriiObiectiveModel');
const Sat = require('../models/sateModel');
const {cloudinary} = require('../utils/cloudinary');


///CREATE obiectiv
exports.createObiectiv = catchAsync(async (req, res, next) => {
    
    const categorie = await CategorieObiectiv.find().where('_id').in(req.body.categorie).exec();
    const sat = await Sat.findOne({_id:req.body.sat}).exec();
    // console.log(req.body.categorie,`categorie: `, categorie);
    // console.log(req.body.sat,`sat: `, sat);
    let obiectivObj= {}
    
    obiectivObj.nume = req.body.nume;
    obiectivObj.categorie = categorie
    obiectivObj.sat=sat;
    obiectivObj.user = req.body.user;
    obiectivObj.nume_en = req.body.nume_en;
    obiectivObj.nume_de = req.body.nume_de;
    obiectivObj.adresa = req.body.adresa;
    obiectivObj.tel = req.body.tel;
    obiectivObj.photo = req.body.photo;
    obiectivObj.obs = req.body.obs;
    obiectivObj.obs_de = req.body.obs_de;
    obiectivObj.obs_en = req.body.obs_en;
    obiectivObj.location = req.body.location;
    // console.log(obiectivObj);
    // console.log(req.body.photo);
    const newObiectiv = await Obiectiv.create(obiectivObj);
    res.status(201).json({
      status: 'success',
      data: {
        newObiectiv,
      },
    });
  });

///GET all obiectiv

exports.getObiective = catchAsync(async (req, res, next) => {
  const obiective = await Obiectiv.find()
  
    res.status(200).json({
      obiective
    });
  });

///GET SPECIFIC obiectiv
exports.getSpecificObiectiv = catchAsync(async (req, res, next) => {
  const obiectiv = await Obiectiv.findById(req.params.id)
  if (!obiectiv) {
    return next(new AppError("No obiectiv found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { 
      obiectiv
     }
  });

});

///DELETE SPECIFIC obiectiv
exports.deleteObiectiv = catchAsync(async (req, res, next) => {
  const obiectiv = await Obiectiv.findByIdAndDelete(req.params.id);

  if (!obiectiv) {
    return next(new AppError("No obiectiv found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});

///UPDATE Pics for SPECIFIC obiectiv
exports.updatePicsObiectiv = catchAsync(async (req, res, next) => {
  
  let arr=[]
  
  const obiectiv = await Obiectiv.findByIdAndUpdate(req.params.id, {$push: {'photo': req.body.data.photo}}, {
    new: true,
    runValidators: true
  });

  if (!obiectiv) {
    return next(new AppError("No obiectiv found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    obiectiv
  });
});

///UPDATE SPECIFIC obiectiv
exports.updateObiectiv = catchAsync(async (req, res, next) => {
  console.log(req.body.data);
  console.log(req.params.id);
  let arr=[]
  
  const obiectiv = await Obiectiv.findByIdAndUpdate(req.params.id, req.body.data, {
    new: true,
    runValidators: true
  });
  

  if (!obiectiv) {
    return next(new AppError("No obiectiv found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    obiectiv
  });
});


///DELETE pic from SPECIFIC obiectiv
exports.delPicfromObiectiv = catchAsync(async (req, res, next) => {
  
  const obiectivId = req.params.id;
  const obiectivPhotoID = req.params.photoId;
  const obiectivPublic_id = req.params.public_id;

  const delCloudinary = () =>{
    return new Promise (async(resolve,reject)=>{
      await cloudinary.api.delete_resources(obiectivPublic_id)
    })
  }
  const delDbEntry = async() =>{
    const obiectiv = await Obiectiv.findByIdAndUpdate({_id:obiectivId},
      {$pull: {photo: {_id: obiectivPhotoID}}}, 
      {multi: true}
      );
    if (!obiectiv) {
      return next(new AppError("No obiectiv found with that ID", 404));
    }
  }
  delCloudinary().then(delDbEntry()).catch(err=>console.log(err))

  res.status(200).json({
    status: "success",
    
  });
});
  