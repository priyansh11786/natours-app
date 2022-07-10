const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('.././models/userModel')

const tourSchema = new mongoose.Schema({
    name: {
      type: 'String',
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
    },
    slug: 'String',
    duration: {
        type: 'Number',
        required:[true, 'A tour must have a durations']
    },
    maxGroupSize: {
        type: 'Number',
        required:[true, 'A tour must have a max group size']
    },
    difficulty:{
        type: 'String', 
        required:[true, 'A tour must have a difficulty'],
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
      type: 'Number',
      default: 3.6, 
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: 'Number',
        default: 0
    },
    price: {
      type: 'Number',
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: 'Number',
        validate: {
            validator: function (val){
                //this keyword is only valid when the document is created for the first time, it doesn't work when update is done
                //using post request 
                return val < this.price
            },
            message: "Discount price should be below Original price"
        }
    },
    summary: {
        type: 'String',
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: 'String',
        trim: true
    },
    imageCover: {
        type: 'String',
        required: [true, 'A tour must have a imageCover']
    },
    images : ['String'],
    secretTour: {
        type: 'Boolean',
        default: false
    },
    createdAt: {
        type: 'Date',
        default: Date.now(),
        select: false
    },
    startDates: ['Date'],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  })

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
  })

  tourSchema.index({ startLocation : '2dsphere'})

  //Virtual populate, we basically include a reviews field in our tourSchema
  //which will not be persisted in out DB
  tourSchema.virtual('reviews',{
    ref: 'review',
    foreignField: 'tour',
    localField: '_id'
  })

  //This is normal populate whose effect will be persisted on the DB
  tourSchema.pre(/^find/, function(next){
    this.populate({
      path: 'guides',
      select : '-__v -passwordChangedAt'
    })

    next();
  })

  //Document Middleware, this runs between two mongoose methods. Right from when the save() command is issued to the data being 
  //saved to database, runs for save(), create() methods
  //save() returns a document hence this keyword gives an access to the document object
  tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower:true});
    next();
  })
  
  //Query middleware. It runs after Tour.find(),findById() etc are run.
  //find() returns a query hence this keyword gives an access to the query
  tourSchema.pre('/^find/', function(next){
    this.find({secretTour: { $ne: true } })
    this.start = Date.now();    
    next();
  })

  tourSchema.post('/^find/', function(docs,next){
    console.log(docs);
    next();
  })

  //Aggregation Middleware
  // tourSchema.pre('aggregate', function(next){
  //   this.pipeline().unshift({$match : { secretTour: { $ne: true } }})
  //   next();
  // })

  const Tour = new mongoose.model("Tour", tourSchema)

  module.exports = Tour
  