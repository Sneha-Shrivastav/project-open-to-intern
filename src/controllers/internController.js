const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")
const res = require("express/lib/response")


const intern = async function (req, res) {
    try {
    let input = req.body
    let email = input.email
    let mobile = input.mobile

    if (!Object.keys(input).length > 0) return res.status(400).send({ error: "Please enter some data" })

    if (!input.name) return res.status(400).send({ error: "please enter name" })


    if (!input.email) return res.status(400).send({ error: "please enter email" })

    if (!input.mobile) return res.status(400).send({ error: "please enter valid mobile number" })

    if (!input.collegeId) return res.status(400).send({ error: "please enter College Id" })

    const Email = input.email
    const validateEmail = function(Email){
        return /^[a-zA-Z0-9+_.-]+@[a-zA-Z.-]+$/.test(Email)
    }
    if(!validateEmail(Email)){
        return res.status(400).send({error:"Please enter valid email"})
    }

    const Mobile = input.mobile
    const validateMobile = function(Mobile){
        return /^([+]\d{2})?\d{10}$/.test(mobile)
    }
    if(!validateMobile(Mobile)){
        return res.status(400).send({error:"Please enter valid mobile"})
    }

    let college = req.body.collegeId
    let collegeId = await collegeModel.findById(college)

    if (!collegeId) return res.status(400).send({error:"please provide valid collegeId"})

    let collegeAvailable = await collegeModel.findOne({ _id: collegeId, isDeleted: false })

    if (!collegeAvailable) {
        res.status(404).send({error: "college not found"})
    }

    const emailAlreadyUsed = await internModel.findOne({email})

    if(emailAlreadyUsed) return res.status(400).send({status: false, msg: "email already registered"})

    
    const mobileAlreadyUsed = await internModel.findOne({mobile})

    if(mobileAlreadyUsed) return res.status(400).send({status: false, msg: "mobile already registered"})


    let data = await internModel.create(input)
    res.status(201).send({ status: true, msg: data })
}
catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
}
}



module.exports.intern = intern

