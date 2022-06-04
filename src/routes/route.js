const express = require('express');
const myHelper = require('../util/helper')
const underscore = require('underscore')
const lodash= require('lodash');
const { json } = require('express/lib/response');
const router = express.Router();


// router.get('/movies', function(req, res){
//   let movies=['The Shawshank Redemption' ,' The Godfather','The Dark Knight', 'The Godfather: Part II ','12 Angry Men','The Lord of the Rings', 'Pulp Fiction']
//   res.send(movies)
// });


router.get('/movies/:index', function(req, res){
    let movies=['The Shawshank Redemption' ,' The Godfather','The Dark Knight', 'The Godfather: Part II ','12 Angry Men','The Lord of the Rings', 'Pulp Fiction']
    for (let i=0;i<=movies.length;i++){
      let index=req.params.index;
       if(index <= movies.length && index>0){
             res.send(movies[index])
       }
       else{
         res.send('no such movies in the list')

       }}
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




  router.get('/film/:Id', function(req, res){
    let film=[
      {
        id: 1,
        name:'king'
  },
  {
     id: 2,
     name:'dost'
  },{
     id:3,
     name:'DDLJ'
  },
{
    id:4,
    name:'kite'
},{
   id:5,
   name:'fan'
}
]
for(let i=0;i<=film.length;i++){
  
let  index=req.params.Id
if(index <=film.length && index >0){
   res.send(film[index].name)
   break;
}else{
  res.send('no such movies')
}
}});

module.exports = router;
// adding this comment for no reason