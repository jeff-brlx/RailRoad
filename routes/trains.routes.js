const router = require("express").Router();
const TrainsController = require('../controllers/trains.controllers');
const AuthMiddleware = require('../middlewares/auth.Middleware');

// List  trains
router.get('/tag', TrainsController.listTrains);
router.get('/Id/:id', TrainsController.getTrainById);

// Admin only routes for train management
router.post('/', AuthMiddleware.verifyUserOrAdmin, TrainsController.createTrain);//authMiddleware,
router.put('/:id',AuthMiddleware.verifyUserOrAdmin, TrainsController.updateTrain);//authMiddleware,
router.delete('/:id',AuthMiddleware.verifyUserOrAdmin, TrainsController.deleteTrain);//authMiddleware,

module.exports = router;
