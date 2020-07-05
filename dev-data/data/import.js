const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const connectString = `mongodb://localhost:27017/natours`;

mongoose.connect(connectString,{
  useNewUrlParser :true,
  useCreateIndex : true,
  useFindAndModify : false,
  useUnifiedTopology: true 
})
.then(()=> console.log('connected'))
.catch(err=>console.log(err));


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`));

const importData = async ()=>{
    try {
        // await Tour.create(tours);
        await User.create(users, { validateBeforeSave : false});
        // await Review.create(reviews);
    } catch (error) {
        throw error;
    }
}


const deleteData = async ()=>{
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
    } catch (error) {
        throw error;
    }
}

if(process.argv[2] == '--import'){
    importData();
}else if(process.argv[2] == '--delete'){
    deleteData();
}