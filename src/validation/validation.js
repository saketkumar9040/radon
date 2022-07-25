const mongoose=require("mongoose")
const bcrypt= require("bcrypt")

const isValid =(value)=>{
    if(typeof value==undefined || typeof value==null) return false
    if(typeof value=="string" && value.trim().length==0) return false
    if(value==null) return false
    return true
}

const isValidBody=(body)=>{
    if(mongoose.isValidObjectId(body).length==0)
    return false
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


const securepw= async (pw)=>{
let saltrounds=10
const hashpass= await bcrypt.hash(password, saltrounds)
return hashpass
}

const comparePw= async (pw,hash)=>{
    const compare= await bcrypt.compare(pw,hash)
    return compare
}
const isValidImg=(img)=>{
    if(/[^\s]+(\.(?i)(jpg|png|gif|bmp))$/.test(img))
    return true
}
module.exports={isValid,isValidStreet,isValidPincode,isValidPassword,isValidPh,isValidMail,isValidName,isValidBody,securepw,comparePw,isValidImg}
