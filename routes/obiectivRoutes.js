const express = require("express");
const obiectivCotroller = require('../controllers/obiectivController');
const trackCotroller = require('../controllers/trackController');
const mestesugariController = require('../controllers/mestesugariController');
const router = express.Router();
const multer  = require('multer')
const {authUser, authRole} = require('../AuthConfig/auth/authMiddleware')


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './misc'); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  
const upload = multer({ storage: fileStorageEngine });

// router
// .route("/convertTrack")
// .post(authRole('super'),upload.single("file"),trackCotroller.convertTrack)//convert tracks

/////////////TRACK CONVERTER////////////////////
router
.route("/convertTrack")
.post(authRole('super'),upload.single("file"),trackCotroller.convertTrack)//convert tracks

router
.route("/getTracks")
.get(authUser,trackCotroller.getAllTracks)//get all tracks
router
.route("/getTrack/:id")
.get(authUser,trackCotroller.getTrackById)//get all tracks

router
.route("/track/delete/:id")
.delete(authRole('super'),trackCotroller.deleteTrackById)//delete obiectiv by id

/////////////OBIECTIVE TURISTICE/ISTORICE////////////////////
router
.route("/obiectiv/add")
.post(authRole('super'),obiectivCotroller.createObiectiv)//create obiectiv
router
.route("/obiectiv/delete/:id")
.delete(authRole('super'),obiectivCotroller.deleteObiectiv)//delete obiectiv by id
router
.route("/obiectiv/:id/delete/:photoId/photo/:public_id")
.delete(authRole('super'),obiectivCotroller.delPicfromObiectiv)//delete photo from obiectiv by id
router
.route("/obiectiv/update/:id")
.post(authRole('super'),obiectivCotroller.updateObiectiv)//update obiectiv id
router
.route("/obiectiv/updatepics/:id")
.post(authRole('super'),obiectivCotroller.updatePicsObiectiv)//update obiectiv id
router
.route("/")
.get(authUser,obiectivCotroller.getObiective)//get all obiective
router
.route("/:id")
.get(authUser,obiectivCotroller.getSpecificObiectiv)//get single obiectiv
/////////////OBIECTIVE TURISTICE/ISTORICE////////////////////

/////////////MESTESUGARI////////////////////
router
.route("/mestesugar/add")
.post(authRole('super'),mestesugariController.createMestesugar)//create mestesugar
router
.route("/mestesugar/view")
.get(authUser,mestesugariController.getAllMestesugari)//get all mestesugari
router
.route("/mestesugar/search")
.get(authUser,mestesugariController.searchAllMestesugari)//get all mestesugari
router
.route("/mestesugar/:id")
.get(authUser,mestesugariController.getSpecificMestesugar)//get all mestesugari
router
.route("/mestesugar/delete/:id")
.delete(authRole('super'),mestesugariController.deleteMestesugar)//del mestesugar by id
router
.route("/mestesugar/update/:id")
.post(authRole('super'),mestesugariController.updateMestesugar)//update mestesugar by id
router
.route("/mestesugar/updatepics/:id")
.post(authRole('super'),mestesugariController.updatePicsMestesugar)//update pics mestesugar by id
router
.route("/mestesugar/:id/delete/:photoId/photo/:public_id")
.delete(authRole('super'),mestesugariController.delPicfromMestesugar)//update pics mestesugar by id
/////////////MESTESUGARI////////////////////



module.exports = router;