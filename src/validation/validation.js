const mongoose=require("mongoose")
const bcrypt= require("bcrypt")

const isValid =(value)=>{
    if(typeof value==undefined || typeof value==null) return false
    if(typeof value=="string" && value.trim().length==0) return false
    if(value==null) return false
    return true
}

const isValidObjectId=(body)=>{
    if(mongoose.isValidObjectId(body))
    return true
}

const isValidBody=(body)=>{
    if(Object.keys(body).length==0)
    return true
}

const isValidName=(name)=>{
    if (/^[-a-zA-Z_:,.' ']{1,100}$/.test(name))
    return true
}

const isValidMail=(mail)=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return true
}

const isValidPh=(ph)=>{
    if (/^[0]?[6789]\d{9}$/.test(ph))
    return true
}

const isValidPassword = (pw) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/.test(pw))
        return true
}

const isValidPincode = (pin) => {
    if (/^[1-9][0-9]{5}$/.test(pin))
        return true
}

const isValidStreet =(street)=>{
    if(/^\d+\s[A-z]+\s[A-z]+/.test(street))
    return true
}

const isValidCurrency =(curr)=>{
    if(/^(\d{1,3})(,\d{1,3})*(\.\d{1,})?$/.test(curr))
    return true
}

const securepw= async (pw)=>{
let saltrounds=10
const hashpass= await bcrypt.hash(pw, saltrounds)
return hashpass
}

const comparePw= async (pw,hash)=>{
    const compare= await bcrypt.compare(pw,hash)
    return compare
}
const isValidImg=(img)=>{
    const reg = /image\/png|image\/jpeg|image\/jpg/;
    return reg.test(img)
}

const isValidSize=(size)=>{
    if(size=="S"|| size=="XS"||size=="M"||size=="X "||size=="L"||size=="XXL"||size== "XL")
    return true
}

const isValidTName = (name) => {
    let tName = name.trim()
    if (/^[A-Za-z0-9]+[A-Za-z0-9\u00C0-\u017F-' ]*$/.test(tName))
        return true
}

module.exports={isValid,isValidStreet,isValidPincode,isValidPassword,isValidPassword,isValidPh,isValidMail,isValidName,isValidBody,securepw,comparePw,isValidImg,isValidObjectId,isValidCurrency,isValidSize,isValidTName}
