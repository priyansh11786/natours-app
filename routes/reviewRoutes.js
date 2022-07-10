const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

router.use(authController.protect)

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setParams,
        reviewController.createReviews
    )

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('user'),
        reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'),
        reviewController.updateReview)

module.exports = router;