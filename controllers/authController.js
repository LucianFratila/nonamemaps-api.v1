const { query } = require("express");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const admin = require("../firebase-config");
const db = admin.firestore()

///CREATE categorie
exports.login = async (req, res, next) => {
    if (req.headers.authorization) {
        // console.log(req.headers.authorization);
        try {
            const token = req.headers.authorization.split(' ')[1]
            
            const decodeValue = await admin.auth().verifyIdToken(token)
            const resfb = await db.collection('users').doc(decodeValue.uid).get()
            const data = resfb.data()
            if (data.roles==='super') {    
                res.status(201).send({
                    message: 'Success'
                 })
            }else{
                res.status(403).send({
                    message: 'Unauthorized'
                 }) 
            }            
        } catch (error) {
            return res.status(500).send({
                message: 'Login Refused'
             })
        } 
        
    }else{
        return res.status(403).send({
            message: 'No token provided!'
         }) 
    }
  
};
