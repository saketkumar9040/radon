let today=function(){
    let d=new Date;
    console.log(d)
}
// console.log(today())
let month=function(){
    let m=["january","feburary","march","april","may","june","july","august","september","october","november","december"]
    let d=new Date;
     let thisMonth=m[d.getMonth()]
     console.log(thisMonth)
}
// console.log(month())

let getbatchinfo=function(){
    let inf='hi i am saket kumar,Rodon batch, Week-3 Day-3, the topic for today is Nodejs module system';
    console.log(inf)
}




module.exports.today = today
 module.exports.month = month
module.exports.getbatchinfo = getbatchinfo