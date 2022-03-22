const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

const createcollege = async function(req,res){
try {
    const data = req.body
    clgName = data.name

    if(!Object.keys(data).length>0) return res.status(400).send({error:"give some data to create college"})

    if(!data.name) return res.status(400).send({error:"please enter name"})
    
    if(!data.fullName) return res.status(400).send({error:"please enter full name of college"})

    if(!data.logoLink) return res.status(400).send({error:"please enter logoLink"})
    
   const registeredCollege = await collegeModel.findOne({name:clgName})

   if(registeredCollege) return res.status(400).send({error:"College already registered"})
    
    let createCollege =await collegeModel.create(data)
    res.status(201).send({status:true, msg:createCollege})
}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
}
}


const collegeDetails = async function(req,res){
    try {
    const data = req.query
    const names = data.name

    if(!names) return res.status(400).send({error:"enter some data for filter"})

    let values = await collegeModel.find(data)

    if(!(values).length>0) return res.status(400).send({error:"College not found"})
    
    let id = values[0]._id

    let listOfIntern = await internModel.find({collegeId:id, isDeleted:false}).select({id:1, name:1, email:1, mobile:1})

     let result = await collegeModel.find({_id:id})

    let obj = {
        name: result[0].name,
        fullName: result[0].fullName,
        logoLink: result[0].logoLink,
        interests: listOfIntern
    }
    res.status(200).send({data:obj})
    
}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
}
}


module.exports.collegeDetails = collegeDetails

module.exports.createcollege=createcollege