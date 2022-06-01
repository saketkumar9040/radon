
let upper=function(){
    let text1="please convert me to upper case";
    console.log(text1.toLocaleUpperCase())   
}

let lower=function(){
    let text2="CAN YOU CONVERT ME TO LOWER CASE";
    console.log(text2.toLocaleLowerCase())   
}

let trimm=function(){
    let text3="     i got trimmed     ";
    console.log(text3)
    console.log(text3.trim())
}
module.exports.upper = upper
module.exports.lower=lower
module.exports.trimm = trimm