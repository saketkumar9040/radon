///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////    REQUIRED   MODULES     ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const mongoose=require("mongoose")
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////     CREATE   BLOG       /////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const createBlog = async (req, res) => {
  try {
    let data = req.body;
    if (Object.keys(data).length ==0) {
      return res.status(400).send({ status: false, msg: "no Data Entered" });
    }
    if (!data.title) {
      return res.status(400).send({ status: false, msg: "no Title Entered" });
    }
    if (!data.body) {
      return res.status(400).send({ status: false, msg: "no Body Entered" });
    }
    if (!data.authorId) {
      return res
        .status(400)
        .send({ status: false, msg: "no AuthorId Entered" });
    }
  if (!data.category) {
    return res
      .status(400)
      .send({ status: false, msg: "no Category Entered" });
  }
    if (
      !mongoose.isValidObjectId(data.authorId)//for incorrect authorId format
    ) {
      return res
        .status(400)
        .send({ status: false, msg: " authorId Is Incorrect" });
    }

    let token = req.headers["x-api-key"];
    if(!token){token=req.headers["x-Api-Key"]}
    if(!token){
      return res.status(400).send({ status: false, msg: "token must be present in headers" });
    }
    let decodedToken = jwt.verify(token, "group-16");
    if (decodedToken.authorId != data.authorId)
      return res.status(401).send({ status: false, msg: 'author Logged in and author Id entered are different' });

    let authId = await authorModel.findById({_id:data.authorId});
    if (!authId) {
      return res
        .status(404)
        .send({ status: false, msg: "no Such Author Exists" });
    }
    if(data.isDeleted){
      if(data.isDeleted===true){
        let deletedAt=new Date()
          data.deletedAt=deletedAt
        
      }
    }
    if(data.isPublished){
      if(data.isPublished===true){
        let publishedAt=new Date()
        data.publishedAt=publishedAt
      }
    }
    let blogData = await blogModel.create(data);
    let createdData = await blogModel.find(blogData).select({ authorId: 0});
     return res.status(201).send({ status:true,data: createdData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////     GET    BLOGS    BY    QUERY    PARAMS      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 
const getBlogs = async function (req, res) {
  try {
    let data = req.query;
    
    let filter = { isDeleted: false, isPublished: true };

    if (Object.keys(data).length == 0) {
      let allBlogs = await blogModel.find(filter);
      res.status(200).send(allBlogs);
    } else {
      if (data.tags) {
    
        data.tags = { $in: data.tags.split(',') };
      
    }

      if (data.subcategory) {
        data.subcategory = { $in: data.subcategory.split(',') };
      }

      filter['$or'] = [
        { authorId: data.authorId },
        { category: data.category },
        { subcategory: data.subcategory },
        { tags: data.tags },
      ];

      let allBlogs = await blogModel.find(filter);

      if (allBlogs.length == 0) {
        return res.status(404).send({ status: false, msg: 'blogs not found' });
      }

      res.status(200).send(allBlogs);
    }
  } catch (err) {
    res.status(500).send({ status:false, msg: err.message });
  }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////    UPDATE   BLOG   BY   ID    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateBlog = async (req, res) =>{
  try {
    let blogData = req.body;
    let blogId = req.params.blogId;
    
    if (Object.keys(blogData).length==0) {
      return res.status(400).send({ status: false, msg: "No Data Entered" });
    }
    if (!blogId) {
      return res.status(400).send({ status: false, msg: "No Blog Id Entered" });
    }

    if (!mongoose.isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg:" blogId Is Incorrect" });
    }

    let token = req.headers["x-api-key"];
    if(!token){token=req.headers["x-Api-Key"]}
      let decodedToken = jwt.verify(token, "group-16");
 
    
    let verifyAuthor= await blogModel.findOne({_id:blogId}).select({authorId:1})
    if(!verifyAuthor){return res.status(404).send({status:false,msg:"author Has No Such Blogs"})}
    if(verifyAuthor.authorId!=decodedToken.authorId){
      return res.status(401).send({status:false,msg:"author Is Not Authorised For The Modification Of This Blog"})
    }
  
    let updatedBlog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      {
        $push: { tags: blogData.tags, subcategory: blogData.subcategory },
        $set: {
          body: blogData.body,
          title: blogData.title,
          category: blogData.category,
          publishedAt: Date(),
          isPublished: true,
        },
      },
      { new: true })
      console.log(updatedBlog)
    

    if (!updatedBlog) {
      return res
        .status(400)
        .send({ status: false, msg: "no Such  Blog Exists" });
    }
 
      return res
        .status(200)
        .send({ status: false, msg: updatedBlog });
    
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  } 
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////    DELETE  BLOG  BY  ID      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteBlogById = async (req,res) => {
  try {
    let blogId = req.params.blogId;
    if (!blogId){
      return res
        .status(400)
        .send({ status: false, message: "please Enter The Blog Id" });
    }
    if (!mongoose.isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: " blogId Is Incorrect" });
    }
    let token = req.headers["x-api-key"];
    if(!token){token=req.headers["x-Api-Key"]}
    let decodedToken = jwt.verify(token, "group-16");
    
    let verifyAuthor=await blogModel.findById({_id:blogId}).select({authorId:1})
    if(!verifyAuthor){return res.status(404).send({status:false,msg:"author Has No Such Blogs"})}
    if(verifyAuthor.authorId!=decodedToken.authorId){return res.status(401).send({status:false,msg:"author Is Not Authorised For The Modification Of This Blog"})}
  
    let deletedBlog = await blogModel.findOneAndUpdate(
      {_id: blogId, isDeleted: false },
      { isDeleted: true,deletedAt:new Date()},
      { new: true }
    );
    console.log(deletedBlog)
    if(deletedBlog==null){ return res.status(404).send({ status: true, data: "no such blog exists" }); }
   return res.status(200).send({ status: true, data: "blog is deleted" });
   

  }
   catch (err) {
   return res.status(500).send({ status: false, msg: err.message });
  }
}
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////   DELETE   BLOGS    BY  QUERY   PARAM    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteBlogByQueryParams = async (req, res) => {
  try {
    let data = req.query;
    let authorId=data.authorId

    if (Object.keys(data).length == 0)
      return res.status(400).send({ status: false, msg: 'please enter the query ' });
 
      let token = req.headers["x-api-key"];
      if(!token){token=req.headers["x-Api-Key"]}
      let decodedToken = jwt.verify(token, "group-16");
      
      // let verifyAuthor=await blogModel.findById({authorId:decodedToken.authorId})
      // if(!verifyAuthor){return res.status(404).send({status:false,msg:"author Has No Such Blogs for deletion"})}
      if(data.authorId){
      if(authorId!=decodedToken.authorId){
       return res.status(400).send({status:false,msg:"author is not authorized for deletion"})
      }
    }
    let filter = { isDeleted: false ,authorId:decodedToken.authorId};//adding authorId here because it will filter out 
                                                                     //all the blogs of different authors.
    if (data.tags) {
      data.tags = { $in: data.tags.split(',') };
    }
    if (data.subcategory) {
      data.subcategory = { $in: data.subcategory.split(',') };
    }

    filter['$or'] = [                  //here it will take any of the query or all queries if entered in req.body
      { category: data.category },
      { subcategory: data.subcategory },
      { tags: data.tags },
      { isPublished: data.isPublished },
    ];

    const checkBlogs = await blogModel.find(filter).select({authorId:1})
    if (checkBlogs.length== 0)
      return res.status(404).send({ status: false, msg: 'no such blog exists' });

    const deletedData = await blogModel.updateMany(filter, {
      $set: {
        isDeleted: true,
        deletedAt: Date(),
      },
    });

    res.status(200).send({
      status: true,
      data: 'successful deletion of blogs',
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////    MODULE  EXPORTED   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogByQueryParams =deleteBlogByQueryParams;