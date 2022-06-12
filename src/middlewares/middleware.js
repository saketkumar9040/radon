const express= require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const mid1=(req,res,next)=>{
       let now =new Date();
       let year=now.getFullYear();
       let month=now.getMonth();
       let day=now.getDate();
       let hours=now.getHours();
       let minutes=now.getMinutes();
       let seconds=now.getSeconds();
       let ip=req.ip;
       let route= req.url;
       console.log(day+"-"+(month+1)+"-"+year+"  "+hours+":"+minutes+":"+seconds+" , "+ip+" , "+route)
       res.send("current Status Updated")
       }
    

     




module.exports.mid1=mid1