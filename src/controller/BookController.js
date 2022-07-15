const aws= require("aws-sdk")
const bookModel=require("../models/bookModel")

const createBook = async function (req, res) {
    try {
   
       
 
aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

   })
}

let files= req.files
console.log(files)
if(files && files.length>0){

    let uploadedFileURL= await uploadFile( files[0] )
    
   // return res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
   let data = req.body;
   req.body.bookCover=uploadedFileURL
   let book = await bookModel.create(data);
   return res.status(201).send({ Status: true, message: "Success", data: book });
}
else{
    return res.status(400).send({ msg: "No file found" })
}
    
      
    }
    catch (err) {
        return res.status(500).send({ Staus: false, message: err.message });
    }

}

module.exports={createBook}