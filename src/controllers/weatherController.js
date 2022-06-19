let axios = require("axios");

let getTemperature = async (req, res) => {
  try {
    let places = [
      "Bengaluru",
      "Mumbai",
      "Delhi",
      "Kolkata",
      "Chennai",
      "London",
      "Moscow",
    ];
    let arrangedTemp=[];
    for(let i=0;i<places.length;i++){
      let options =await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${places[i]}&appid=127db29bd2c4a200bb75b375fcc3d46e`)
      let cityAndTemp={city:places[i],temp:options.data.main.temp}
      arrangedTemp.push(cityAndTemp)
    
    }
      
    //   for(let value of places){
    //   let options =await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${value}&appid=127db29bd2c4a200bb75b375fcc3d46e`)
    // let cityAndTemp={city:value,temp:options.data.main.temp}
    // arrangedTemp.push(cityAndTemp)
    //   }
 
    
    
    let arr=arrangedTemp.sort((a,b)=>{return a.temp-b.temp})
    console.log(arrangedTemp)
    res.status(200).send({data:arr})
    

    
  } catch (err) {
    res.status(403).send({ status: false, error:err.message
    
    });
  }
};

module.exports.getTemperature = getTemperature;
