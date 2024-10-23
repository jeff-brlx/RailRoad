const router = require("express").Router()
const TrainstationsController = require('../controllers/trainstations.controllers')
const AuthMiddleware = require('../middlewares/auth.middleware')

// List all trainstations
router.get('/', TrainstationsController)
// Read a trainstation
router.get('/:id', TrainstationsController)

// Create a trainstation
router.post('/', AuthMiddleware.verifyUserOrAdmin, TrainstationsController)
// Update a trainstation
router.put('/:id', AuthMiddleware.verifyUserOrAdmin, TrainstationsController)
// Delete a trainstation
router.delete('/:id', AuthMiddleware.verifyUserOrAdmin, TrainstationsController)


