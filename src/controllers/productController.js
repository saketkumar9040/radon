const productModel = require("../models/productModel")
const { isValid, isValidBody, isValidCurrency, isValidSize, isValidTName, isValidImg, isValidName, isValidObjectId } = require("../validation/validation")
const { uploadFile } = require("../aws/aws")

const createProduct = async (req, res) => {
    try {
        let data = JSON.parse(JSON.stringify(req.body))
        let files = req.files
        if (isValidBody(data)) { return res.status(400).send({ status: false, message: "Body Should Not Be Empty" }) }
        let { title, description, price, currencyId, currencyFormat, style, availableSizes, isFreeShipping, installments } = data

        let arr = ["title", "description", "price", "availableSizes", "style"]
        for (let i = 0; i < arr.length; i++) {
            if (!((arr[i] in data))) {
                return res.status(400).send({ status: false, message: `${arr[i]} is required` })
            }
        }
        if (!isValid(title)) return res.status(400).send({ status: false, message: `Title should not be empty` })
        if (!isValidTName(title)) return res.status(400).send({ status: false, message: `${title} is not a valid title` })
        let title1 = title.split(" ").filter(e => e).join(" ")
        data.title = title1
        if (await productModel.findOne({ title: title })) return res.status(400).send({ status: false, message: `${title} already  exists` })

        if (!isValid(description)) return res.status(400).send({ status: false, message: `Description should not be empty` })
        data.description = description.split(" ").filter(e => e).join(" ")

        if (!isValid(price)) return res.status(400).send({ status: false, message: `price should not be empty` })
        if (isNaN(parseInt(price))) return res.status(400).send({ status: false, message: "Price Should Be A Number" })
        if (currencyId) {
            if (!(currencyId === "INR" || currencyId === "inr")) return res.status(400).send({ status: false, message: `Currency Id should Be INR` })
            data.currencyId = currencyId.toUpperCase()
        }
        data.currencyId = "INR"
        if (currencyFormat) {
            if (!(currencyFormat === "₹")) return res.status(400).send({ status: false, message: `Currency format should Be ₹ ` })
        }
        data.currencyFormat = "₹"

        if (!isValid(style)) { return res.status(400).send({ status: false, message: "Style should not be empty" }) }
        if (!isValidName(style)) { return res.status(400).send({ status: false, message: `${style} is not a valid style name` }) }


        let sizes = availableSizes.toUpperCase().trim().split(",").map(e => e.trim())
        for (let i = 0; i < sizes.length; i++) {
            if (!isValidSize(sizes[i])) { return res.status(400).send({ status: false, message: `The size accepted only from these (${sizes[i]}) S, XS, M, X, L, XXL, XL" ` }) }
        }
        data.availableSizes = sizes

        if ("isFreeShipping" in data) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "isFreeShipping should not be empty" })
            if (!(isFreeShipping === "true" || isFreeShipping === "false")) return res.status(400).send({ status: false, message: "isFreeShipping should be only True False" })
            data.isFreeShipping = isFreeShipping
        }
        if ("installments" in data) {
            if (!isValid(installments)) return res.status(400).send({ status: false, message: "Installments should not be empty" })
            if (isNaN(parseInt(installments))) return res.status(400).send({ status: false, message: "Installments should be in a number" })
        } else { data.installments = null }

        if (files && files.length > 0) {
            if (!(isValidImg(files[0].mimetype))) {
                return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG" })
            }
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL
        } else {
            return res.status(400).send({ status: false, message: "Product image is required" })
        }
        data.deletedAt = null
        let saveddata = await productModel.create(data)
        res.status(201).send({ status: true, message: "Product Created Successfully", data: saveddata })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// title: {string, mandatory, unique},
//   description: {string, mandatory},
//   price: {number, mandatory, valid number/decimal},
//   currencyId: {string, mandatory, INR},
//   currencyFormat: {string, mandatory, Rupee symbol},
//   isFreeShipping: {boolean, default: false},
//   productImage: {string, mandatory},  // s3 link
//   style: {string},
//   availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]},
//   installments: {number},
//   deletedAt: {Date, when the document is deleted}, 
//   isDeleted: {boolean, default: false},
//
//—————————————————————————————————————————getProductByFilter————————————————————————————————————————————————————
const getProducts = async function (req, res) {
    let query = req.query
    console.log(query)
    let obj = {
        isDeleted: false
    }
    const { size, name, priceGreaterThan, priceLessThan } = query
    if (size) {
        let sizes = size.toUpperCase().trim().split(",").map(e => e.trim())
        for (let i = 0; i < sizes.length; i++) {
            if (!isValidSize(sizes[i])) { return res.status(400).send({ status: false, message: `The (${sizes[i]}) size is not from these [S,XS,M,X,L,XXL,XL] ` }) }
        }
        obj.availableSizes = { $all: sizes }
    }



    let data = await productModel.find(obj)
    if (data.length == 0) {
        return res.status(404).send({ status: false, message: "No data found" })
    }
    res.status(200).send({ status: true, data: data })
}

//—————————————————————————————————————————getProductById————————————————————————————————————————————————————————

const getProductById = async function (req, res) {
    let id = req.params.productId
    if (id.length == 0 || id == ':productId') return res.status(400).send({ status: false, message: "Enter product id in params" })
    if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Enter Id in valid Format" })

    let data = await productModel.findById(id)
    if (!data) return res.status(404).send({ status: false, message: "No Data found wih this ID" })
    if (data.isDeleted == true) { return res.status(404).send({ status: false, message: "This product is Deleted" }) }
    res.status(200).send({ status: true, data: data })
}
//—————————————————————————————————————————UpdateProductById—————————————————————————————————————————————————————
const updateProduct = async function (req, res) {
    try {
        let id = req.params.productId
        if (id.length == 0 || id == ':productId') return res.status(400).send({ status: false, message: "Please enter productId in params" })
        if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Enter Id in valid Format" })

        let data = await productModel.findById(id)
        if (!data) return res.status(404).send({ status: false, message: "No Data found wih this ID" })
        if (data.isDeleted == true) { return res.status(404).send({ status: false, message: "This product is Deleted" }) }

        let body = req.body
        let files = req.files
        if (!files) {
            if (isValidBody(body)) return res.status(400).send({ status: false, message: "Pls enter Some Data To update" })
        }
        let { title, description, price, productImage, style, availableSizes, installments, isFreeShipping } = body

        if ("title" in body) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Title should not be empty" })
            if (!isValidTName(title)) return res.status(400).send({ status: false, message: "Enter Valid Title Name" })
            if (await productModel.findOne({ title: title })) return res.status(400).send({ status: false, message: `${title} is already exists` })
            let title1 = title.split(" ").filter(e => e).join(" ")
            data.title = title1
        }
        if ("description" in body) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "Description should not be empty" })
            data.description = description.split(" ").filter(e => e).join(" ")
        }
        if ("price" in body) {
            if (!isValid(price)) return res.status(400).send({ status: false, message: "Price should not be empty" })
            if (isNaN(parseInt(price))) return res.status(400).send({ status: false, message: "Price Should Be A Number" })
            data.price = price
        }

        if ("isFreeShipping" in body) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "isFreeShipping should not be empty" })
            if (!(isFreeShipping === "true" || isFreeShipping === "false")) return res.status(400).send({ status: false, message: "isFreeShipping should be only True False" })
            data.isFreeShipping = isFreeShipping
        }
        if( typeof productImage === "string" || typeof productImage === "string") return res.status(400).send({status:false,message:"ProductImg should be of typeFiles"})
        if (files && files.length > 0) {
            if (!(isValidImg(files[0].mimetype))) {
                return res.status(400).send({ status: false, message: "Image Should be of JPEG/ JPG/ PNG" })
            }
            let uploadedFileURL = await uploadFile(files[0])
            data.productImage = uploadedFileURL
        }
        if ("style" in body) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "Style should not be empty" })
            if (!isValidTName(style)) return res.status(400).send({ status: false, message: "Pls Enter Valid Style Category" })
            data.style = style
        }
        if ("availableSizes" in body) {
            if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "AvailableSizes should not be empty" })
            let sizes = availableSizes.toUpperCase().trim().split(",").map(e => e.trim())
            for (let i = 0; i < sizes.length; i++) {
                if (!isValidSize(sizes[i])) return res.status(400).send({ status: false, message: `This Size ( ${sizes[i]} ) is not from these ['S', 'XS','M','X', 'L','XXL','XL']` })
            }
            let savedSize = await productModel.findById(id).select({ availableSizes: 1, _id: 0 })
            let value = savedSize["availableSizes"].valueOf()
            for (let i = 0; i < sizes.length; i++) {
                if (value.includes(sizes[i])) {
                    return res.status(400).send({ status: false, message: `Size ${sizes[i]} is already Exists Choose Another One` })
                }
                else { await productModel.findOneAndUpdate({ _id: id }, { $push: { availableSizes: sizes[i] } },{new:true}) }
            }
        }

        if ("installments" in body) {
            if (!isValid(installments)) return res.status(400).send({ status: false, message: "installments should not be empty" })
            if (isNaN(parseInt(installments))) return res.status(400).send({ status: false, message: "Installments Should be Of Number Type" })
            data.installments = installments
        }

        data.save()
        res.status(200).send({ status: false, message: "Updated Successfully", data: data })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//—————————————————————————————————————————delProductById————————————————————————————————————————————————

const delProductById = async function (req, res) {
    let id = req.params.productId
    if (id.length == 0 || id == ':productId') return res.status(400).send({ status: false, message: "Enter product id in params" })
    if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Enter Id in valid Format" })

    let data = await productModel.findById(id)
    if (!data) return res.status(404).send({ status: false, message: "No Data found wih this ID" })
    if (data.isDeleted == true) { return res.status(404).send({ status: false, message: "This product is already Deleted" }) }

    date = new Date().toISOString()
    await productModel.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: date })

    res.status(200).send({ status: true, message: "Product is deleted Successfully" })

}



module.exports = { createProduct, getProductById, delProductById, updateProduct, getProducts }

