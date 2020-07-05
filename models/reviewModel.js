const mongoose = require("mongoose");
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "A rating must have a rating number"],
      min: [1.0, "Rating number must be 1.0 minimum"],
      max: [5.0, "Rating number must be 5.0 maximum"],
      set: val => Math.round(val * 10) / 10,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  }
,{
  toObject : { virtuals : true},
  toJSON : { virtuals : true}
}); //options

reviewSchema.index({ tour: 1, user: 1 },{ unique: true });

reviewSchema.pre(/^find/, function(next){
  // this.populate({
  //   path : 'tour',
  //   select : 'name'
  // }).populate({
  //   path : 'user',
  //   select : 'name photo'
  // });
  this.populate({
    path : 'user',
    select : 'name photo'
  });
  next();
});

reviewSchema.statics.calcAvgRating = async function(tourId){
  const stats = await this.aggregate([
    {
      $match: {tour: tourId}
    },
    {
      $group:{
        _id: '$tour',
        nRating: {$sum: 1},
        avgRating: {$avg: '$rating'}
      }
    }
  ]);
  // console.log(stats);

  if(stats.length > 0){
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  }else{
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
}

//after save, inserted document will be included, no need to call next()
reviewSchema.post('save', function(){
  this.constructor.calcAvgRating(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next){
  this.r = await this.findOne();
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function(){
  //query has already executed
  await this.r.constructor.calcAvgRating(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
