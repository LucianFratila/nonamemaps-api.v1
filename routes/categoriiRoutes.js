const express = require("express");
const categorieController = require('../controllers/categorieController');
const router = express.Router();
const {authUser, authRole} = require('../AuthConfig/auth/authMiddleware')

////////CATEGORIE TRASEE/////////////
router
.route("/addcatTracks")
.post(authRole('super'),categorieController.createCatTrack)//create cat track
router
.route("/catTracks/")
.get(authUser,categorieController.getCatTracks)//get all cat tracks
router
.route("/catTracks/:id")
.get(authUser,categorieController.getSpecificCatTrack)//view specific cat track
router


////////CATEGORIE TRASEE/////////////


////////CATEGORIE OBIECTIVE/////////////
router
.route("/obiective/add")
.post(authRole('super'),categorieController.createCategorie)//create categorie
router
.route("/all")
.get(authUser,categorieController.getOnlyCategorie)//get categorie
router
.route("/obiective/")
.get(authUser,categorieController.getCategorie)//get categorie
router
.route("/obiective/:id")
.get(authUser,categorieController.getSpecificCategorie)//view specific categorie
router
.route("/obiective/delete/:id")
.delete(authRole('super'),categorieController.deleteCategorie)//del categorie
////////CATEGORIE OBIECTIVE/////////////

////////CATEGORIE SATE/////////////
router
.route("/sat/add")
.post(authRole('super'),categorieController.createSat)//create sat
router
.route("/sate")
.get(authUser,categorieController.getSat)//view sate
router
.route("/sat/:id")
.get(authUser,categorieController.getSpecificSat)//view specific sat
router
.route("/sate/position")
.get(authUser,categorieController.getSatePosition)//view sate
router
.route("/sat/delete/:id")
.delete(authRole('super'),categorieController.deleteSat)//delete sat by id
router
.route("/sat/update/:id")
.post(authRole('super'),categorieController.updateSat)//update sat by id
router
.route("/sat/updatepics/:id")
.post(authRole('super'),categorieController.updatePicsObiectiv)//update sat by id
router
.route("/sat/:id/delete/:photoId/photo/:public_id")
.delete(authRole('super'),categorieController.delPicfromSat)//delete photo from obiectiv by id
////////CATEGORIE SATE/////////////


////////CATEGORIE MESTESUGARI/////////////
router
.route("/mestesugar/add")
.post(authRole('super'),categorieController.createCategorieMestesugar)//create cat mestesugar
router
.route("/mestesugari")
.get(authUser,categorieController.getCategorieMestesugar)//view cat mestesugar
////////CATEGORIE MESTESUGARI/////////////



module.exports = router;