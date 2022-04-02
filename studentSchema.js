const mongoose = require('mongoose')

// mongoose schema
const studentSchema = mongoose.Schema({
    name : {type : String, required : true},
    email : {type: String, required : true},
    standard : {type: String, required: true}
})

module.exports = mongoose.model('Student', studentSchema)