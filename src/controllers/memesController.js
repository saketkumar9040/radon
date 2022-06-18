const axios=require("axios")

let getMemes= async (req,res)=>{
 try{    
    let options={
        method:"get",
        url:`https://api.imgflip.com/get_memes`
    }
    let result=await axios(options);
    let data=result.data;
    res.status(200).send({status:true,data:data})
 }catch(err){
    res.status(403).send({status:false,msg:err.message})
 }
}

let createMemes=async (req,res)=>{
    try{
        let id=req.query.template_id;
        let text0=req.query.text0;
        let text1=req.query.text1;
        let options={
            method:"post",
            url:`https://api.imgflip.com/caption_image?template_id=${id}&text0=${text0}&text1=${text1}&username=chewie12345&password=meme@123`
        }
        let result=await axios(options);
        let data=result.data;
        res.status(200).send(data)

    }catch(err){
        res.status(403).send({status:false,msg:err.message})
    }
}





module.exports.getMemes=getMemes;
module.exports.createMemes=createMemes;