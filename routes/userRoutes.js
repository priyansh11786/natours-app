const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')

router.post('/signup', authController.signUpUser)
router.post('/login', authController.loginUser)
router.get('/logout', authController.logOutUser)

 
router.post('/forgetPassword', authController.forgetPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.use(authController.protect)

router.patch(
  '/updateMyPassword', 
  authController.updatePassword)

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe)

router.delete('/deleteMe',
    userController.deleteMe)

router.use(authController.restrictTo('admin'))

router
  .route('/') 
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router
  .get('/me', userController.getMe,userController.getUser)

module.exports = router;