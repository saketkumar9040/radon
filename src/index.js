const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const multer= require("multer")
const route= require("./route/route")

const app=express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.use(multer().any())    // TO EXPORT MULTI-FORM DATA 

mongoose.connect("mongodb+srv://SAKET9040:jNgcddZO3PGUDOSU@cluster0.3ssva.mongodb.net/group5Database", {
    useNewUrlParser: true   //  GIVE ACCESS TO USE OLD AND NEW LIBRARY OF MONGOOSE
})
.then(()=>console.log("DataBase Connected Successfully"))
.catch((err)=>console.log(err.message))

app.use("/" ,route)// GLOBAL MIDDLEWARE

app.listen(process.env.PORT || 3000, function () {   //  TO CONNECT 
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});


