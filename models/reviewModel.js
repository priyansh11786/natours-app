const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: 'string',
        required: [true, 'A Review can not be empty']
    },
    rating: {
        type: 'number',
        min: 1,
        max: 5
    },
    createdAt: {
        type: 'Date',
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A Review must belong to a tour']
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

reviewSchema.index({ tour : 1, user : 1}, { unique: true });

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })

    this.populate({
        path: 'user',
        select: 'name photo'
    })

    next();
})

const review = mongoose.model('review', reviewSchema);

module.exports = review;