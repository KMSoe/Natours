const mongoose = require("mongoose");
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
      minlength: [10, "A tour name must have more or equal  10 characters"],
      maxlength: [50, "A tour name must have less or equal  50 characters"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a maximun group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["difficult", "medium", "easy"],
        message: "Difficulty must be either difficult, medium or easy",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, "A Tour must have average rating 1.0 at least"],
      max: [5.0, "A Tour must have average rating 5.0 at most"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a pricing plan"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.price > val;
        },
        message: "Discount {VALUE} must not exceed the price",
      },
    },
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A tour must  have a description"],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must  have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
); //options

tourSchema.index({ startLocation: "2dsphere" });
tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangeAt",
  });
  next();
});
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});
//Document Middileware
// tourSchema.pre('save', async function(next){
//   const guidePromises = this.guides.map(async el => await User.findById(el));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

//Document Middleware
// tourSchema.pre('save',function(next){
//   this.randomStr = "dsgsgs";
//   next();
// });

// tourSchema.post('save',function(doc,next){
//   // console.log(doc);
//   next();
// });

//Query Middleware
// tourSchema.pre('find',function(next){
//   this.find({secretTour : {$ne : true}})
//   next();
// });
// tourSchema.pre(/^find/,function(next){
//   this.find({secretTour : {$ne : true}})
//   next();
// });
// tourSchema.post(/^find/,function(doc,next){
//   console.log(doc);
//   next();
// });

//Aggregate Middleware
// tourSchema.pre('aggregate', function(next){
//   // console.log(this.pipeline());
//   this.pipeline().unshift({ '$match': {secretTour : {$ne : true}} })
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
