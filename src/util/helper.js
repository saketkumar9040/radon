let today=new Date;
let month=["january","feburary","march","april","may","june","july","august","september","october","november","december"]
let thisMonth=month[today.getMonth()];
let getbatchinfo=function(){
    console.log('hi i am saket kumar,Rodon batch, Week-3 Day-3, the topic for today is Nodejs module system')
}



module.exports.today = today
 module.exports.thisMonth = thisMonth
module.exports.getbatchinfo = getbatchinfo