const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const csvtojson = require('csvtojson')
const Student = require('./studentSchema');

const app = express()

mongoose.connect('mongodb://localhost:27017/MongoExcelDemo').then(() => {
    console.log('database connected')
});


app.use(express.static('public'))    // static folder
app.set('view engine','ejs')             // set the template engine

// multer disk storage
var excelStorage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
         cb(null,'./public/excelUploads');      // file added to the public folder of the root directory
    },  
    filename:(req,file,cb)=>{  
         cb(null,file.originalname);  
    }  
});  
var excelUploads = multer({storage:excelStorage}); 

app.get('/',(req,res) => {
    console.log("demo");
       res.render('index.ejs');
})

// upload excel file and import in mongodb
app.post('/uploadExcelFile', excelUploads.single("uploadfile"), (req, res) =>{  
       importFile('./public' + '/excelUploads/' + req.file.filename);
            function importFile(filePath){
              //  Read Excel File to Json Data
                var arrayToInsert = [];
                csvtojson().fromFile(filePath).then(source => {

              // Fetching the all data from each row
                for (var i = 0; i < source.length; i++) {
                    console.log(source[i]["name"])
                    var singleRow = {
                        name: source[i]["name"],
                        email: source[i]["email"],
                        standard: source[i]["standard"],
                    };
                    arrayToInsert.push(singleRow);
                }

             //inserting into the table student
             Student.insertMany(arrayToInsert, (err, result) => {
                    if (err) console.log(err);
                        if(result){
                            console.log("File imported successfully.");
                            res.redirect('/')
                        }
                    });
                });
           }
})

app.listen(3000, () => {
     console.log('server started at port 3000')
})
