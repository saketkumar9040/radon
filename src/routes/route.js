const express = require('express');
const myHelper = require('../util/helper')
const underscore = require('underscore')
const lodash= require('lodash');
const { json } = require('express/lib/response');
const router = express.Router();


router.get('/movies', function(req, res){
  let movies=['The Shawshank Redemption' ,' The Godfather','The Dark Knight', 'The Godfather: Part II ','12 Angry Men','The Lord of the Rings', 'Pulp Fiction']
  res.send(movies)
});


router.get('/movies/:index', function(req, res){
    let movies=['The Shawshank Redemption' ,' The Godfather','The Dark Knight', 'The Godfather: Part II ','12 Angry Men','The Lord of the Rings', 'Pulp Fiction']
    for (let i=0;i<=movies.length;i++){
      if (req.params.index==i){
        res.send(movies[i])
      }
       }
    });

    
router.get('/films', function(req, res){
    let films=[
         {
        id: 1,
        name: "The Shining"
       },
        {
        id: 2,
        name: "Incendies"
       }, 
       {
        id: 3,
        name: "Rang de Basanti"
       },
        {
        id: 4,
        name: "Finding Nemo"
       }]
       
    res.send((lodash.union(films)))
  });




  router.get('/films/:Id'), function(req, res){
    let pic=[
      {
        'id': 1,
        'name':'king'
  },
  {
    'id': 2,
    'name':'dost'
  },{
    'id':3,
    'name':'DDLJ'
  },
{
  'id':4,
 'name':'kite'
},{
  'id':5,
 'name':'fan'
}];
for(i=0;i<pic.length;i++){
  let fm=pic[i]
  if(req.params.Id===i){
    res.send(fm.name) 

  }
}
}

  

module.exports = router;
// adding this comment for no reason