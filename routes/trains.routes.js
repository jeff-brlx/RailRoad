const router = require("express").Router();
const TrainsController = require('../controllers/trains.controllers');
// const authMiddleware = require('../middlewares/security.middleware');

// List all trains
router.get('/listbyfilter', TrainsController.listTrains);

// Admin only routes for train management
router.post('/', TrainsController.createTrain);//authMiddleware,
router.get('/getById/:id', TrainsController.getTrainById);
router.put('/:id',  TrainsController.updateTrain);//authMiddleware,
router.delete('/:id', TrainsController.deleteTrain);//authMiddleware,

module.exports = router;
