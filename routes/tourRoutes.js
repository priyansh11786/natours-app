const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')
const reviewRouter = require('.././routes/reviewRoutes')

router
    .route('/tour-stats')
    .get(tourController.getTourStats)

router
    .route('/top-5-tours')
    .get(tourController.aliasTopTour, tourController.getAllTours)

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, 
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.updateTour)
    .delete(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour)

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithIn)

router
    .route('/center/:latlng/unit/:unit')
    .get(tourController.getDistances)

router.use('/:tourId/reviews', reviewRouter)

module.exports = router;