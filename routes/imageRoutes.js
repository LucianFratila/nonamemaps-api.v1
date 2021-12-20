const express = require("express");
const router = express.Router();
const imgController = require('../controllers/imgController')
const {authUser, authRole} = require('../AuthConfig/auth/authMiddleware')
const multer  = require('multer')

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './misc'); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  
const upload = multer({ storage: fileStorageEngine,limits:{fileSize:1500000} });


router
.route("/allimgs/:limit")
.get(authUser,imgController.getAllImg)//get all IMG

router
.route("/image")
.get(authUser,imgController.singleImgById)// IMG by public_id

router
.route("/image_delete")
.delete(authRole('super'),imgController.deleteImgById)// IMG by public_id

router
.route("/image_upload")
.post(authRole('super'),upload.array("images", 6),imgController.uploadIMG)// IMG by public_id



module.exports = router;