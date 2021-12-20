const admin = require('../../firebase-config')
const db = admin.firestore()
const authUser = async (req,res,next) => {
    
    if (req.headers.authorization) {

        try {
            const token = req.headers.authorization.split(' ')[1]
            
            const decodeValue = await admin.auth().verifyIdToken(token)
            // console.log(decodeValue);
            if (decodeValue) {    
            next()
            }else{
                res.status(403).send({
                    message: 'Unauthorized'
                 }) 
            }            
        } catch (error) {
            return res.status(500).send({
                message: 'Internal error'
             })
        } 
        
    }else{
        return res.status(403).send({
            message: 'No token provided!'
         }) 
    }
         
}

const authRole = (role) => {
    
    return async (req,response,next) =>{
        if (req.headers.authorization) {

            const token = req.headers.authorization.split(' ')[1]
            const decodeValue = await admin.auth().verifyIdToken(token)
            db.collection('users').doc(decodeValue.uid).get().
                then(res=>{
                    const data = res.data()
                    // console.log('aici', data);
                    if (!data) {
                        response.status(401)
                        return response.json({message: 'Unauthorized'})
                    } 
                    if (data.roles !== role) {
                        response.status(401)
                        return response.json({message: 'Unauthorized'}) 
                    }
                    next()
                }).catch(err=>console.log(err))
            
        }
    }
}

module.exports = {
    authUser,
    authRole
}