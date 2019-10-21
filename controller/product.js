const formidable = require("formidable")
const _ = require("lodash");
const fs = require('fs');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.productById = (req,res,next,id)=>{
    Product.findById(id).exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({error:"product not found"});
        }
        req.product=product;
        next();
    })
}

exports.read = (req,res) => {
    req.product.photo = undefined
    return res.json(req.product);
}


exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err, fields, files)=>{
        if(err){
            return res.status(400).json({error: "Image could not be uploaded"})
        }
        // ERROR Handlerer for Insert Data
        const {name,description,price, category} = fields
        if (!name){
            return res.status(400).json({error:"please insert name product"})
        }
        else if(!price){
            return res.status(400).json({error:"please insert price product"})
        }
        else if(!category){
            return res.status(400).json({error:"please insert category product"})
        }
        let product = new Product(fields)

        if(files.photo){
            if(files.photo.size > 1000000){
                res.status(400).json({
                    error:"Image size must less than 1mb !!!"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}

exports.remove = (req,res) =>{
    let product = req.product
    product.remove((err, deleteProduct)=>{
        if(err){
            return res.status(400).json({error:errorHandler(err)});
        }
        res.json({
            message:"product has been deleted"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err, fields, files)=>{
        if(err){
            return res.status(400).json({error: "Image could not be uploaded"})
        }
        // ERROR Handlerer for Insert Data
        const {name,description,price, category} = fields
        if (!name){
            return res.status(400).json({error:"please insert name product"})
        }
        else if(!price){
            return res.status(400).json({error:"please insert price product"})
        }
        else if(!category){
            return res.status(400).json({error:"please insert category product"})
        }

        let product = req.product
        product = _.extend(product, fields)

        if(files.photo){
            if(files.photo.size > 1000000){
                res.status(400).json({
                    error:"Image size must less than 1mb !!!"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })
    })
}