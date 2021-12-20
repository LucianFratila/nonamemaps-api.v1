const admin = require('../../firebase-config')
const db = admin.firestore()
class Middleware{
    async decodeToken(req,res,next){
        
       
       if (req.headers.authorization) {
        try {
            
            const token = req.headers.authorization.split(' ')[1]
            const decodeValue = await admin.auth().verifyIdToken(token)
            // console.log(decodeValue.uid);
            db.collection('users').doc(decodeValue.uid).get().
                then(res=>{
                    const data = res.data()
                    console.log(data.roles);
                }).catch(err=>console.log(err))
            
            if (decodeValue) {
                return next()
            }
    
            
        } catch (error) {
            return res.json({message:'error'})
        }
           
       } else {
        return res.json({message:'Unauthorized'}) 
       }
        
        
    }
}

module.exports = new Middleware();