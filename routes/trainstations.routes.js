const router = require("express").Router()
const TrainstationsController = require('../controllers/trainstations.controllers')
const AuthMiddleware = require('../middlewares/auth.middleware')

// List all trainstations
router.get('/', TrainstationsController.listTrainstations)
// Read a trainstation
router.get('/:id', TrainstationsController.readTrainstation)

// Create a trainstation
router.post('/', AuthMiddleware.verifyUserOrAdmin, TrainstationsController.createTrainstation)
// Update a trainstation
router.put('/:id', AuthMiddleware.verifyUserOrAdmin, TrainstationsController.updateTrainstation)
// Delete a trainstation
router.delete('/:id', AuthMiddleware.verifyUserOrAdmin, TrainstationsController.deleteTrainstation)


